# Clean-database schema restore test

`restore_schema_test.py` applies the checked-in SQL migrations in filename order to an empty PostgreSQL database, then compares the restored public schema with the exported live CSV metadata. It uses only Python's standard library and PostgreSQL tools.

## Safety and scope

- By default it creates a temporary local PostgreSQL cluster and destroys it afterward.
- `--database-url` is only for an isolated empty test database. The runner refuses existing public tables, views, enum types or functions before bootstrap or migration.
- Each migration runs in its own transaction. A failed migration is rolled back.
- The small bootstrap represents hosted Auth, Storage and Realtime prerequisites; it is not an implementation of those services.
- No production data is required or copied. This is a schema reconstruction test, not a data restore or application-parity test.
- Optional historical business-data fixtures live under `database/seed/` in the migration package and are not replayed by the schema test.
- Hosted creator default table grants are reproduced in the bootstrap; RLS remains the row-access control. The harness-only `sandbox_exec` ACL entry is ignored during comparison.
- `supabase_vault` is the sole explicit platform exclusion because it is hosted-only. No fake local replacement is created; every exclusion is printed in the report.

## Run

From the migration package root:

```bash
python3 migration-tools/restore_schema_test.py
```

Strict mode stops at the first failed migration and exits nonzero. To attempt every migration atomically and collect all blockers:

```bash
python3 migration-tools/restore_schema_test.py --continue-on-error
```

To use an existing isolated empty database:

```bash
python3 migration-tools/restore_schema_test.py --database-url "$TEST_DATABASE_URL"
```

Optional paths:

```bash
python3 migration-tools/restore_schema_test.py \
  --migrations supabase/migrations \
  --metadata database/metadata \
  --report-dir migration-results/restore-schema
```

The test expects 169 migrations by default. Reports contain applied/failed migrations, expected/actual/missing/unexpected/changed object counts, detailed field differences, blank exported fields marked unverified, and explicit platform exclusions. A nonzero exit is required for any failed migration, schema drift or incomplete comparison.

The supplied repaired strict run applies 169/169 migrations with zero application-schema differences and zero unverified views. All 17 expected view definitions were exported from the authoritative live schema and compared using PostgreSQL's canonical view deparser.

Run comparator unit tests with:

```bash
python3 -m unittest discover -s migration-tools -p 'test_*.py' -v
```
