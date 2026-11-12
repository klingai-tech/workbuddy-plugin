# Troubleshooting

## Missing MCP tools after installation

Reload WorkBuddy and confirm the connector's `kling-ai-plugin` server is enabled. If tools remain absent, restart the host and inspect MCP diagnostics. Do not substitute an API-key request.

## Unauthorized or disconnected

Open WorkBuddy's connector connection entry, select Kling AI, and complete browser OAuth. WorkBuddy manages client registration; do not override it manually. For `invalid_target`, report host diagnostics and verify current protected-resource metadata instead of inventing an `oauth_resource` override.

## Model capability mismatch

If the user says a requested model is enabled but complete `who_am_i` discovery does not return it, check the actual connector, endpoint/environment, generation entry points, and MCP version. Refresh the connection and rediscover. Membership and model rollout are separate; another client's result is comparison evidence, not authorization for this connection.

If inconsistent after refresh, report that the current connection did not return the requested model and the cause remains under investigation. Retain sanitized endpoint, version, query parameters, and relevant returned models for diagnosis. Absence does not prove lack of entitlement. Do not automatically log out, switch accounts, guess model names, or silently submit an older model. Product/test documents describe expectations; live model constraints govern parameter conflicts.

## Parameter or specification validation failure

- Check the actual top-level `model` for omission, `null`, an empty string, or whitespace. Compare `arguments[]` with the model's required prompt and parameters and check required slots in `inputs[]`. Use slot names declared for the current tool and model. `image_1` and `first_image` are distinct slots.
- Correct unknown arguments or slots against the live model declaration. Omit optional items only if doing so preserves the request. Ask only for missing required assets. If a requested specification is unavailable, have the user choose an available option before changing it.
- To locate where a field changed, compare the model's original `tool_calls.arguments` with the outgoing WorkBuddy MCP parameters from the same invocation. Retain the tool schema's `required` list. If only the service error is available, note the missing observations.
- If a model such as image-to-video Flash rejects a resolution, compare the sent value with the `who_am_i` enum and its conditions for the same account, connection, tool, and model. If the value meets the refreshed declaration but is still rejected, report the mismatch with the trace ID and sanitized fields for investigation. Do not change the resolution or resubmit automatically.

## Upload or asset reference failure

- If an error points to an input asset, resource reference, or signature, verify the complete URL returned on successful upload, the slot, and the asset source using the [upload rules](asset-workflows.md#local-asset-upload). If upload or local validation failed before the generation call was sent, correct the reference and proceed with the originally authorized first submission.
- If instructed to retry with the same generation ID, recover status through [task queries](task-results.md#refresh-and-fallback) using only a `generationId` confirmed to belong to this submission. If none is available, report that submission and billing are unconfirmed, retain `taskTraceId`, and pause. Upload or source task IDs refer to different operations. The error message alone does not establish task creation.
- To locate the first URL change, compare the upload response, WorkBuddy receipt, model input, original `tool_calls.arguments`, host request assembly, and outgoing MCP request for the same invocation. Compare only sanitized URL summaries and query parameter names and report any missing observations. `ResourceNotFound` alone cannot distinguish parameter entry, host assembly, or service retrieval failure.

## Task still running

Use [task results](task-results.md) to distinguish mounted widgets, generation without a widget, and standalone status queries. Keep the same task number without resubmission. If the widget cannot refresh, query at service-allowed intervals; return status and task number on query failure or turn completion.

## No widget after generation

Check that `_meta.ui.resourceUri` (or `_meta["ui/resourceUri"]`) points to a readable `ui://` resource with MIME type `text/html;profile=mcp-app`. The target WorkBuddy build must read resources, mount a sandboxed iframe, and deliver tool inputs/results. If unsupported or resource reading fails, deliver media or result links through the shared workflow, preserving requested multiple works. Do not copy a local `mcp-app/` or start a second server.

## Generation failed

Follow [task results](task-results.md), summarize failure, and retain IDs. Sanitize credentials and unavailable model names. Do not create an automatic replacement that could consume credits again.

Treat a generic service-unavailable message as a service error even if its outer code is `InvalidParameter`. If the current task number is known, follow the task results workflow. If the submission state is unknown and there is no task number, pause and retain the trace ID. Investigate a specific field when the response identifies one.

## Rate limiting or full queue

Distinguish a full generation queue from a rate-limited status query. Keep the generation settings and any known task number and explain the next step using the service's wait guidance or confirmed task status. If the service does not queue the request, report that it was not queued or that its status is unconfirmed, according to the response. If the user later asks to continue, check the original task first and follow [single submission](tool-workflows.md#prepare-and-submit-once). End rate-limited polling for the turn and report the task number and last confirmed status through the task results workflow.

## Insufficient credits

Use the current `query_membership_and_credits` balance and service responses. Monthly plan allowances cannot establish the current balance. Distinguish a pre-submission credit check, an explicit rejection, and an unknown submission outcome. Follow [recovery](tool-workflows.md#resume-after-insufficient-credits) for recharge and resume instructions. Recharge, balance changes, or viewing existing results do not trigger a paid submission.

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
