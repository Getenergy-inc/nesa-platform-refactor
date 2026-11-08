#!/usr/bin/env python3
"""Apply NESA migrations to a clean PostgreSQL database and diff live metadata.

Default mode creates and destroys a local temporary PostgreSQL cluster. An
existing empty database can be supplied with --database-url. The safety guard
runs before bootstrap or migrations and rejects any existing public objects.
Only Python's standard library and PostgreSQL client/server tools are required.
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import pwd
import shutil
import socket
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
BOOTSTRAP = Path(__file__).with_name("supabase_test_bootstrap.sql")
OBJECTS = {
    "tables": {
        "key": ("schemaname", "tablename"),
        "ignore": ("tableowner",),
        "query": """
SELECT t.schemaname, t.tablename, t.tableowner, c.relrowsecurity AS rls_enabled
FROM pg_tables t JOIN pg_class c ON c.relname=t.tablename
JOIN pg_namespace n ON n.oid=c.relnamespace AND n.nspname=t.schemaname
WHERE t.schemaname='public' ORDER BY 1,2
""",
    },
    "columns": {
        "key": ("table_schema", "table_name", "column_name"),
        "query": """
SELECT table_schema,table_name,ordinal_position,column_name,data_type,udt_name,
is_nullable,column_default,character_maximum_length,numeric_precision,numeric_scale
FROM information_schema.columns WHERE table_schema='public'
ORDER BY table_name,ordinal_position
""",
    },
    "views": {
        "key": ("table_schema", "table_name"),
        "query": """
SELECT table_schema,table_name,view_definition FROM information_schema.views
WHERE table_schema='public' ORDER BY 1,2
""",
    },
    "matviews": {
        "key": ("schemaname", "matviewname"),
        "query": """
SELECT schemaname,matviewname,matviewowner,definition FROM pg_matviews
WHERE schemaname='public' ORDER BY 1,2
""",
    },
    "enums": {
        "key": ("schema_name", "enum_name", "enumlabel"),
        "query": """
SELECT n.nspname AS schema_name,t.typname AS enum_name,e.enumsortorder,e.enumlabel
FROM pg_type t JOIN pg_enum e ON t.oid=e.enumtypid
JOIN pg_namespace n ON n.oid=t.typnamespace
WHERE n.nspname='public' ORDER BY 1,2,3
""",
    },
    "indexes": {
        "key": ("schemaname", "tablename", "indexname"),
        "query": """
SELECT schemaname,tablename,indexname,indexdef FROM pg_indexes
WHERE schemaname='public' ORDER BY 1,2,3
""",
    },
    "constraints": {
        "key": ("table_schema", "table_name", "constraint_name", "column_name", "ordinality"),
        "query": """
SELECT tc.table_schema,tc.table_name,tc.constraint_name,tc.constraint_type,
COALESCE(kcu.column_name,'') AS column_name,COALESCE(kcu.ordinal_position,0) AS ordinality,
COALESCE(ccu.table_schema,'') AS foreign_table_schema,
COALESCE(ccu.table_name,'') AS foreign_table_name,
COALESCE(ccu.column_name,'') AS foreign_column_name,
pg_get_constraintdef(pc.oid) AS definition
FROM information_schema.table_constraints tc
JOIN pg_namespace ns ON ns.nspname=tc.constraint_schema
JOIN pg_constraint pc ON pc.connamespace=ns.oid AND pc.conname=tc.constraint_name
JOIN pg_class rel ON rel.oid=pc.conrelid AND rel.relname=tc.table_name
LEFT JOIN information_schema.key_column_usage kcu
 ON kcu.constraint_catalog=tc.constraint_catalog AND kcu.constraint_schema=tc.constraint_schema
 AND kcu.constraint_name=tc.constraint_name AND kcu.table_name=tc.table_name
LEFT JOIN information_schema.referential_constraints rc
 ON rc.constraint_catalog=tc.constraint_catalog AND rc.constraint_schema=tc.constraint_schema
 AND rc.constraint_name=tc.constraint_name
