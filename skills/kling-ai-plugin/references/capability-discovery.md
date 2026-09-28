# Discover account capabilities

Read only for generation or model selection. Task, credit, and asset queries do not need a model list.

## Discovery order

1. Read the current connection's complete `tools/list`, including all pages. Candidates must exist and support the user's intent. Discovery failure is not an empty list or evidence of old capabilities.
2. If the live `who_am_i` schema declares `tools`, supply a nonempty candidate-tool set. Query relevant entry points only; for the latest model, include existing and new tools whose actual descriptions support the same output type and intent. Do not fix an old entry point before comparing models, or send undeclared filters.
3. Treat this response's `who_am_i.availableModels` as authoritative. Match requested canonical names/aliases within each candidate's `models`; otherwise follow core selection rules. If a named model is absent from filtered results, query the remaining discovered generation tools to distinguish absence from support for a different output type. This expansion is diagnostic: other media types are not candidates for this generation. Exclude missing or incompatible models without reading their recommendations or guessing specifications.
4. Select one tool/model pair and construct the request solely from that model's complete `arguments`, `inputs`, and combination constraints. Retain required fields, defaults, enums, dependencies, and exclusions in descriptions. Never carry parameters from other models. Use the [module table](model-parameters.md) for additional reading.

## Video candidate tools

For ordinary text-to-video, query `text_to_video`; for image-to-video and keyframes, query `image_to_video`. When `omni_ref_video` exists, include it in the same `who_am_i.tools` query for both cases, for example `["text_to_video", "omni_ref_video"]`. Do not exclude it because its name mentions references or the user supplied no attachment: its model input constraints decide whether assets are required. Read the full response if tool filtering is undeclared.

When the host discovers tools by name, discover all these candidates. Searching only for `text_to_video` is not a complete tool inventory. Resolve an omitted omni entry point before selection; do not call a single entry point's default the latest. Discover motion-transfer tools by actual motion support and preserve those requirements when comparing versions.

## Reuse and boundaries

- Reuse one successful capability response for routing, selection, and parameters during the same generation preparation. Expand only for an unqueried entry point; reading another document does not require another call.
- Filtered results establish only the queried tools' capabilities. Do not infer account-wide absence. Until expansion completes, report only that the queried image/video entry points did not return the requested model. Reconsider excluded models when requirements change.
- Invalidate selection after reconnecting, account/endpoint changes, reported membership changes, capability-change notifications, or rejected models/parameters. Membership names, client versions, and tool counts do not prove access.
- If the user says the requested model is enabled but complete discovery still omits it, follow [capability mismatch](troubleshooting.md#model-capability-mismatch). Investigate rather than declaring lack of permission or silently submitting with an older model.
- Do not add missing enums from descriptions, history, or static examples. Explain unsupported specifications and available choices; never silently downgrade or submit probes.
- `who_am_i` overrides tool descriptions, membership pages, and examples. If missing, failed, or incompatible with the tool's `inputSchema`, refresh relevant discovery, then stop if inconsistency remains. Do not fill capability gaps from another source.
- Use only declared filters. A tools-only filter does not authorize `models` or `fields` parameters. Filtering before the response reduces context; selecting fields afterward does not undo tokens already read.
- Do not store account snapshots or secrets in this package. Retain selected-model constraints in the current context, without repeating entire schemas, private account fields, or unselected model lists to the user.
- Membership entitlements, current balance, and model rollout are separate: use plan descriptions for context, live credits for balance, and `availableModels` for models/specifications. Browser login is not proof of the MCP account. Read [membership guidance](troubleshooting.md#membership-and-available-capabilities) only for user questions or explicit entitlement errors.
