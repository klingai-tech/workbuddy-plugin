#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (path) => readFileSync(join(root, path), "utf8");
const readJson = (path) => {
  try { return JSON.parse(read(path)); }
  catch { failures.push(`missing or invalid JSON: ${path}`); return {}; }
};
const insideRoot = (path) => {
  const local = relative(root, path);
  return local !== ".." && !local.startsWith(`..${sep}`) && !isAbsolute(local);
};
const isMacMetadata = (name) => name === ".DS_Store" || name === "__MACOSX" || name.startsWith("._");
const releaseAllowlist = ["mcp.json", "connector-meta.json", "icon.png", "skills/", "README.md", "LICENSE"];
const skills = ["kling-ai-plugin", "kling-ai-generate-image", "kling-ai-generate-video"];

const packageJson = readJson("package.json");
const connector = readJson("connector-meta.json");
const mcp = readJson("mcp.json");
check(packageJson.name === "kling-ai-plugin", "package name must be kling-ai-plugin");
check(/^\d+\.\d+\.\d+$/.test(packageJson.version ?? ""), "package version must be semantic x.y.z");
check(packageJson.private !== true, "release package must not be private");
check(connector.version === packageJson.version, "connector version must match package version");
check(connector.source === "kling-ai-plugin" && connector.type === "mcp", "connector must use the stable kling-ai-plugin MCP identity");
check(connector.name === "Kling AI" && connector.name_en === connector.name && Boolean(connector.name_zh), "localized connector names are missing or inconsistent");
for (const field of ["description", "description_zh"]) {
  check(typeof connector[field] === "string" && connector[field].length > 0 && connector[field] === packageJson[field], `${field} must match package and connector metadata`);
}
check(connector.description_en === connector.description, "English connector descriptions must match");
for (const value of [packageJson.description, connector.name, connector.name_en, connector.description, connector.description_en, ...(connector.examples_en ?? [])]) {
  check(typeof value === "string" && !/\p{Script=Han}/u.test(value), "primary Global metadata and English examples must use English");
}
check(packageJson.license === "MIT" && packageJson.author === "KLING AI Pte Ltd", "unexpected release license or author");
check(Object.keys(mcp.mcpServers ?? {}).join() === "kling-ai-plugin", "only kling-ai-plugin may be registered");
const server = mcp.mcpServers?.["kling-ai-plugin"];
check(server?.url === "https://kling.ai/mcp/plugin", "unexpected release MCP URL");
check(server?.type === "http", "Kling MCP transport must be http");
check(server?.timeout === 30000, "Kling MCP timeout must remain 30000");
check(Array.isArray(packageJson.files) && JSON.stringify([...packageJson.files].sort()) === JSON.stringify([...releaseAllowlist].sort()), "package files must match the connector-only release allowlist");

// Inspect files that will actually be shipped, not incidental files in the checkout.
const releasePaths = new Set();
function collect(path, output) {
  const absolute = resolve(root, path);
  if (!insideRoot(absolute) || !existsSync(absolute)) {
    failures.push(`missing or external file: ${path}`);
    return;
  }
  const stat = lstatSync(absolute);
  if (stat.isSymbolicLink()) {
    failures.push(`symbolic links are not supported in package content: ${path}`);
  } else if (stat.isDirectory()) {
    for (const name of readdirSync(absolute)) {
      if (!isMacMetadata(name)) collect(join(path, name), output);
    }
  } else if (stat.isFile()) output.add(absolute);
}
for (const path of ["package.json", ...releaseAllowlist]) collect(path, releasePaths);
// Keep development files and rollout-only model names out of the public package.
const restrictedModelName = /\bv4(?:[._-]?0)?(?:[ _-]?flash)?\b|(?<![\w.])4\.0(?![\w.])/i;
for (const path of releasePaths) {
  const local = relative(root, path);
  if (local.startsWith(`skills${sep}`)) {
    check(!local.split(sep).some((name) => name.startsWith(".") || /\.(bak|tmp|log)$/i.test(name)), `development or hidden file in published skills: ${local}`);
  }
  if (/\.(md|json)$/.test(path)) {
    const content = readFileSync(path, "utf8");
    check(!restrictedModelName.test(content), `rollout-only model name in published file: ${local}`);
    check(!/https?:\/\/(?:[\w-]+\.)*klingai\.com\b/i.test(content), `China endpoint or website in Global package: ${local}`);
    if (path.endsWith(".md")) {
      check(!/\p{Script=Han}/u.test(content), `Global documentation must use English: ${local}`);
    }
  }
}
for (const name of skills) {
  const path = `skills/${name}/SKILL.md`;
  if (!releasePaths.has(resolve(root, path))) {
    failures.push(`missing Skill: ${path}`);
    continue;
  }
  const frontmatter = read(path).match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? "";
  check(frontmatter.match(/^name:\s*([^\r\n]+)$/m)?.[1].trim() === name, `${path} must declare its stable name in frontmatter`);
  check(/^description:[ \t]*\S.+$/m.test(frontmatter), `${path} must declare a description in frontmatter`);
}

const documentation = new Set([...releasePaths].filter((path) => path.endsWith(".md")));
for (const path of documentation) {
  const markdown = readFileSync(path, "utf8");
  for (const match of markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^[a-z][a-z\d+.-]*:/i.test(target)) continue;
    const resolved = resolve(dirname(path), target);
    check(insideRoot(resolved) && existsSync(resolved), `${relative(root, path)} has broken or external filesystem link: ${target}`);
    if (releasePaths.has(path)) {
      check(releasePaths.has(resolved), `${relative(root, path)} links to an unpackaged file: ${target}`);
    }
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log(`WorkBuddy package ${packageJson.version} verified: metadata, MCP config, Skill identities, and packaged links.`);