LEFT JOIN information_schema.key_column_usage fk
 ON fk.ordinal_position=kcu.ordinal_position
 AND fk.constraint_catalog=rc.unique_constraint_catalog
 AND fk.constraint_schema=rc.unique_constraint_schema
 AND fk.constraint_name=rc.unique_constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu
 ON (tc.constraint_type='FOREIGN KEY' AND ccu.constraint_catalog=rc.unique_constraint_catalog
 AND ccu.constraint_schema=rc.unique_constraint_schema AND ccu.constraint_name=rc.unique_constraint_name
 AND ccu.column_name=fk.column_name)
 OR (tc.constraint_type<>'FOREIGN KEY' AND ccu.constraint_catalog=tc.constraint_catalog
 AND ccu.constraint_schema=tc.constraint_schema AND ccu.constraint_name=tc.constraint_name
 AND ccu.column_name=kcu.column_name)
WHERE tc.table_schema='public' ORDER BY 1,2,3,4,5
""",
    },
    "sequences": {
        "key": ("schemaname", "sequencename"),
        "ignore": ("last_value",),
        "query": """
SELECT schemaname,sequencename,start_value,min_value,max_value,increment_by,cycle,cache_size,last_value
FROM pg_sequences WHERE schemaname='public' ORDER BY 1,2
""",
    },
    "functions": {
        "key": ("schema_name", "function_name", "arguments"),
        "query": """
SELECT n.nspname AS schema_name,p.proname AS function_name,
pg_get_function_arguments(p.oid) AS arguments,pg_get_function_result(p.oid) AS return_type,
p.prosecdef AS security_definer,p.provolatile,p.prokind,l.lanname AS language,
p.prosrc AS source_body,COALESCE(p.proconfig::text,'') AS proconfig
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
JOIN pg_language l ON l.oid=p.prolang
WHERE n.nspname='public' ORDER BY 1,2,3
""",
    },
    "triggers": {
        "key": ("schema_name", "table_name", "trigger_name"),
        "query": """
SELECT n.nspname AS schema_name,c.relname AS table_name,t.tgname AS trigger_name,
p.proname AS function_name,t.tgenabled AS enabled,pg_get_triggerdef(t.oid) AS trigger_definition
FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
JOIN pg_namespace n ON n.oid=c.relnamespace JOIN pg_proc p ON p.oid=t.tgfoid
WHERE NOT t.tgisinternal AND n.nspname='public' ORDER BY 1,2,3
""",
    },
    "policies": {
        "key": ("schemaname", "tablename", "policyname"),
        "query": """
SELECT schemaname,tablename,policyname,permissive,roles,cmd,qual,with_check
FROM pg_policies WHERE schemaname='public' ORDER BY 1,2,3
""",
    },
    "grants": {
        "key": ("schema_name", "table_name"),
        "query": """
SELECT n.nspname AS schema_name,c.relname AS table_name,COALESCE(c.relacl::text,'') AS raw_acl
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relkind IN ('r','v','m','f','p') ORDER BY 1,2
""",
    },
    "extensions": {
        "key": ("extname",),
        "query": """
