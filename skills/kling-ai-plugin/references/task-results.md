# Task queries and result delivery

Read only this file for existing-task queries, post-submission refresh, and output inspection. Do not load model recommendations, parameter modules, or generation submission. Use a real `generationId`; locate an ambiguous task rather than guessing IDs or regenerating.

Call `query_tasks` with the real task number. Preserve each work's original index and `contentType`; temporary URLs are not permanent identities. Query the original task for link refresh, asset reuse, or an explicit request. Without a task number or live task-list/trace-lookup capability, report unknown. `taskTraceId` alone neither enables lookup nor proves non-creation.

## Refresh and fallback

Use actual host feedback to establish whether the widget mounted and can refresh; UI metadata alone is insufficient.

| Situation | Behavior |
| --- | --- |
| This task's widget is confirmed working and refreshing | Let it query and render in place; do not duplicate automatic polling or create another card |
| No widget, mount failure, or no widget refresh during a generation request | Query the same `generationId` with live status tools until terminal state or a stopping condition below |
| Explicit standalone status request | Call `query_tasks` once for a snapshot, without a polling loop; this is distinct from automatic widget refresh |
| Explicit display of existing results | Reuse the working widget; otherwise call `query_result` once if exposed, or use `query_tasks` for media/text fallback |
| An authorized next step needs a predecessor but the host does not return widget updates | Query the original task for the dependency under these rules; reuse the component without duplicate generation/display |
| A subsequent generation needs a current source URL | Query the source task once for asset preparation, without recreating the result card |

When polling is necessary, use provider-allowed intervals until success or failure. Stop on user cancellation, turn timeout, host limits, rate limiting, or query errors; return status and task number without resubmission. If no task number exists, use the ambiguity rules above.

Avoid duplicate media/download links when the widget works. Honor explicit requests for links or specific works. Without a widget, deliver usable returned media or a primary result link; show requested multiple works rather than forcing batches to one result.

## Completion criteria

- Normalize status according to live schema/response semantics. Nonterminal means submitted/processing. Report failure and retain the ID, but summarize errors rather than exposing credentials or model names outside the current available set.
- Claim completion only when the task succeeds and at least one usable work matches the requested media type. If work-level status exists, require success; otherwise use terminal task status and media. A URL on an explicitly unsuccessful work is not a finished result.
- Prefer usable `urlWithoutWatermark`, then `url`. `coverUrl` is a cover, not a video. Preserve mappings across multiple outputs and report partial success accurately.
- Terminal success without usable works is a result inconsistency: explain without generating replacements. Do not log signed URLs or treat them as permanent asset IDs.

## Inspection and iteration

Task success proves file creation, not creative compliance. When the host can view/play results, check required image text/identity/structure/crops or video motion continuity and audio. Covers cannot validate motion/sound. Do not submit extra generation for QA or recreate cards for the same result. If inspection is unavailable, deliver the result and briefly state that visual/audio inspection remains undone.

Judge against required identity, product structure, exact text, action/sound, specifications, and change scope. Deliver observed defects with the existing result; do not claim perfect consistency or production readiness. Distinguish observed issues from uninspected properties.

When improvement is requested, distinguish local editing from regeneration. Preserve satisfactory content and change only relevant prompts, assets, or parameters in one authorized step. Evaluation-only requests receive advice; poor quality does not authorize automatic rerolls or deletion.

## UI and output

Use only the remote tool's actual `_meta.ui.resourceUri` (or `_meta["ui/resourceUri"]`) and `text/html;profile=mcp-app` resource. Metadata is not proof of mounting. Do not copy HTML or add a second MCP server.

Use actual output fields, preferring usable `urlWithoutWatermark` then `url`; covers do not replace video. Sanitize credentials and unavailable model names from errors. A successful tool call alone does not establish creative quality.

Continue authorized subsequent steps whose dependencies are satisfied. Re-enter generation only for requested edits/retries; quality issues, task failures, and expired links do not independently authorize resubmission.
