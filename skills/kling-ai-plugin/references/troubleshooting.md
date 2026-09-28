# Troubleshooting

## Missing MCP tools after installation

Reload WorkBuddy and confirm the connector's `kling-ai-plugin` server is enabled. If tools remain absent, restart the host and inspect MCP diagnostics. Do not substitute an API-key request.

## Unauthorized or disconnected

Open WorkBuddy's connector connection entry, select Kling AI, and complete browser OAuth. WorkBuddy manages client registration; do not override it manually. For `invalid_target`, report host diagnostics and verify current protected-resource metadata instead of inventing an `oauth_resource` override.

## Model capability mismatch

If the user says a requested model is enabled but complete `who_am_i` discovery does not return it, check the actual connector, endpoint/environment, generation entry points, and MCP version. Refresh the connection and rediscover. Membership and model rollout are separate; another client's result is comparison evidence, not authorization for this connection.

If inconsistent after refresh, report that the current connection did not return the requested model and the cause remains under investigation. Retain sanitized endpoint, version, query parameters, and relevant returned models for diagnosis. Absence does not prove lack of entitlement. Do not automatically log out, switch accounts, guess model names, or silently submit an older model. Product/test documents describe expectations; live model constraints govern parameter conflicts.

## Upload or image-to-video failure

- Refresh live definitions and check current upload tools and output fields.
- Reuse returned upload references exactly. A ticket alone is not a completed upload; follow [asset workflows](asset-workflows.md).
- Keep the same `taskTraceId` through preparation and generation when returned/required by the schema.
- Use only declared input names, types, and roles. Do not assume `file_upload`, `first_image`, or string-only values exist for every tool.

## Task still running

Use [task results](task-results.md) to distinguish mounted widgets, generation without a widget, and standalone status queries. Keep the same task number without resubmission. If the widget cannot refresh, query at service-allowed intervals; return status and task number on query failure or turn completion.

## No widget after generation

Check that `_meta.ui.resourceUri` (or `_meta["ui/resourceUri"]`) points to a readable `ui://` resource with MIME type `text/html;profile=mcp-app`. The target WorkBuddy build must read resources, mount a sandboxed iframe, and deliver tool inputs/results. If unsupported or resource reading fails, deliver media or result links through the shared workflow, preserving requested multiple works. Do not copy a local `mcp-app/` or start a second server.

## Generation failed

Follow [task results](task-results.md), summarize failure, and retain IDs. Sanitize credentials and unavailable model names. Do not create an automatic replacement that could consume credits again.

## Rate limiting or full queue

Report the service message and stop. Do not wait and automatically retry paid generation or switch models to evade limits. Rate-limited status queries also end polling for this turn, retaining the task number.

## Insufficient credits

Use current `query_membership_and_credits` balance and service responses; monthly plan allowances are not current balance. Explain insufficiency and, if available, provide the recharge link actually returned for the current region. Do not retry automatically or misclassify insufficient credits as model incompatibility.

## Membership and available capabilities

- For membership questions or explicit entitlement errors, consult the official membership page reached through the current Global service. Prices, promotions, and benefits depend on region/account; do not store price tables or fixed membership-to-model/spec mappings, and never purchase automatically.
- Resolution, output count, subject-library capacity, concurrency, and generation channels are distinct benefits. Website entitlements do not establish every MCP entry point's capability. Do not promise an upgrade will expose missing models or proactively suggest upgrades during ordinary generation.
- After a reported upgrade, reread relevant capabilities. If still absent, state current connection limitations. Check account/region alignment when needed without requesting credentials or replacing MCP authorization with browser login.

## Submission timeout with unknown creation state

Do not replay generation. Follow [task results](task-results.md) to recover a known task or report unknown. `taskTraceId` is not an idempotency key. If creation cannot be ruled out, a replacement requires explicit user acceptance of potential duplicate charges.

## Expired result links

Signed output URLs may expire. Query the retained `generationId` for a current URL, or use the authorized account's Kling generation history. Expiration does not imply the work is lost. Do not log signed URLs or treat them as permanent asset IDs. For reuse in generation, refresh once and stop if the resource remains unavailable as specified in [submission](tool-workflows.md).

## Feedback

When the user requests reporting an issue and live tools expose `feedback`, submit necessary sanitized error details and task number once using its schema. Exclude credentials, upload tickets, and signed URLs. Feedback does not retry, refund, or repair the original task; preserve its status.
