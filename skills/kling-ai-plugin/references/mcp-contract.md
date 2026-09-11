# Kling MCP input and output contract

Use this file to verify the tool surface and parameter structure without freezing dynamic model configuration. Resolve facts in this order for every operation:

1. The connected server's `tools/list` defines callable tools, tool descriptions, and `inputSchema`.
2. `who_am_i.availableModels` defines models, model arguments, required fields, defaults, allowed values, item limits, and media inputs for each generation tool.
3. The actual tool response defines additional output fields. Never invent a field when no `outputSchema` or observed response supports it.

A newer `who_am_i.mcpVersion` does not by itself require a restart. Continue when current `tools/list` and the live model schema fully describe the target call. Stop and request a host restart in a fresh session only when the target tool is missing, the top-level `inputSchema` conflicts with the live model requirements, or the host explicitly reports stale tools.

## Tool surface used by these Skills

- Discovery and account: `who_am_i`, `query_membership_and_credits`, `logout`
- Generation and status: `text_to_image`, `image_to_image`, `text_to_video`, `image_to_video`, `motion_control`, `query_tasks`
- Assets and reuse: `file_upload` (only if exposed by the current Global server), `motion_library_list`, `element_create`, `element_list`, `element_get`, `element_update`, `element_delete`
- Incident reporting: `feedback`

Call a tool only when it exists in the current `tools/list`. Tool, model, and value availability may differ by region or account tier; never assume China and Global expose identical surfaces.

Subject CRUD, generation binding, motion selection, and conditional two-step upload are described in [asset workflows](asset-workflows.md).

## Fixed tool-level inputs

- The only top-level fields allowed for the five generation tools are `model`, `arguments`, `inputs`, `rationale`, and `taskTraceId`. Creative prompt, resolution, duration, ratio, and count belong inside the selected model's `arguments[]`, never at top level.
  - `model` must come from the current `who_am_i` list for that tool. Do not guess a default model.
  - Each `arguments[]` item is `{name, value}` and every `value` is a string. Names, required fields, defaults, allowed values, and `maxItems` come from the selected model.
  - Each `inputs[]` item is `{name, inputType, url}`. Pass only input names declared by the selected model and use the `inputType` declared by the live schema. Omit top-level `inputs` when the model declares none.
  - `rationale` explains the user's objective and the reason for parameter choices; it does not replace the creative prompt.
- `query_tasks`: required `generationId` and optional `taskTraceId`.
- `who_am_i`, `query_membership_and_credits`, `logout`, `motion_library_list`, and `element_list`: optional `taskTraceId` only.
- `element_get` and `element_delete`: `id` plus optional `taskTraceId`; enforce the actual required rule from the tool description before calling.
- `file_upload`, when available: `filename`, MIME `contentType`, numeric byte `size`, and `taskTraceId`; use the live schema for optionality. This tool only requests a ticket and does not transfer file bytes.
- `element_create`: `name`, `description`, `resource`, `tags`, and `taskTraceId`.
- `element_update`: the create fields plus `id`. Call `element_get` first and send a complete update object so omitted fields are not cleared accidentally.

Use an RFC 4122 UUIDv7 for `taskTraceId`. Reuse it across discovery, media preparation, generation, and status calls for one user objective; create a new value when the user switches to an unrelated objective.

## Dynamic model parameters

Before any generation submission, call `who_am_i` and read the target tool and model fields:

- `arguments[]`: `name`, `required`, `default`, `allowedValues` / `allowed_values`, `maxItems`, and `description`;
- `inputs[]`: `name`, `required`, and `description`;
- use aliases only to understand user intent and submit the canonical `model` name.

For the complete current Global model names, arguments, defaults, allowed values, item limits, and inputs, read the [model parameter snapshot](model-parameters.md) before each generation as a closed allowlist and known-conflict baseline. Let the current `who_am_i` override any changed model, default, or value; the live response remains authoritative.

When a tool description conflicts with `who_am_i`, enforce the stricter tool-level constraint and stop an unsafe submission. Preserve these gates:

- `text_to_image` and `text_to_video` do not use Elements; never pass `elements` or `<<<id>>>`;
- call `element_get` before binding an Element; route image Elements to an `image_to_image`, `image_to_video`, or `motion_control` model only when its live schema supports `elements` and the tool allows that resource type, and route video Elements only to a compatible `image_to_video` model;
- `motion_control` requires a subject `image` and exactly one motion source: library `motionId` or input `video`; obtain direction, resolution, and sound arguments from the live model schema;
- when a model requires a media source the host cannot supply, treat that model as unavailable for the request; never bypass the requirement with a local path or arbitrary external URL;
- never pass an argument, input name, or enum value absent from the live model schema.

