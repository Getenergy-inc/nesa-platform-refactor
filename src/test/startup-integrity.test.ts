/**
 * Guards against the malicious start-up code removed from this project in
 * Oct/Nov 2026. Mirrors scripts/check-startup-integrity.sh.
 */
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync, openSync, readSync, closeSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

// Built from pieces so this file never matches its own patterns.
const FORBIDDEN: RegExp[] = [
  new RegExp("node " + "init\\b"),
  new RegExp("node " + "api\\.js"),
  new RegExp("createRequire" + "\\(import\\.meta\\.url\\)"),
  new RegExp("allowAutomatic" + "Tasks"),
];

const SKIP_DIRS = new Set(["node_modules", ".git", ".lovable", "docs", "dist", ".workspace"]);
const SKIP_FILES = new Set([
  "scripts/check-startup-integrity.sh",
  "src/test/startup-integrity.test.ts",
  "bun.lock",
  "bun.lockb",
  "package-lock.json",
]);
const TEXT_EXT = /\.(c|m)?(j|t)sx?$|\.json$|\.sh$|\.toml$|\.ya?ml$|\.html$|\.css$/;
const FONT_EXT = /\.(woff2?|ttf|otf)$/i;
const FONT_SIGNATURES = ["774f4646", "774f4632", "00010000", "4f54544f", "74727565", "74746366"];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(ROOT);

describe("start-up integrity", () => {
  it("has no start-up loader patterns anywhere in the project", () => {
    const hits: string[] = [];
    for (const f of files) {
      const rel = relative(ROOT, f);
      if (SKIP_FILES.has(rel) || !TEXT_EXT.test(f)) continue;
      const text = readFileSync(f, "utf8");
      for (const re of FORBIDDEN) if (re.test(text)) hits.push(`${rel}: ${re.source}`);
    }
    expect(hits).toEqual([]);
  });

  it("package.json scripts only run the known generators and tools", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    const scripts = Object.values(pkg.scripts ?? {}) as string[];
    for (const s of scripts) for (const re of FORBIDDEN) expect(s).not.toMatch(re);
  });

  it("has no editor auto-run task or root loader files", () => {
    for (const f of [".vscode/tasks.json", "api.js", "init.js", "init"]) {
      expect(existsSync(join(ROOT, f)), f).toBe(false);
    }
  });

  it("every font file is a real font", () => {
    const fake: string[] = [];
    for (const f of files.filter((x) => FONT_EXT.test(x))) {
      const fd = openSync(f, "r");
      const buf = Buffer.alloc(4);
      readSync(fd, buf, 0, 4, 0);
      closeSync(fd);
      if (!FONT_SIGNATURES.includes(buf.toString("hex"))) fake.push(relative(ROOT, f));
    }
    expect(fake).toEqual([]);
  });
});
