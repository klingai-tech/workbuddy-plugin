# WorkBuddy release checklist

- [ ] `mcp.json` contains only `kling-ai-plugin` at the China endpoint.
- [ ] The package contains no alternate MCP template or non-China endpoint reference.
- [ ] The template preserves `type`, `timeout`, and every packaged field.
- [ ] The archive contains no local MCP server, `mcp-app/`, credential, token, cookie, or cache.
- [ ] The archive contains no `.DS_Store`, `._*`, or `__MACOSX` metadata.
- [ ] Credit lookup, upload, image/video generation, task query, result fallback, and account switching pass against the China MCP.
- [ ] Confirmation, at-most-once submission, ambiguous-timeout recovery, and `generationId` lookup are verified.
- [ ] `node scripts/verify-package.mjs`, `npm test`, and `npm run pack:release` pass.
- [ ] Public marketplace availability is not claimed before review on the target WorkBuddy build.
