---
name: kling-ai-generate-image
description: Optimize natural-language briefs into precise prompts and generate professional, cinematic images through Kling AI in WorkBuddy. Supports T2I, I2I, posters, product photography, ads, and reference-image editing.
---

# Kling AI Image Generation

Turn a creative brief into one well-specified Kling image request. Use only the live tools and schemas from the configured MCP at `https://kling.ai/mcp`.

## Contract

- Use host-managed OAuth. Never request or expose API keys, tokens, cookies, authorization headers, or signed URLs.
- A user request to generate authorizes one submission after materially missing inputs are resolved. Do not add a credit-cost warning or a separate confirmation step.
- Submit once per explicitly authorized paid generation. Execute explicitly requested distinct image tasks serially; never blind-retry an ambiguous or failed submission.
- Discover the live schema before choosing tools, models, input names, or enumerated values. Live provider fields override examples here.
- Prefer a host-provided image reference accepted by the selected model.

Before submission, read the shared [paid-task workflow](../kling-ai-plugin/references/tool-workflows.md), [MCP contract](../kling-ai-plugin/references/mcp-contract.md), [Global model snapshot](../kling-ai-plugin/references/model-parameters.md), and [failure-prevention gates](../kling-ai-plugin/references/failure-prevention.md), then let current `tools/list` and `who_am_i` override dynamic values. Read [troubleshooting](../kling-ai-plugin/references/troubleshooting.md) only after an authorization, schema, media-intake, or provider error.

## Workflow

1. Classify the request using the mode table below.
2. Read [prompt construction](references/prompt-construction.md) for every generation and select one primary quality profile; add a secondary profile only when the request genuinely spans contexts.
3. Read [scene patterns](references/scene-patterns.md) for product, advertising, thumbnail, portrait, editorial, or conceptual work that needs destination-specific decisions.
4. Ask only for missing facts that materially change the result: subject/product, intended use, ratio, required copy, or mandatory reference identity.
5. Among compatible live models, choose the closest fit from the current `who_am_i` descriptions. If a model is explicitly marked default or preferred for the mode, use it when the user did not choose one. Never invent a “balanced” tier, generic `quality`, or another undeclared parameter.
6. Lock user facts, protected elements, and allowed changes, then write one minimally sufficient prompt. Include only subject, action, environment, composition, lighting, palette, material, or camera details that change the visible result. Translate “premium,” “cinematic,” or “high quality” into observable traits; do not stack adjectives or repeat structured ratio/resolution parameters in the prompt.
7. Immediately before submission, call `query_membership_and_credits`; stop on explicit zero or insufficiency, otherwise call the live image tool exactly once. Preserve `generationId` and any `taskTraceId`.
8. If the submission is not terminal, poll its status at provider-allowed intervals until success or failure. On user cancellation or current-turn timeout, return the current state and task number.
9. Return the primary image or result link and bind every displayed work to its `generationId`, `works[]` index, and `contentType`. Show `generationId` as the **task number**, state that result URLs expire after 24 hours, and keep `taskTraceId` internal unless troubleshooting requires it.

## Generation modes

| User intent | Mode | Required interpretation |
| --- | --- | --- |
| Text-to-image | New image | No source image controls identity or composition. Build the scene from the text brief. |
| Image-to-image | Edit or reference-guided image | At least one image controls content, identity, product geometry, composition, or style. Assign every input an explicit role. |
| Element subject reference | Image-to-image | Read the Element first, confirm it is an image subject, and use only an image-to-image model whose live schema explicitly supports `elements`. Text-to-image never uses Elements. |
| Restyle | Focused image-to-image change | Lock all unspecified source facts and name the one allowed change. |
| Status check | Read-only | Do not call a generation tool; query the existing task. |

Do not silently switch modes. An attached image is not automatically an image-to-image instruction: if the user asks for an unrelated new image, ignore it only after confirming it is irrelevant. Conversely, never reduce an explicit image-to-image request to text-to-image after an upload or schema failure.

