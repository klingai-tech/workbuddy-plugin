---
name: install-kling-ai-connector
description: 安装/配置本项目（kling-ai-plugin 可灵 AI 连接器插件）到本地 WorkBuddy。当用户要求"安装这个连接器、把插件装到本地、mcp.json 配置"时使用。必须逐字照抄插件包内国内 mcp.json 的全部内容，禁止任何改名或美化。
---

# Install Kling AI Connector（连接器包内版本）

## 概述

本 skill 内嵌于 kling-ai-plugin 插件包，用于把插件注册到本机 `~/.workbuddy/mcp.json`。规则随插件包分发，任何机器上处理本插件都遵循同样约束。

## 铁律（用户明确要求，违反即返工）

1. **逐字照抄**：`~/.workbuddy/mcp.json` 中 `mcpServers` 下的 Kling 条目，必须与本插件包内的国内 `mcp.json` **逐字符一致**——key 名必须是 `kling-ai-plugin`，`type`、`url`、`timeout` 等字段原样复制。
2. **禁止改名/美化**：不得把 `kling-ai-plugin` 简写成 `kling-ai`，不得调整任何字段值。服务标识符是插件管理与 OAuth token 关联的依据，改名会导致连接器页面对不上号。
3. **只增不覆盖**：`~/.workbuddy/mcp.json` 已有其他服务器条目时必须保留，只合并本插件条目。
4. 写完后重新 Read 本地文件，逐项比对确认一致。

## 安装流程

### Step 1: 读取国内 MCP 模板

1. Read `connector-meta.json` 确认插件身份（name 为 Kling AI / 可灵 AI）。
2. Read 根目录 `mcp.json`，确认端点为 `https://klingai.com/mcp`。

### Step 2: 合并到本地全局配置

1. Read `~/.workbuddy/mcp.json`；若不存在则初始化为 `{ "mcpServers": {} }`。
2. 将 `mcp.json` 中 `mcpServers` 的条目**原样合并**（JSON 对象合并，不覆盖已有 key）；若同名 Kling 条目已存在，应先断开旧 OAuth，再替换该条目。
3. 写回后重新 Read 复查，逐字段比对。

### Step 3: 提示用户完成激活

用简体中文告知：
1. 新 MCP 不会自动激活，需在「连接器管理」页面右上角自定义连接器入口，对 `kling-ai-plugin` 点击「信任 / Trust」。
2. 可灵 AI 是 OAuth 保护的远程 MCP：信任后点击「连接 / Connect」在浏览器完成可灵账号授权；WorkBuddy 自动管理 token 刷新，无需 API Key。
3. 切换账号先断开再连接；不要在任何对话粘贴凭证、token 或 cookie。

## 常见陷阱

- **改名**：不允许把 `kling-ai-plugin` 简写为 `kling-ai`
- **覆盖既有配置**：写文件前必须先读旧文件，保留所有服务器条目。
- **凭记忆写字段**：url 和 timeout（30000）必须从 `mcp.json` 复制。
