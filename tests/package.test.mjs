import assert from "node:assert/strict";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), "workbuddy-package-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  for (const path of ["package.json", "mcp.json", "connector-meta.json", "icon.png", "README.md", "LICENSE", "scripts", "skills", "tests"]) {
    cpSync(join(root, path), join(directory, path), {
      recursive: true,
      filter: (source) => !source.split(/[\\/]/).some((part) => part === ".DS_Store" || part === "__MACOSX" || part.startsWith("._")),
    });
  }
  mkdirSync(join(directory, "docs"));
  return directory;
}
function run(directory, command, args) {
  const result = spawnSync(command, args, { cwd: directory, encoding: "utf8" });
  assert.ifError(result.error);
  return { status: result.status, output: result.stdout + result.stderr };
}
function changeJson(directory, path, change) {
  const fullPath = join(directory, path);
  const value = JSON.parse(readFileSync(fullPath, "utf8"));
  change(value);
  writeFileSync(fullPath, JSON.stringify(value, null, 2) + "\n");
}

test("repository package passes from an isolated checkout", (t) => {
  const result = run(fixture(t), process.execPath, ["scripts/verify-package.mjs"]);
  assert.equal(result.status, 0, result.output);
});

test("packaging succeeds without developer docs or a checklist", (t) => {
  const directory = fixture(t);
  rmSync(join(directory, "docs"), { recursive: true });
  const result = run(directory, "python3", ["scripts/package-release.py"]);
  assert.equal(result.status, 0, result.output);
});

test("unpublished checklist links do not block package validation", (t) => {
  const directory = fixture(t);
  writeFileSync(join(directory, "docs/RELEASE_CHECKLIST.md"), "# 发布清单\n[缺失](missing.md)\n");
  const result = run(directory, process.execPath, ["scripts/verify-package.mjs"]);
  assert.equal(result.status, 0, result.output);
});

test("new linked reference does not require a hardcoded file registry", (t) => {
  const directory = fixture(t);
  writeFileSync(join(directory, "skills/kling-ai-plugin/references/extra-guide.md"), "# Extra guide\n");
  const path = join(directory, "skills/kling-ai-plugin/SKILL.md");
  writeFileSync(path, readFileSync(path, "utf8") + "\n[Extra guide](references/extra-guide.md)\n");
  const result = run(directory, process.execPath, ["scripts/verify-package.mjs"]);
  assert.equal(result.status, 0, result.output);
});

test("release version numbers are not treated as hidden model names", (t) => {
  const directory = fixture(t);
  for (const path of ["package.json", "connector-meta.json"]) {
    changeJson(directory, path, (value) => { value.version = "1.4.0"; });
  }
  const result = run(directory, process.execPath, ["scripts/verify-package.mjs"]);
  assert.equal(result.status, 0, result.output);
});

