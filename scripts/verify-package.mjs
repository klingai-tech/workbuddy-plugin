#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const read = (path) => readFileSync(join(root, path), "utf8");
const readJson = (path) => JSON.parse(read(path));

const requiredFiles = [
  "mcp.json",
  "connector-meta.json",
  "icon.png",
  "README.md",
  "README.zh-CN.md",
  "LICENSE",
  "scripts/package-release.py",
  ".workbuddy/skills/install-kling-ai-connector/SKILL.md",
  "skills/kling-ai-plugin/SKILL.md",
  "skills/kling-ai-plugin/references/prompt-examples.md",
  "skills/kling-ai-plugin/references/tool-workflows.md",
  "skills/kling-ai-plugin/references/troubleshooting.md",
  "skills/kling-ai-generate-image/SKILL.md",
  "skills/kling-ai-generate-image/references/prompt-construction.md",
  "skills/kling-ai-generate-image/references/scene-patterns.md",
  "skills/kling-ai-generate-video/SKILL.md",
  "skills/kling-ai-generate-video/references/motion-and-shots.md",
  "skills/kling-ai-generate-video/references/scene-patterns.md",
];

for (const path of requiredFiles) {
  check(existsSync(join(root, path)), `missing required file: ${path}`);
}

const packageJson = readJson("package.json");
const connector = readJson("connector-meta.json");
const mcp = readJson("mcp.json");
const releaseFiles = packageJson.files ?? [];

check(packageJson.name === "kling-ai-plugin", "package name must be kling-ai-plugin");
check(/^\d+\.\d+\.\d+$/.test(packageJson.version), "package version must be semantic x.y.z");
check(packageJson.private !== true, "release package must not be private");
check(connector.version === packageJson.version, "connector version must match package version");
check(connector.type === "mcp", "connector type must be mcp");
check(connector.source === "kling-ai-plugin", "connector source must be kling-ai-plugin");
check(connector.description_en === packageJson.description, "English description must match package description");
check(connector.description_zh === packageJson.description_zh, "Chinese description must match package description");
check(mcp.mcpServers?.["kling-ai-plugin"]?.url === "https://klingai.com/mcp", "unexpected Kling MCP URL");
check(mcp.mcpServers?.["kling-ai-plugin"]?.type === "http", "Kling MCP transport must be http");
check(Object.keys(mcp.mcpServers ?? {}).join() === "kling-ai-plugin", "only kling-ai-plugin may be registered");
check(packageJson.license === "MIT", "package license must be MIT");
check(packageJson.author === "KLING AI Pte Ltd", "package author must match the release owner");

const expectedReleaseFiles = [
  "mcp.json",
  "connector-meta.json",
  "icon.png",
  ".workbuddy/skills/",
  "skills/",
  "README.md",
  "README.zh-CN.md",
  "LICENSE",
];
check(JSON.stringify(releaseFiles) === JSON.stringify(expectedReleaseFiles), "package files must match the connector-only release allowlist");

for (const forbidden of [
  ".mcp.json",
  ".workbuddy-plugin",
  ".codebuddy-plugin",
  "marketplace.json",
  "commands",
  "mcp-app",
]) {
  check(!existsSync(join(root, forbidden)), `connector release must not contain ${forbidden}`);
}

check(!readdirSync(root).some((path) => /^mcp\..+\.json$/.test(path)), "connector release must not contain alternate MCP templates");

const macOSMetadata = [];
const scanMacOSMetadata = (directory, relativeDirectory = "") => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!relativeDirectory && [".git", "node_modules"].includes(entry.name)) continue;
    const relativePath = join(relativeDirectory, entry.name);
    if (entry.name === ".DS_Store" || entry.name.startsWith("._") || entry.name === "__MACOSX") {
      macOSMetadata.push(relativePath);
      continue;
    }
    if (entry.isDirectory()) scanMacOSMetadata(join(directory, entry.name), relativePath);
  }
};
scanMacOSMetadata(root);
check(macOSMetadata.length === 0, `release must not contain macOS metadata: ${macOSMetadata.join(", ")}`);

for (const name of ["kling-ai-plugin", "kling-ai-generate-image", "kling-ai-generate-video"]) {
  const skill = read(`skills/${name}/SKILL.md`);
  check(skill.startsWith("---\n"), `${name} skill must have YAML frontmatter`);
  check(skill.match(/^name:\s*(\S+)\s*$/m)?.[1] === name, `${name} skill name must match its directory`);
  check(/^description:\s*.+$/m.test(skill), `${name} skill must have a description`);
}

const coreSkill = read("skills/kling-ai-plugin/SKILL.md");
check(coreSkill.includes("until the task succeeds or fails"), "generation workflow must poll until a terminal state");
check(coreSkill.includes("For a direct status request"), "direct status behavior must remain separate from generation polling");
check(coreSkill.includes('client_name: "Plugin-WorkBuddy"'), "OAuth client name requirement must be preserved");

const installSkill = read(".workbuddy/skills/install-kling-ai-connector/SKILL.md");
check(installSkill.includes("国内 `mcp.json`"), "installer must use the China MCP template");

for (const path of requiredFiles.filter((path) => path.endsWith(".md"))) {
  const markdown = read(path);
  for (const match of markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^[a-z]+:/i.test(target)) continue;
    check(existsSync(resolve(root, path, "..", target)), `${path} has broken link: ${target}`);
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log(`WorkBuddy connector package verified: connector metadata, MCP config, skills, links, and ${packageJson.version} release allowlist are consistent.`);
