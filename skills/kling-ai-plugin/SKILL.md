---
name: kling-ai
description: Generate professional, cinematic images and videos through Kling AI in WorkBuddy. Routes natural-language requests into precise T2I, I2I, T2V, or I2V prompts for posters, ads, product visuals, and short films.
---

# Kling AI

Use the configured Kling MCP server at `https://kling.ai/mcp`.

## Route specialized generation

- Route text-to-image, image-to-image, posters, covers, product stills, and image concept requests to `kling-ai-generate-image`.
- Route text-to-video, image-to-video, motion control, animation, camera motion, storyboards, and video concept requests to `kling-ai-generate-video`.
- Keep OAuth, logout or account switching, attachment intake, the motion library, Element management, credit checks, and task status in this Skill. Orchestrate cross-media requests here: apply the image Skill to the image stage and the video Skill to the video stage, with paid stages strictly serialized.
- Pure status checks, refreshed links, and downloads for an existing result use the result workflow without creating a generation. Editing an existing result, making a variant, or turning it into a video is a new paid generation: refresh and select the work by task number, then submit once through the relevant specialized Skill.

Do not ask mechanically about an attachment's role. When wording such as “make a video from this image” or “edit this image” has one reasonable interpretation, use it as the first frame or editable source. Ask only when first frame, identity/product reference, editable source, last frame, and style reference remain materially different plausible roles.

For any generation with images, select the tool and model first, then map media to the exact input names declared for that model in the current schema. `image_1`, `first_image`, and `image` are not interchangeable.

## Safety and submission contract

- Use OAuth through the host MCP connection flow. Never ask for an API key or expose credentials, cookies, authorization headers, private account fields, or signed URLs in logs.
- A request for one generation authorizes one paid submission after materially missing inputs are resolved. For a cross-media request or explicitly requested distinct outputs, treat each requested paid stage as separately authorized; ask before adding any unrequested paid stage. Do not add a credit-cost warning or separate confirmation.
- Submit at most once per explicitly authorized paid stage. Do not automatically retry failed or ambiguous submissions.
- Discover the live remote tools and schemas at runtime; the provider schema overrides examples in this Skill.
- If submission returns a non-terminal state, poll with the status tool declared by the live schema at provider-allowed intervals until the task succeeds or fails. Stop only if the user cancels or the current turn times out; then return the current state and task number.

Load references by request type. For a single image or video generation, route to the specialized Skill without rereading shared files here. For cross-media work, first read [the paid-task workflow](references/tool-workflows.md); at each paid stage, the specialized Skill reads [the MCP contract](references/mcp-contract.md), [the Global model snapshot](references/model-parameters.md), and [failure-prevention gates](references/failure-prevention.md). Account, credit, and status queries use live tool descriptions only. Read [troubleshooting](references/troubleshooting.md) only after an authorization, schema, media-intake, or provider error.

## OAuth client identity

Before OAuth dynamic client registration, include `client_name: "Plugin-WorkBuddy"`. This is OAuth metadata, not a tool argument, URL parameter, or secret. If the host cannot inject it, stop before authorization and report the limitation.

## Workflow

