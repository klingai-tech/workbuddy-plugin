# Subject library, motion library, and asset upload

Adapted from commit `17398d3` for direct MCP use in WorkBuddy Global. CLI conveniences such as automatic upload and update merging are not automatic MCP behavior. Discover the current Global `tools/list` and use the live schema; do not assume tools or values available in another region are available here.

## Subject library (Elements)

- **Browse:** call `element_list` and show the returned IDs and names. Call `element_get(id)` for details, updates, or generation binding because the list does not include full resource types. Resolve ambiguous names before choosing an ID. Browsing does not require a credit check or generation. If the library is empty, explain that no subjects have been saved and offer to create the first one from a cover and 1–3 auxiliary images of the same subject; do not create automatically.
- **Create:** when the user asks to save a reusable subject, collect its name, description, tags, and resources. Validate them against the [MCP contract](mcp-contract.md#element-resources), call `element_create`, and return the persistent subject ID. Do not create an Element merely because a generation uses reference images, or duplicate the cover to fill missing auxiliary images.
- **Update:** call `element_get`, merge only the requested changes into the complete `name`, `description`, `resource`, and `tags`, then send that object with `id` to `element_update`. Preserve unchanged fields and the original image `resource.cover`. `secondary[]` replaces the whole set, which must still contain 1–3 images; retain unmodified images when adding or removing items and clarify ambiguous retention choices. Do not convert image subjects to video subjects or vice versa. Stop if the retrieved object is incomplete.
- **Replace a cover:** preserve the original cover during ordinary updates. If the live tool still requires deletion and recreation, explain that the ID and dependent references will change and obtain explicit authorization for both operations before proceeding.
- **Delete:** identify the exact ID and name and call `element_delete` only when the user explicitly requests deletion of that subject. Clarify ambiguous targets. Determine success from the real response.

## Bind a subject to generation

1. For a known ID, call `element_get` directly. For a name or library selection, call `element_list` first. Confirm access under the current account and determine image versus video type from `resource`.
2. Image subjects may be used with `image_to_image`, `image_to_video`, or `motion_control` only when the live model declares `elements` and the tool permits that resource type. Video subjects are restricted to compatible `image_to_video` models. Never bind Elements to text-to-image or text-to-video. A model field does not override a tool-level restriction.
3. Reference the actual ID as `<<<id>>>` in the prompt and pass `elements` in `arguments[]` with a JSON array string value such as `[{"id":"subject-id","bindName":"Alice"}]`. IDs must match the prompt markers. Do not omit the structured binding or exceed the model's limit.
4. Elements do not replace required image inputs. Supply the declared `image_1`, `first_image`, or other required inputs. Motion control still requires a subject `image` even when Element binding is supported.
5. Continue through the image or video Skill for prompt design, a single authorized submission, and terminal-state polling. Do not replace a video subject with its cover to bypass type restrictions.

## Motion library and motion control

1. Call `motion_library_list` to browse saved motions. Show names, IDs, available previews, duration, and audio presence. Convert millisecond `duration` to seconds for display; use the returned `id` as the generation argument `motionId`. Report an empty list accurately and never invent motions.
2. Match the requested motion against actual results; ask when multiple results are ambiguous. Browsing alone never calls `motion_control`. Do not invent motion-library create/update/delete tools or use `element_*` for motions; only use additional motion operations if exposed by the current Global tools.
3. Hand generation to the video Skill. Supply subject `image` in `inputs[]` and exactly one source: a string `motionId` in `arguments[]` or a `video` in `inputs[]`. A preview URL is not an ID; when using an ID, do not also send its `motionUrl` as video.
4. Select the `motion_control` model from `who_am_i`. Use declared `motionDirection`, `resolution`, and `keepOriginalSound` fields. `image_direction` requires a 3–10 second source; apply other limits only as declared live. Distinguish audio availability from the user's wish to preserve sound. Never send source milliseconds as an undeclared `duration` argument.
5. Follow the [paid-task workflow](tool-workflows.md) for credits, one submission, and status queries using `generationId`.

## Local asset upload

Prefer a host-provided reference accepted by the selected model. Pass an existing public URL directly only when the current service and model accept it; do not download and re-upload unnecessarily. Refresh historical Kling outputs by task number as required by the MCP contract.

Only use `file_upload` when it exists in the current Global `tools/list` and the host can both read the file and send a multipart request. Otherwise explain the missing capability and request a usable host attachment; do not submit dependent generation or Element writes.

1. Request a ticket with the actual `filename`, MIME `contentType`, byte `size`, and the same `taskTraceId`, as accepted by the live schema. A local path is not a remote URL.
2. POST `multipart/form-data` to the returned `uploadUrl`, using fields `ticket` and binary `file`. The ticket response is not a completed upload. Only use the final file URL after the upload service confirms success.

Tickets are single-use and expire at `expireAt`. Never log or display tickets, signed upload URLs, credentials, or full authorization headers; never copy MCP OAuth credentials into the upload request. Do not loop through ticket requests or submit generation after an upload failure.