Before calling the tool, check the selected mode, ratio, reference roles, and
allowed changes internally. Do not show a pre-submission process message unless
you need the user to clarify a missing creative requirement.

## Image-input validation

- Select the exact `image_to_image` model before mapping media to names declared in its current schema. Never substitute another tool's `image` or `first_image` for `image_1`; rebuild all inputs after changing models.
- Prefer a host-provided reference accepted by the selected model. Never put a local path in `inputs[]` or mention an image URL only in the prompt as a substitute for a structured input. If the host cannot supply an accepted reference, explain the limitation and stop.
- For an older Kling result, ignore the URL saved in conversation. Immediately before submission, call `query_tasks` once using the bound `generationId`, select the saved `works[]` index and `contentType`, and use the fresh URL. If the task number or work binding is missing, refresh fails, the model rejects the source, or the fresh URL is still missing, ask the user to attach the image again; do not query repeatedly or try other old URLs.
- Before submission, confirm that `model` is present, all required inputs exist, reference count is within the live limit, input names are unique and declared, and every URL source is accepted by the selected model.

## Quality and cost strategy

- A quality profile controls prompt construction and acceptance criteria, not model, resolution, or credit use by itself. Do not blend product, portrait, advertising-key-visual, and concept-still photography into generic “cinematic” language.
- Pass `img_resolution` only when declared by the selected model, using its live default or a user-specified allowed value. Increase resolution only for an explicit large-format, crop-heavy, fine-material, or `4k` requirement; reduce it only for a draft, preview, or credit-saving request. `kling-image-v2_1` image-to-image currently declares no resolution field: never send `img_resolution`, `resolution`, `quality`, `size`, `width`, or `height` to that model.
- Choose ratio only from the selected model's current `aspect_ratio` values. Common destination mappings are `1:1` for square social/product, `4:5`, `3:4`, or `2:3` for supported feed/editorial portrait formats, `9:16` for story/vertical covers, `16:9` for banners/thumbnails, and `21:9` only for an explicit ultrawide request. If the requested ratio is absent from the live enum, list the available values and ask; never approximate or send an illegal value.
- Generate `1` image unless the user requests multiple results; do not substitute a batch of near-duplicates for a clear creative decision.
- Prefer a clean image without text unless the user explicitly requires text in the generated artwork.
- For variants, change one named dimension per approved generation: concept, composition, palette, camera distance, or expression. Do not use near-duplicate prompts.
- Preserve supplied brand names, labels, logos, faces, and product geometry as locked constraints. Never invent claims, prices, certifications, ingredients, results, or statistics.

## Quality gate

Before submission, verify that the final prompt preserves user facts, introduces no unsupported content, and contains only details that change the visible result. Require one clear focal subject, readable hierarchy, destination-safe space, coherent lighting, and no conflicting camera/composition instructions, then apply the selected quality profile's gate. When the host can inspect outputs, verify reference fidelity, text accuracy, subject count, and obvious artifacts. Do not claim visual QA when inspection is unavailable.

## Failure behavior

- Authorization failure: direct the user to WorkBuddy's native MCP connection flow.
- Unsupported argument: refresh the live schema and revise only the rejected field.
- Missing resource: follow the historical-URL rule above; if refresh is impossible or still fails, ask the user to attach the image again and never reuse the old URL.
- Rate limit: report the provider message and stop. Do not wait and retry or change parameters automatically.
- Insufficient credits: tell the user to recharge and stop. Do not submit again until they explicitly state that the balance changed.
- Lost response: task creation is unknown. Query only when a `generationId` exists; without it, `query_tasks` cannot search. Report unknown status and stop unless the user explicitly accepts the duplicate-charge risk of a new paid task.
- Provider failure: report the provider message and preserve IDs; do not resubmit automatically.
- Opaque failure, empty result, repeated validation failure, billing anomaly, or clearly unintended result: call `feedback` once as declared by the live tool and stop.