## Generation request preflight

Build the request in this order so fields from one model never leak into another:

1. Select the generation tool, then a canonical `model` from that tool's current `availableModels`. Never omit the model or submit an alias.
2. Build a closed argument allowlist from only that model's `arguments[]`. Fill required fields. Use a user value or a value reliably inferred by the specialized Skill when legal; otherwise use an exact declared default. Do not let a default override a known ratio, shot, or audio intent. Include an optional field without a default only when the request needs it. Validate `allowedValues` / `allowed_values`, ranges, `maxItems`, uniqueness, and string conversion. Never send undeclared fields or empty placeholders.
3. Build the allowed input set from only that model's `inputs[]`. Satisfy required inputs and reject undeclared names. Map semantic roles only after model selection; `image_1`, `first_image`, `tail_image`, and `image` are not aliases. Validate the declared `inputType`, unique names, accepted source, and reference count.
4. Keep `rationale` concise and separate from the creative prompt. Reuse one UUIDv7 `taskTraceId` for the objective.
5. Run the matching checks in [failure-prevention gates](failure-prevention.md), then call `query_membership_and_credits` immediately before the paid generation.

If the model changes at any point, discard the entire `arguments` and `inputs` arrays and rebuild them from the new model's live schema.

## Historical-result reuse and URL lifetime

- Treat `generationId` plus `works[]` index and `contentType` as the stable work identity. Output URLs are signed delivery links that expire after 24 hours.
- Immediately before using an older Kling result in a new generation, call `query_tasks` once with its `generationId`, select the previously bound work index and type, and use the fresh current URL in the same turn.
- Without a `generationId`, `query_tasks` cannot search for an unknown submission. If the ID is missing, the work index cannot be identified, refresh fails, or the fresh URL is still rejected, stop and ask the user to attach the media again. Do not repeat the query or try another old URL.

## Element resources

- Image Element: `resource.cover` plus 1–3 `resource.secondary[{name,inputType,url}]`; do not also pass `resource.video`.
- Video Element: `resource.video`, optionally `resource.voice` when the live description allows it; do not also pass `cover` or `secondary`.
- Either resource type may include `resource.voice` when the live tool allows it; the reference implementation uses MP3.
- Provide at least one `tags` item and use only tags declared by the current tool description.
- Bind a subject using matching `<<<id>>>` prompt markers and an `elements` argument containing a JSON array string of `{id, bindName}`. Still supply required image inputs.
- For updates, retrieve and merge the complete object, preserving the original image `resource.cover`. `secondary[]` is a full replacement with 1–3 items; retain unmodified images and never convert the resource type.
- `element_delete` removes user data. Call it only when the user explicitly requests deletion of the identified subject; clarify ambiguous targets first.
- If an image Element's cover cannot be safely replaced through update, explain that delete-and-recreate is required and wait for confirmation.

## Known outputs

- `file_upload`, when exposed: `ticket`, `uploadUrl`, `expireAt`. POST multipart fields `ticket` and binary `file` to the returned upload address; the reference upload response is `{url, fileType, fileSize}`, subject to the live upload contract. Only a successful upload yields a usable file URL. Never log tickets or signed upload addresses.

- Generation submission: `generationId`, `status`, and possibly `creditsConsumed` and `message`.
- `query_tasks`: `generationId`, `status`, `createTime`, `finishTime`, and `works[]`; work items may contain `status`, `contentType`, `url`, `urlWithoutWatermark`, `coverUrl`, and `coverUrlWithoutWatermark`. Treat status case-insensitively and determine terminal state from the live response.
- `query_membership_and_credits`: `userId`, `membershipType`, and `availableRemainCredits`.
- `motion_library_list`: `motions[{id,name,motionUrl,coverUrl,duration,hasAudio}]`, with `duration` in milliseconds.
- `element_list`: `elements[{id,name}]`.
- `element_get`: `id`, `name`, `description`, `resource`, and `tags`.
- `motion_control`: the normal generation submission result, followed by `query_tasks`.
- `element_create`: the tool description guarantees an Element `id`.

`element_update`, `element_delete`, and `logout` currently have no dependable public full `outputSchema`. Read and preserve their actual responses; do not claim undeclared fields. Machine-verifiable coverage of every successful output requires server-side `outputSchema` definitions or redacted success fixtures.
