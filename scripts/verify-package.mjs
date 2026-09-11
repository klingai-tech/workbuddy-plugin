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
  "skills/kling-ai-plugin/references/mcp-contract.md",
  "skills/kling-ai-plugin/references/asset-workflows.md",
  "skills/kling-ai-plugin/references/model-parameters.md",
  "skills/kling-ai-plugin/references/failure-prevention.md",
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
check(connector.name === "Kling AI", "connector name must match the China package metadata");
check(connector.name_en === connector.name && typeof connector.name_zh === "string" && connector.name_zh.length > 0,
  "localized connector names must include matching English and non-empty Chinese values");
check(connector.description === packageJson.description, "connector description must match package description");
check(connector.description_zh === packageJson.description_zh
  && connector.description_en === connector.description,
"localized descriptions must match the corresponding package and connector descriptions");
check(mcp.mcpServers?.["kling-ai-plugin"]?.url === "https://klingai.com/mcp/plugin", "unexpected Kling MCP URL");
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

const macOSMetadata = [];
const scanMacOSMetadata = (directory, relativeDirectory = "") => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!relativeDirectory && entry.name === ".git") continue;
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

for (const { directory, name } of [
  { directory: "kling-ai-plugin", name: "kling-ai" },
  { directory: "kling-ai-generate-image", name: "kling-ai-generate-image" },
  { directory: "kling-ai-generate-video", name: "kling-ai-generate-video" },
]) {
  const skill = readExisting(`skills/${directory}/SKILL.md`);
  check(skill.startsWith("---\n"), `${name} skill must have YAML frontmatter`);
  check(skill.match(/^name:\s*(\S+)\s*$/m)?.[1] === name, `${directory} skill must declare name ${name}`);
  check(/^description:\s*.+$/m.test(skill), `${name} skill must have a description`);
  check(skill.includes("model-parameters.md"), `${name} skill must directly link the shared model parameter snapshot`);
  check(skill.includes("failure-prevention.md"), `${name} skill must directly link the shared failure-prevention gates`);
  check(skill.includes("tool-workflows.md"), `${name} skill must directly link the shared paid-task workflow`);
  check(skill.includes("troubleshooting.md"), `${name} skill must directly link shared troubleshooting`);
}

const coreSkill = readExisting("skills/kling-ai-plugin/SKILL.md");
check(coreSkill.includes("直到成功或失败"), "生成流程必须持续查询到终态");
check(coreSkill.includes("用户直接查询状态时"), "直接状态查询必须与生成轮询分开");
check(coreSkill.includes('client_name: "Plugin-WorkBuddy"'), "OAuth client name requirement must be preserved");
check(coreSkill.includes("references/mcp-contract.md"), "核心 Skill 必须链接完整 MCP 契约");
check(coreSkill.includes("mcpVersion") && coreSkill.includes("1.3.1"), "核心 Skill 必须处理 MCP 版本升级");
check(coreSkill.includes("works[]") && coreSkill.includes("有效期为 24 小时"), "核心 Skill 必须保存作品映射并说明 URL 生命周期");
check(coreSkill.includes("纯状态查询") && coreSkill.includes("继续编辑"), "核心 Skill 必须区分已有结果查询与二次创作");
check(coreSkill.includes("不要仅因版本号较高反复阻断"), "MCP 版本升级不得形成重复重启循环");

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
  "feedback",
]) {
  check(skillCorpus.includes(capability), `skills 缺少 MCP 能力契约：${capability}`);
}
const modelSnapshot = readExisting("skills/kling-ai-plugin/references/model-parameters.md");
check(modelSnapshot.includes("mcpVersion=1.3.1"), "模型参数快照必须标明核验的 MCP 版本");
check(modelSnapshot.includes("封闭参数规则"), "模型参数快照必须使用封闭白名单规则");
check(modelSnapshot.includes("没有 `img_resolution`，不得传分辨率参数"), "模型参数快照必须覆盖无分辨率参数的模型");
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