for (const [label, mutate] of [
  ["renamed MCP server", (dir) => changeJson(dir, "mcp.json", (value) => {
    value.mcpServers["wrong-name"] = value.mcpServers["kling-ai-plugin"];
    delete value.mcpServers["kling-ai-plugin"];
  })],
  ["non-release endpoint in release config", (dir) => changeJson(dir, "mcp.json", (value) => {
    value.mcpServers["kling-ai-plugin"].url = "https://example.invalid/mcp";
  })],
  ["China endpoint in Global config", (dir) => changeJson(dir, "mcp.json", (value) => {
    value.mcpServers["kling-ai-plugin"].url = "https://klingai.com/mcp/plugin";
  })],
  ["China website in Global documentation", (dir) => {
    const path = join(dir, "README.md");
    writeFileSync(path, readFileSync(path, "utf8") + "\n[Membership](https://klingai.com/app/membership/membership-plan)\n");
  }],
  ["Chinese text in Global documentation", (dir) => {
    const path = join(dir, "README.md");
    writeFileSync(path, readFileSync(path, "utf8") + "\n国内版说明\n");
  }],
  ["Chinese text in English examples", (dir) => changeJson(dir, "connector-meta.json", (value) => {
    value.examples_en[0] = "生成图片";
  })],
  ["missing timeout", (dir) => changeJson(dir, "mcp.json", (value) => {
    delete value.mcpServers["kling-ai-plugin"].timeout;
  })],
  ["mismatched release versions", (dir) => changeJson(dir, "connector-meta.json", (value) => { value.version = "0.0.0"; })],
  ["missing video Skill", (dir) => rmSync(join(dir, "skills/kling-ai-generate-video/SKILL.md"))],
  ["missing standard video recommendations", (dir) => rmSync(join(dir, "skills/kling-ai-generate-video/references/standard-video.md"))],
  ["missing omni video recommendations", (dir) => rmSync(join(dir, "skills/kling-ai-generate-video/references/omni-video.md"))],
  ...["capability-discovery", "output-options", "reference-inputs", "audio-options", "task-results"].map((name) => [
    `missing ${name} module`, (dir) => rmSync(join(dir, `skills/kling-ai-plugin/references/${name}.md`)),
  ]),
  ["credential file under skills", (dir) => writeFileSync(join(dir, "skills/.credentials"), "dummy fixture")],
  ["backup file under skills", (dir) => writeFileSync(join(dir, "skills/SKILL.md.bak"), "dummy fixture")],
  ["hidden model name in release documentation", (dir) => {
    const path = join(dir, "README.md");
    writeFileSync(path, readFileSync(path, "utf8") + "\n推荐 V4 Flash\n");
  }],
  ["link to an existing but unpackaged document", (dir) => {
    writeFileSync(join(dir, "docs/not-shipped.md"), "# 未发布文档\n");
    writeFileSync(join(dir, "README.md"), readFileSync(join(dir, "README.md"), "utf8") + "\n[说明](docs/not-shipped.md)\n");
  }],
  ["Skill name outside frontmatter", (dir) => {
    const path = join(dir, "skills/kling-ai-plugin/SKILL.md");
    writeFileSync(path, readFileSync(path, "utf8").replace("name: kling-ai-plugin\n", "") + "\nname: kling-ai-plugin\n");
  }],
]) {
  test(`rejects ${label}`, (t) => {
    const directory = fixture(t);
    mutate(directory);
    const result = run(directory, process.execPath, ["scripts/verify-package.mjs"]);
    assert.notEqual(result.status, 0, result.output);
  });
}

test("packaging invalid config fails before replacing an existing archive", (t) => {
  const directory = fixture(t);
  const { version } = JSON.parse(readFileSync(join(directory, "package.json"), "utf8"));
  const archive = join(directory, `[国际]kling-workbuddy-v${version}.zip`);
  writeFileSync(archive, "previous archive");
  changeJson(directory, "mcp.json", (value) => { value.mcpServers = {}; });
  const result = run(directory, "python3", ["scripts/package-release.py"]);
  assert.notEqual(result.status, 0, result.output);
  assert.equal(readFileSync(archive, "utf8"), "previous archive");
});

test("real ZIP contains release files and excludes development and macOS files", (t) => {
  const directory = fixture(t);
  writeFileSync(join(directory, "skills/.DS_Store"), "fixture");
  writeFileSync(join(directory, "skills/._fixture"), "fixture");
  const result = run(directory, "python3", ["scripts/package-release.py"]);
  assert.equal(result.status, 0, result.output);
  const inspect = run(directory, "python3", ["-c", `
import json, zipfile
from pathlib import Path
package = json.loads(Path('package.json').read_text())
with zipfile.ZipFile(f"[国际]kling-workbuddy-v{package['version']}.zip") as archive:
    assert archive.testzip() is None
    print(json.dumps(archive.namelist()))
`]);
  assert.equal(inspect.status, 0, inspect.output);
  const entries = JSON.parse(inspect.output);
  for (const name of ["package.json", "mcp.json", "connector-meta.json", "skills/kling-ai-generate-video/SKILL.md", "skills/kling-ai-generate-video/references/standard-video.md", "skills/kling-ai-generate-video/references/omni-video.md"]) {
    assert.ok(entries.includes(name), `ZIP missing ${name}`);
  }
  assert.ok(entries.every((name) => !/^(docs|scripts|tests|\.git)\//.test(name)));
  assert.ok(entries.every((name) => !name.split("/").some((part) => part === ".DS_Store" || part === "__MACOSX" || part.startsWith("._"))));
});