SELECT e.extname,n.nspname AS schema_name,e.extversion FROM pg_extension e
JOIN pg_namespace n ON n.oid=e.extnamespace ORDER BY 1
""",
    },
}


def normalize(value: object, field: str = "") -> str:
    text = "" if value is None else str(value)
    text = text.replace("\r\n", "\n").replace("\r", "\n").strip()
    if field == "raw_acl" and text.startswith("{") and text.endswith("}"):
        return "{" + ",".join(sorted(text[1:-1].split(","))) + "}"
    if field == "roles" and text.startswith("{") and text.endswith("}"):
        return "{" + ",".join(sorted(text[1:-1].split(","))) + "}"
    if field == "proconfig" and "," in text:
        return ",".join(sorted(part.strip() for part in text.split(",")))
    return text


def compare_rows(kind: str, expected: list[dict], actual: list[dict], key: tuple[str, ...], ignore: tuple[str, ...] = ()) -> dict:
    def keyed(rows):
        result = {}
        for row in rows:
            identity = tuple(normalize(row.get(k)) for k in key)
            if identity in result:
                raise ValueError(f"duplicate {kind} identity: {identity}")
            result[identity] = row
        return result

    source, target = keyed(expected), keyed(actual)
    result = {"expected": len(source), "actual": len(target), "missing": [], "unexpected": [], "changed": []}
    for identity in sorted(source.keys() - target.keys()):
        result["missing"].append({"key": list(identity), "row": source[identity]})
    for identity in sorted(target.keys() - source.keys()):
        result["unexpected"].append({"key": list(identity), "row": target[identity]})
    for identity in sorted(source.keys() & target.keys()):
        fields = {}
        names = set(source[identity]) | set(target[identity])
        for name in sorted(names - set(key) - set(ignore)):
            before, after = normalize(source[identity].get(name), name), normalize(target[identity].get(name), name)
            if before != after:
                fields[name] = {"expected": before, "actual": after}
        if fields:
            result["changed"].append({"key": list(identity), "fields": fields})
    result["passed"] = not (result["missing"] or result["unexpected"] or result["changed"])
    return result


def discover_migrations(directory: Path, expected_count: int = 169) -> list[Path]:
    migrations = sorted(directory.glob("*.sql"), key=lambda path: path.name)
    names = [path.name for path in migrations]
    if len(names) != len(set(names)):
        raise ValueError("duplicate migration filenames")
    if len(migrations) != expected_count:
        raise ValueError(f"expected {expected_count} migrations, found {len(migrations)}")
    return migrations


def run(command: list[str], **kwargs) -> subprocess.CompletedProcess:
    return subprocess.run(command, text=True, capture_output=True, **kwargs)


def psql(database_url: str, sql: str | None = None, file: Path | None = None, csv_output: bool = False) -> subprocess.CompletedProcess:
    command = ["psql", database_url, "-X", "-v", "ON_ERROR_STOP=1", "--no-psqlrc"]
    if csv_output:
        command.append("--csv")
    if file is not None:
        command.extend(["-f", str(file)])
    else:
        command.extend(["-c", sql or ""])
    return run(command)


def require_success(result: subprocess.CompletedProcess, label: str) -> None:
    if result.returncode:
        raise RuntimeError(f"{label}\n{result.stderr.strip()}\n{result.stdout.strip()}".strip())


def assert_clean(database_url: str) -> None:
    result = psql(database_url, sql="""