const sectionBetween = (markdown, startHeading, endHeading) => {
  const start = markdown.indexOf(startHeading);
  const end = endHeading ? markdown.indexOf(endHeading, start + startHeading.length) : markdown.length;
  return start >= 0 ? markdown.slice(start, end >= 0 ? end : markdown.length) : "";
};
const declaredAspectRatios = (markdownSection) => new Set(
  [...markdownSection.matchAll(/aspect_ratio=[^（\n]+（`([^`]+)`）/g)]
    .flatMap((match) => match[1].split("/")),
);
const mentionedAspectRatios = (markdown) => new Set(
  [...markdown.matchAll(/`(\d+:\d+)`/g)].map((match) => match[1]),
);
const checkAspectRatioCorpus = (label, corpus, allowed) => {
  for (const ratio of mentionedAspectRatios(corpus)) {
    check(allowed.has(ratio), `${label} 提到了当前模型快照未允许的画幅：${ratio}`);
  }
};

const imageModelSection = sectionBetween(modelSnapshot, "## `text_to_image`", "## `text_to_video`");
const videoModelSection = sectionBetween(modelSnapshot, "## `text_to_video`", "## `motion_control`");
const imageSkillCorpus = [
  readExisting("skills/kling-ai-generate-image/SKILL.md"),
  readExisting("skills/kling-ai-generate-image/references/prompt-construction.md"),
  readExisting("skills/kling-ai-generate-image/references/scene-patterns.md"),
].join("\n");
const videoSkillCorpus = [
  readExisting("skills/kling-ai-generate-video/SKILL.md"),
  readExisting("skills/kling-ai-generate-video/references/motion-and-shots.md"),
  readExisting("skills/kling-ai-generate-video/references/scene-patterns.md"),
].join("\n");
checkAspectRatioCorpus("图像 Skill", imageSkillCorpus, declaredAspectRatios(imageModelSection));
checkAspectRatioCorpus("视频 Skill", videoSkillCorpus, declaredAspectRatios(videoModelSection));

const videoSkill = readExisting("skills/kling-ai-generate-video/SKILL.md");
check(videoSkill.includes("所选模型声明 `aspect_ratio` 时")
  && videoSkill.includes("所选模型没有声明该字段时必须省略"),
"图生视频 Skill 必须区分已声明但可选的画幅参数与未声明参数");
for (const parameter of [
  "prefer_multi_shots",
  "enable_audio",
  "enable_asmr",
  "audio_prompt",
  "music_prompt",
  "keepOriginalSound",
]) {
  check(videoSkill.includes(parameter), `视频 Skill 缺少意图到参数的映射：${parameter}`);
}
const imageSkill = readExisting("skills/kling-ai-generate-image/SKILL.md");
for (const [label, skill] of [["核心", coreSkill], ["图像", imageSkill], ["视频", videoSkill]]) {
  check(skill.includes("没有 `generationId` 时无法查询"), `${label} Skill 必须处理无任务编号的未知提交状态`);
}
const toolWorkflow = readExisting("skills/kling-ai-plugin/references/tool-workflows.md");
check(toolWorkflow.includes("只有前一步成功") && toolWorkflow.includes("终止依赖链"),
"依赖型跨媒体工作流必须在前一步成功后才能继续");
for (const path of [
  "skills/kling-ai-generate-image/references/scene-patterns.md",
  "skills/kling-ai-generate-video/references/scene-patterns.md",
]) {
  check(readExisting(path).includes("不要用提案替代已授权任务"), `${path} 不得用创意提案截停生成请求`);
}
const mcpContract = readExisting("skills/kling-ai-plugin/references/mcp-contract.md");
check(mcpContract.includes("顶层白名单只有"), "MCP 契约必须限制生成工具顶层字段");
check(mcpContract.includes("未声明的参数禁止传递"), "MCP 契约必须拒绝模型 schema 外参数");
check(mcpContract.includes("紧邻新生成提交前调用一次")
  && mcpContract.includes("不要再次查询"),
"MCP 契约必须主动刷新历史资源并限制失败重试");
const prevention = readExisting("skills/kling-ai-plugin/references/failure-prevention.md");
for (const errorType of [
  "PointNotEnough",
  "InvalidParameter",
  "RateLimitExceeded",
  "ResourceNotFound",
  "MembershipQueueLimit",
  "Unauthorized",
  "MembershipNeed",
  "InvalidArguments",
  "Copyright",
  "Unknown",
  "GenImageOther",
  "MOTION.DURATION_MORE_THAN_EXPECTED",
  "POther",
  "FileUploadFailed",
  "MOTION.PIC_NOT_MATCHED",
  "MOTION.RESOLUTION_TOO_SMALL",
  "UnsupportedFileType",
  "ImageSize",
  "Unexpected",
  "ImageTaskDisallowsVideoElement",
  "AioImageRatio",
  "FileTooLarge",
  "MOTION.DURATION_LESS",
  "RiskUnauthorized",
  "BehaviorRiskPOther",
  "ImageRatio",
  "ElementNotBelongToUser",
  "TaskSubmitFailed",
  "InvalidBucketName",
]) {
  check(prevention.includes(errorType), `失败预防门禁缺少错误类型：${errorType}`);
}
const troubleshooting = readExisting("skills/kling-ai-plugin/references/troubleshooting.md");
check(!troubleshooting.includes("提供方任务列表筛选条件")
  && troubleshooting.includes("`query_tasks` 必须提供 `generationId`"),
"未知提交状态只能通过已知 generationId 查询，不得引用未公开的任务列表检索能力");
for (const outputField of [
  "generationId",
  "status",
  "creditsConsumed",
  "createTime",
  "finishTime",
  "works[]",
  "urlWithoutWatermark",
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
check(!read("package.json").includes("https://klingai.com/mcp/plugin")
  && !read("connector-meta.json").includes("https://klingai.com/mcp/plugin"),
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
