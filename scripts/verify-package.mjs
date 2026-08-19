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
check(connector.name === "Kling AI", "connector name must identify the Global package in English");
check(connector.name_en === connector.name && typeof connector.name_zh === "string" && connector.name_zh.length > 0,
  "localized connector names must include matching English and non-empty Chinese values");
check(typeof connector.description === "string" && connector.description.length > 0,
  "connector must include a primary English description");
check(connector.description_en === connector.description
  && typeof connector.description_zh === "string"
  && connector.description_zh.length > 0,
"localized descriptions must include matching English and non-empty Chinese values");
check(typeof packageJson.description === "string" && packageJson.description.length > 0,
  "package must include a description");
check(typeof packageJson.description_zh === "string" && packageJson.description_zh.length > 0,
  "package must include a localized Chinese description");
check(mcp.mcpServers?.["kling-ai-plugin"]?.url === "https://kling.ai/mcp", "unexpected Kling Global MCP URL");
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

for (const { directory, name } of [
  { directory: "kling-ai-plugin", name: "kling-ai" },
  { directory: "kling-ai-generate-image", name: "kling-ai-generate-image" },
  { directory: "kling-ai-generate-video", name: "kling-ai-generate-video" },
]) {
  const skill = readExisting(`skills/${directory}/SKILL.md`);
  check(skill.startsWith("---\n"), `${name} skill must have YAML frontmatter`);
  check(skill.match(/^name:\s*(\S+)\s*$/m)?.[1] === name, `${directory} skill must declare name ${name}`);
  check(/^description:\s*.+$/m.test(skill), `${name} skill must have a description`);
}

const coreSkill = readExisting("skills/kling-ai-plugin/SKILL.md");
check(coreSkill.includes("until the task succeeds or fails"), "generation workflow must poll until a terminal state");
check(coreSkill.includes("For a direct status request"), "direct status behavior must remain separate from generation polling");
check(coreSkill.includes('client_name: "Plugin-WorkBuddy"'), "OAuth client name requirement must be preserved");
check(coreSkill.includes("references/mcp-contract.md"), "core Skill must link the complete MCP contract");
check(coreSkill.includes("treat the request as a deliverable"),
  "core Skill must default to deliverable quality");
check(coreSkill.includes("`1080p`") && coreSkill.includes("`4k`") && coreSkill.includes("`720p`"),
  "core Skill must distinguish normal, high-quality, and draft resolutions");

const imageSkill = readExisting("skills/kling-ai-generate-image/SKILL.md");
check(imageSkill.includes("supported `2k` setting for a normal deliverable"),
  "image Skill must contain a quality-first resolution strategy");
check(imageSkill.includes("Translate abstract requests") && imageSkill.includes("visible lighting"),
  "image Skill must translate abstract quality requests into executable visual direction");

const videoSkill = readExisting("skills/kling-ai-generate-video/SKILL.md");
check(videoSkill.includes("Use `1080p` for a normal deliverable"),
  "video Skill must use 1080p as the normal deliverable baseline");
check(videoSkill.includes("commercial, large-screen, or post-production work") && videoSkill.includes("`4k`"),
  "video Skill must route high-quality work to 4k when supported");
check(videoSkill.includes("`720p` only for drafts, speed/cost-first work"),
  "video Skill must limit 720p to draft or cost-first work");

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
  check(skillCorpus.includes(capability), `skills are missing the MCP capability contract: ${capability}`);
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
  "image_count",
  "quality",
  "elements",
  "inputs",
  "motionDirection",
  "keepOriginalSound",
]) {
  check(modelSnapshot.includes(parameter), `Global model parameter snapshot is missing: ${parameter}`);
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
  check(mcpContract.includes(outputField), `Global MCP output contract is missing: ${outputField}`);
}

const englishUserFacingFiles = requiredFiles.filter((path) => path.endsWith(".md"));
for (const path of englishUserFacingFiles) {
  check(!/\p{Script=Han}/u.test(readExisting(path)), `${path} must use English in the Global package`);
}
check(!read("package.json").includes("https://klingai.com/mcp")
  && !read("connector-meta.json").includes("https://klingai.com/mcp"),
"Global package metadata must not reference the China endpoint");

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