SELECT COALESCE(string_agg(kind||': '||name, E'\\n'),'') FROM (
 SELECT 'table' AS kind,tablename AS name FROM pg_tables WHERE schemaname='public'
 UNION ALL SELECT 'view',table_name FROM information_schema.views WHERE table_schema='public'
 UNION ALL SELECT 'type',t.typname FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace
  WHERE n.nspname='public' AND t.typtype='e'
 UNION ALL SELECT 'function',p.proname FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
  WHERE n.nspname='public'
) objects
""")
    require_success(result, "could not inspect target cleanliness")
    objects = result.stdout.strip()
    if objects:
        raise RuntimeError("REFUSING NON-CLEAN DATABASE; existing public objects:\n" + objects)


def read_csv(path: Path) -> list[dict]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def capture_metadata(database_url: str, metadata_dir: Path, output_dir: Path) -> dict:
    output_dir.mkdir(parents=True, exist_ok=True)
    comparison = {}
    for kind, config in OBJECTS.items():
        source_path = metadata_dir / f"{kind}.csv"
        if not source_path.is_file():
            comparison[kind] = {"passed": False, "error": f"missing exported metadata: {source_path.name}"}
            continue
        result = psql(database_url, sql=config["query"], csv_output=True)
        require_success(result, f"could not introspect {kind}")
        target_path = output_dir / f"{kind}.csv"
        target_path.write_text(result.stdout, encoding="utf-8")
        expected, actual = read_csv(source_path), read_csv(target_path)
        comparison[kind] = compare_rows(kind, expected, actual, config["key"], config.get("ignore", ()))
    return comparison


def free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


class TemporaryPostgres:
    def __init__(self, work: Path):
        self.work = work
        self.data = work / "data"
        self.socket = work / "socket"
        self.port = free_port()
        self.user = None
        self.started = False
        if os.geteuid() == 0:
            candidates = [os.environ.get("SUDO_USER"), "lovable", "nobody"]
            self.user = next((name for name in candidates if name and name in {entry.pw_name for entry in pwd.getpwall()}), None)
            if not self.user:
                raise RuntimeError("PostgreSQL refuses root; run as a non-root user or provide --database-url")
        self.data.mkdir()
        self.socket.mkdir()
        if self.user:
            shutil.chown(self.work, self.user)
            shutil.chown(self.data, self.user)
            shutil.chown(self.socket, self.user)

    def command(self, executable: str, args: list[str]) -> list[str]:
        base = [executable, *args]
        if not self.user:
            return base
        account = pwd.getpwnam(self.user)
        return ["setpriv", f"--reuid={account.pw_uid}", f"--regid={account.pw_gid}", "--clear-groups", *base]

    def start(self) -> str:
        for executable in ("initdb", "pg_ctl", "psql"):
            if not shutil.which(executable):
                raise RuntimeError(f"missing PostgreSQL tool: {executable}")
        result = run(self.command("initdb", ["-D", str(self.data), "-U", "postgres", "--auth=trust", "--no-locale", "--encoding=UTF8"]))
        require_success(result, "initdb failed")
        log = self.work / "postgres.log"
        if self.user:
            shutil.chown(log.parent, self.user)
        options = f"-F -h 127.0.0.1 -k {self.socket} -p {self.port}"
        result = run(self.command("pg_ctl", ["-D", str(self.data), "-l", str(log), "-o", options, "-w", "start"]))
        require_success(result, "PostgreSQL startup failed; see " + str(log))
        self.started = True
        return f"postgresql://postgres@127.0.0.1:{self.port}/postgres"

    def create_database(self, admin_url: str) -> str:
        require_success(psql(admin_url, sql="CREATE DATABASE nesa_restore"), "could not create isolated test database")
        return f"postgresql://postgres@127.0.0.1:{self.port}/nesa_restore"

    def stop(self) -> None:
        if self.started:
            run(self.command("pg_ctl", ["-D", str(self.data), "-m", "fast", "-w", "stop"]))


def write_reports(report_dir: Path, report: dict) -> None:
    report_dir.mkdir(parents=True, exist_ok=True)
    (report_dir / "restore-schema-report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# Clean-database schema restore test", "",
        f"- Status: **{report['status'].upper()}**",
        f"- Migrations discovered: **{report['migration_count']}**",
        f"- Migrations applied: **{report['applied_count']}**",
        f"- Schema comparison: **{report.get('comparison_status', 'not run')}**",
        "- Production contacted or modified: **NO**", "",
        "This checks reconstruction from migrations against the exported metadata snapshot. It is not a data restore, an Auth/Storage implementation test, or proof of application parity.", "",
    ]
    if report.get("failed_migration"):
        failure = report["failed_migration"]
        lines.extend([f"Migration failed: `{failure['file']}`", "", "```text", failure["error"], "```", ""])
    if report.get("comparison"):
        lines.extend(["| Object | Live rows | Restored rows | Missing | Unexpected | Changed | Result |", "|---|---:|---:|---:|---:|---:|---|"])
        for kind, diff in report["comparison"].items():
            if "error" in diff:
                lines.append(f"| {kind} | — | — | — | — | — | ERROR: {diff['error']} |")
            else:
                lines.append(f"| {kind} | {diff['expected']} | {diff['actual']} | {len(diff['missing'])} | {len(diff['unexpected'])} | {len(diff['changed'])} | {'PASS' if diff['passed'] else 'FAIL'} |")
        lines.append("")
    lines.append("Full expected/actual differences are in `restore-schema-report.json`; restored metadata is in `actual-metadata/`.")
    (report_dir / "RESTORE_SCHEMA_REPORT.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database-url", help="existing EMPTY database; refuses existing public objects")
    parser.add_argument("--migrations", type=Path, default=ROOT / "supabase/migrations")
    parser.add_argument("--metadata", type=Path, default=ROOT / "database/metadata")
    parser.add_argument("--report-dir", type=Path, default=ROOT / "migration-results/restore-schema")
    parser.add_argument("--expected-count", type=int, default=169)
    parser.add_argument("--keep-database", action="store_true", help="keep the temporary cluster running for debugging (prints its URL)")
    args = parser.parse_args()
    started = datetime.now(timezone.utc)
    report = {
        "status": "failed", "started_at": started.isoformat(), "migration_count": 0,
        "applied_count": 0, "applied_migrations": [], "failed_migration": None,
        "comparison_status": "not run", "comparison": {}, "production_modified": False,
        "bootstrap_note": "Minimal auth/storage compatibility only; not a managed-service implementation.",
    }
    cluster = None
    work = Path(tempfile.mkdtemp(prefix="nesa-restore-test-"))
    database_url = args.database_url
    try:
        migrations = discover_migrations(args.migrations.resolve(), args.expected_count)
        report["migration_count"] = len(migrations)
        if not args.metadata.is_dir():
            raise RuntimeError(f"metadata directory not found: {args.metadata}")
        if not BOOTSTRAP.is_file():
            raise RuntimeError(f"bootstrap file not found: {BOOTSTRAP}")
        if database_url is None:
            cluster = TemporaryPostgres(work)
            database_url = cluster.create_database(cluster.start())
            report["temporary_database"] = True
        else:
            report["temporary_database"] = False
        report["database_url"] = database_url if cluster else "supplied (redacted)"
        assert_clean(database_url)
        require_success(psql(database_url, file=BOOTSTRAP), "managed-service compatibility bootstrap failed")
        for migration in migrations:
            print(f"[{report['applied_count'] + 1}/{len(migrations)}] {migration.name}", flush=True)
            result = psql(database_url, file=migration)
            if result.returncode:
                report["failed_migration"] = {"file": migration.name, "error": (result.stderr + result.stdout).strip()}
                break
            report["applied_count"] += 1
            report["applied_migrations"].append(migration.name)
            (args.report_dir / "migration-logs").mkdir(parents=True, exist_ok=True)
            (args.report_dir / "migration-logs" / f"{migration.name}.log").write_text(result.stdout + result.stderr, encoding="utf-8")
        report["comparison"] = capture_metadata(database_url, args.metadata.resolve(), args.report_dir / "actual-metadata")
        differences = sum(len(v.get("missing", [])) + len(v.get("unexpected", [])) + len(v.get("changed", [])) for v in report["comparison"].values())
        errors = [k for k, v in report["comparison"].items() if "error" in v]
        report["comparison_status"] = "passed" if not differences and not errors else "failed"
        report["difference_count"] = differences
        report["status"] = "passed" if report["applied_count"] == len(migrations) and report["comparison_status"] == "passed" else "failed"
    except Exception as error:
        report["error"] = str(error)
    finally:
        report["finished_at"] = datetime.now(timezone.utc).isoformat()
        if cluster and not args.keep_database:
            cluster.stop()
        elif cluster:
            report["kept_database_url"] = database_url
        write_reports(args.report_dir, report)
        if not args.keep_database:
            shutil.rmtree(work, ignore_errors=True)
    print(f"Restore test: {report['status'].upper()}; applied {report['applied_count']}/{report['migration_count']}; schema differences: {report.get('difference_count', 'not compared')}")
    print(f"Report: {args.report_dir / 'RESTORE_SCHEMA_REPORT.md'}")
    if report.get("error"):
        print(report["error"], file=sys.stderr)
    return 0 if report["status"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
