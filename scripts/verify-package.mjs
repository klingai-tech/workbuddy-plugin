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
const readExisting = (path) => existsSync(join(root, path)) ? read(path) : "";
const readJson = (path) => JSON.parse(read(path));

const requiredFiles = [
  "mcp.json",
  "connector-meta.json",
  "icon.png",
  "README.md",
  "LICENSE",
  "scripts/package-release.py",
  "skills/kling-ai-plugin/SKILL.md",
  "skills/kling-ai-plugin/references/prompt-examples.md",
  "skills/kling-ai-plugin/references/mcp-contract.md",
  "skills/kling-ai-plugin/references/model-parameters.md",
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
check(connector.name === "可灵 AI", "connector name must identify the China package in Chinese");
check(connector.name_zh === connector.name && typeof connector.name_en === "string" && connector.name_en.length > 0,
  "localized connector names must include matching Chinese and non-empty English values");
check(connector.description === packageJson.description, "connector description must match package description");
check(connector.description_zh === packageJson.description_zh
  && connector.description_zh === connector.description
  && typeof connector.description_en === "string"
  && connector.description_en.length > 0,
"localized descriptions must include matching Chinese and non-empty English values");
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

if (!existsSync(join(root, ".git"))) {
  const macOSMetadata = [];
  const scanMacOSMetadata = (directory, relativeDirectory = "") => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
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
}

for (const name of ["kling-ai-plugin", "kling-ai-generate-image", "kling-ai-generate-video"]) {
  const skill = readExisting(`skills/${name}/SKILL.md`);
  check(skill.startsWith("---\n"), `${name} skill must have YAML frontmatter`);
  check(skill.match(/^name:\s*(\S+)\s*$/m)?.[1] === name, `${name} skill name must match its directory`);
  check(/^description:\s*.+$/m.test(skill), `${name} skill must have a description`);
}

const coreSkill = readExisting("skills/kling-ai-plugin/SKILL.md");
check(coreSkill.includes("直到成功或失败"), "生成流程必须持续查询到终态");
check(coreSkill.includes("用户直接查询状态时"), "直接状态查询必须与生成轮询分开");
check(coreSkill.includes('client_name: "Plugin-WorkBuddy"'), "OAuth client name requirement must be preserved");
check(coreSkill.includes("references/mcp-contract.md"), "核心 Skill 必须链接完整 MCP 契约");

const skillCorpus = requiredFiles
  .filter((path) => path.startsWith("skills/") && path.endsWith(".md"))
  .map(readExisting)
  .join("\n");
for (const capability of [
  "who_am_i",
  "query_membership_and_credits",
  "logout",
  "text_to_image",
  "image_to_image",
  "text_to_video",
  "image_to_video",
  "motion_control",
  "query_tasks",
  "file_upload",
  "motion_library_list",
  "element_create",
  "element_list",
  "element_get",
  "element_update",
  "element_delete",
]) {
  check(skillCorpus.includes(capability), `skills 缺少 MCP 能力契约：${capability}`);
}
const modelSnapshot = readExisting("skills/kling-ai-plugin/references/model-parameters.md");
for (const parameter of [
  "model",
  "prompt",
  "duration",
  "aspect_ratio",
  "img_resolution",
  "resolution",
  "imageCount",
  "elements",
  "inputs",
  "motionDirection",
  "keepOriginalSound",
]) {
  check(modelSnapshot.includes(parameter), `模型参数快照缺少：${parameter}`);
}
const mcpContract = readExisting("skills/kling-ai-plugin/references/mcp-contract.md");
for (const outputField of [
  "generationId",
  "status",
  "creditsConsumed",
  "createTime",
  "finishTime",
  "works[]",
  "urlWithoutWatermark",
  "ticket",
  "uploadUrl",
  "expireAt",
  "membershipType",
  "availableRemainCredits",
  "motionUrl",
  "coverUrl",
  "hasAudio",
  "outputSchema",
]) {
  check(mcpContract.includes(outputField), ` MCP 输出契约缺少：${outputField}`);
}

const chineseUserFacingFiles = requiredFiles.filter((path) => path.endsWith(".md"));
for (const path of chineseUserFacingFiles) {
  check(/\p{Script=Han}/u.test(readExisting(path)), `${path} must use Chinese in the China package`);
}
check(!read("package.json").includes("https://kling.ai/mcp")
  && !read("connector-meta.json").includes("https://kling.ai/mcp"),
"China package metadata must not reference the Global endpoint");

for (const path of requiredFiles.filter((path) => path.endsWith(".md"))) {
  const markdown = readExisting(path);
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