1. Identify generation, motion control, Element management, account mutation, or a read-only query. For cross-media work, split only the paid stages the user requested and apply the corresponding specialized workflow to each.
2. Read the current `tools/list`; before generation or motion control, call `who_am_i`. A higher `mcpVersion` alone is not a reason to block or restart repeatedly. Continue when the current tools and live model schema fully describe the call; request a host restart and a fresh session only if the target tool is absent, the top-level schema conflicts with the model schema, or the host explicitly reports stale tools. Immediately before each paid submission, call `query_membership_and_credits` and stop when it clearly reports no or insufficient credits.
3. For images, prefer a host-provided reference accepted by the selected model. For any older Kling output, ignore saved URLs and immediately before reuse call `query_tasks` once with its `generationId`; select the bound `works[]` index and `contentType`, then use that fresh URL in the same turn.
4. Ask only for missing creative facts or settings that materially change the result.
5. Select the tool and model before constructing the request. Treat the selected model's live `arguments[]` and `inputs[]` as closed allowlists; validate the canonical model, required fields, defaults, enums, limits, and exact input names. Never send undeclared fields, and rebuild the request from empty after switching models.
6. Call each explicitly authorized paid generation exactly once. Keep at most one non-terminal paid task for one user objective; wait for terminal state before starting another distinct task. Discovery, credits, and attachment interpretation are preparation steps, not a substitute for an authorized generation when inputs are complete.
7. Preserve the exact `generationId` and any `taskTraceId`. When a result has multiple `works[]`, bind each displayed work to its array index and `contentType`; task number plus work index is the stable identity, not the result URL. Reuse one UUIDv7 `taskTraceId` throughout an objective and show `generationId` as the **task number**.
8. If submission is not terminal, poll at provider-allowed intervals until the task succeeds or fails. On cancellation or current-turn timeout, return the current state and task number.
9. Return the primary result and state that output URLs expire after 24 hours; advise timely download for long-term retention.
10. For a direct status request, call the live status tool once and report the current state; do not start a long-running poll.
11. Element deletion and logout/account switching mutate state. Call them only on an explicit request and follow the live confirmation and reauthorization contract.

## Quality and cost defaults

Professional output comes first from prompt design, scene construction, and continuity; it does not automatically require the most expensive model or resolution. Use these rules only when the user did not specify an alternative and the live schema supports the value:

- Model: top-level `model` has no universal default. First satisfy the mode, references, and required capabilities, then use the current `who_am_i` description to choose the closest fit. Use a model marked as the default or preferred model for that mode when the user did not specify one. Never invent an undeclared “balanced” or quality tier.
- Images: preserve the selected model's declared resolution default. Increase it only for an explicit large-format, crop-heavy, fine-material, or `4k` requirement; reduce it only for a draft, preview, or credit-saving request. Never lower an explicit user requirement.
- Video: preserve the selected model's declared resolution default. Increase it only for an explicit final-delivery, large-screen, post-production, or specified-resolution requirement; reduce it only for preview, speed, or cost. Never lower an explicit user requirement.
- Video duration: use `5` seconds for one action or one shot; prefer `10` seconds for dialogue, singing, a complete product action, or two connected beats; use a longer supported duration only when the narrative needs it. Choose the shortest duration that can complete the idea instead of forcing every request into five seconds.
- Text-to-video ratio: infer it from the destination: `9:16` for vertical shorts, `1:1` for square feeds, and `16:9` for landscape ads, web, or YouTube. Use `16:9` only when no destination context exists.
- Image-to-video ratio: derive it from the source and destination. If the selected model declares `aspect_ratio`, pass only a live allowed value rather than silently accepting an unsuitable default; if it does not declare the field, omit it.

## Failure behavior

- Authorization failure: direct the user to the host MCP connection flow, then retry only after authorization succeeds.
- Invalid model or argument: refresh the live schema and revise only the unsupported field.
- Missing resource: for an older Kling result, verify that it was refreshed immediately before submission. If no task number exists, the work index is lost, the query fails, the work is unavailable, or a fresh URL still fails, ask the user to attach the image again; do not query repeatedly or reuse another old URL.
- Rate limit: report the provider message and stop. Do not wait and retry, switch models, or change parameters automatically.
- Provider task failure: explain the provider message and preserve the `generationId`; do not resubmit.
- Insufficient credits: tell the user to recharge and stop. Do not submit another paid generation until the user explicitly states that the balance changed.
- Lost or timed-out response: task creation is unknown. If a `generationId` exists, query only that task. Without a `generationId`, `query_tasks` cannot search; report unknown status and stop. Create a new paid task only after the user explicitly accepts the duplicate-charge risk.
- Opaque failure, empty result, repeated validation failure, billing anomaly, or clearly unintended result: call `feedback` once as declared by the live tool, preserve all IDs, and stop. Feedback is not a retry.
