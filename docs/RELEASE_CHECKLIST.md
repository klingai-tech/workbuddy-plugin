# WorkBuddy 发布清单

- [ ] `mcp.json` 只包含指向端点的 `kling-ai-plugin`。
- [ ] 包内不包含国际端点或备用 MCP 模板。
- [ ] 安装 Skill、功能 Skill、元数据和 README 使用中文。
- [ ] 模板完整保留 `type`、`timeout` 和所有已打包字段。
- [ ] 压缩包不包含本地 MCP 服务、`mcp-app/`、凭证、Token、Cookie 或缓存。
- [ ] 压缩包不包含 `.DS_Store`、`._*` 或 `__MACOSX`。
- [ ]  MCP 的额度查询、上传、图像/视频生成、任务查询、结果回落和账号切换通过验证。
- [ ] 提交一次性、超时恢复和 `generationId` 查询通过验证。
- [ ] `node scripts/verify-package.mjs`、`npm test` 和 `npm run pack:release` 全部通过。
- [ ] 未经目标 WorkBuddy 版本审核前，不宣称已上架公开市场。
