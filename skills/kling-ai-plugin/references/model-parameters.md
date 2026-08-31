# Global MCP current model parameter snapshot

Audit date: 2026-08-19. Source: live `who_am_i.availableModels` from `https://kling.ai/mcp`.

This is a complete verification snapshot, not a permanent source of truth. Call `who_am_i` again before submission and use current values when models, defaults, allowed values, required fields, or inputs change. Every `arguments[].value` is sent as a string, including booleans and JSON arrays.

## Closed parameter rules

- Select the tool and canonical model first. Treat only that model's current `arguments[]` and `inputs[]` as allowed; a field valid for another model is invalid here.
- Top-level generation fields are limited to `model`, `arguments`, `inputs`, `rationale`, and `taskTraceId`. Put `prompt`, resolution, duration, ratio, count, audio, and shot settings in `arguments[]` only when declared.
- Fill required arguments. Preserve a declared default unless the user requested, or the specialized Skill reliably inferred, another allowed value. Optional fields without defaults are omitted unless the request needs them.
- Validate exact enum spelling, ranges, `maxItems`, unique argument/input names, and string conversion. Omit `inputs` when none are declared. Rebuild both arrays from empty after switching models.
- Never invent `size`, `width`, `height`, `fps`, a generic `quality`, or a “balanced” tier. `img_resolution` is an image parameter and `resolution` is a video parameter; use neither when the selected model omits it.
- Use the model's exact input names. `image_1`, `first_image`, `tail_image`, and `image` represent different contracts and are not interchangeable.
- For image-to-video, pass `aspect_ratio` when the selected model declares it and the destination/source implies a legal value; omit it only when the model does not declare the field.

## Known Global schema conflicts

- The tool-level contract forbids Elements for `text_to_image` and `text_to_video` even when a model entry advertises `elements`; enforce the stricter tool rule.
- `kling-image-v2_1` descriptions require matching `raw_subject_image_N` fields, but the captured inputs omit them. Do not guess a request until the live schema resolves the conflict.
- Some host `tools/list` responses omit `motion_control` even when `who_am_i` advertises it. Call it only when present in the current tool list.
- A higher runtime `mcpVersion` alone is not an error. Use the live schema when it fully describes the call, and refresh the host only for an actual tool/schema mismatch.

## Complete input-name index

- Multi-image references: `image_1`, `image_2`, `image_3`, `image_4`, `image_5`, `image_6`, `image_7`, `image_8`, `image_9`, `image_10`.
- First and last frames: `first_image`, `tail_image`.
- Version 2.1 references: `subject_image_0`, `subject_image_1`, `subject_image_2`, `subject_image_3`, `scene_image`, `style_image`.
- Motion control: `image`, `video`.

Pass a name only when it is declared in the current inputs array for the target model.

## `text_to_image`

- `gemini-3.1-flash-image`: required `prompt`; `img_resolution=2k` (`0.5k/1k/2k/4k`); `aspect_ratio=16:9` (`1:1/1:4/1:8/2:3/3:2/3:4/4:1/4:3/4:5/5:4/8:1/9:16/16:9/21:9`); `imageCount=1` (`1–9`); no inputs.
- `gpt-image-2`: required `prompt`; `img_resolution=2k` (`1k/2k/4k`); `quality=medium` (`low/medium/high`); `aspect_ratio=1:1` (`1:1/2:3/3:2/3:4/4:3/4:5/5:4/9:16/16:9/21:9`); `imageCount=1` (`1–9`); no inputs.
- `gemini-3-pro-image`: required `prompt` and `img_resolution` (`1k/2k/4k`); `aspect_ratio=1:1` (`1:1/2:3/3:2/3:4/4:3/4:5/5:4/9:16/16:9/21:9`); `image_count=1` (`1–9`); no inputs.
- `kling-image-v3_0_omni`: required `prompt`; `img_resolution=4k` (`1k/2k/4k`); `aspect_ratio=3:4` (`auto/9:16/2:3/3:4/1:1/4:3/3:2/16:9/21:9`); `imageCount=1` (`1–9`); `elements` max 10; no inputs.
- `kling-image-o1`: required `prompt`; `img_resolution=2k` (`1k/2k`); `aspect_ratio=3:4` (`9:16/2:3/3:4/1:1/4:3/3:2/16:9/21:9`); `imageCount=1` (`1–9`); `elements` max 10; no inputs.
- `kling-image-v3_0`: required `prompt`; `img_resolution=2k` (`1k/2k`); ratio values as O1; `imageCount=1` (`1–9`); `elements` max 10; no inputs.
- `kling-image-v2_1`: required `prompt`; `img_resolution=2k` (`1k/2k`); ratio values as O1; `imageCount=1` (`1–9`); no inputs.

The tool-level description forbids Elements for `text_to_image`. Never pass `elements` or `<<<id>>>`, even when `who_am_i` lists that argument.

## `image_to_image`

- `gemini-3.1-flash-image`: required `prompt`; `img_resolution=2k` (`0.5k/1k/2k/4k`); optional `aspect_ratio` (`1:1/1:4/1:8/2:3/3:2/3:4/4:1/4:3/4:5/5:4/8:1/9:16/16:9/21:9`); `imageCount=1` (`1–9`); required `image_1`, optional `image_2` through `image_10`.
- `gpt-image2`: required `prompt`; `img_resolution=2k` (`1k/2k/4k`); `quality=medium` (`low/medium/high`); `aspect_ratio=1:1`; `imageCount=1` (`1–9`); required `image_1`, optional `image_2` through `image_10`.
- `gemini-3-pro-image`: required `prompt` and `img_resolution` (`1k/2k/4k`); `aspect_ratio=16:9`; `image_count=1` (`1–9`); required `image_1`, optional `image_2`.
- `kling-image-v3_0_omni`: required `prompt`; `img_resolution=4k` (`1k/2k/4k`); `aspect_ratio=3:4` including `auto`; `imageCount=1` (`-1` or `1–9`); `story_mode=false`; `elements` max 10; required `image_1`, optional `image_2` through `image_10`.
- `kling-image-o1`: required `prompt`; `img_resolution=2k` (`1k/2k`); ratio includes `auto`; `imageCount=1` (`1–9`); `elements` max 10; required `image_1`, optional `image_2` through `image_10`.
- `kling-image-v3_0`: required `prompt`; `img_resolution=1k` (`1k/2k`); ratio includes `auto`; `imageCount=1` (`1–9`); `elements` max 10; required `image_1`, optional `image_2` through `image_10`.
- `kling-image-v2_1`: optional `prompt`; `aspect_ratio=1:1` (`9:16/2:3/3:4/1:1/4:3/3:2/16:9/21:9`); `imageCount=1` (`1–9`); optional `subject_image_0` through `subject_image_3`, `scene_image`, and `style_image`.

For `kling-image-v2_1`, each `subject_image_N` description requires a same-URL `raw_subject_image_N`, and subject/scene/style must total at least two distinct references. The current inputs array omits raw fields; do not guess a submission until the schema conflict is fixed.

## `text_to_video`

- `kling-video-v2_6`: required `prompt`; `duration=5` (`5/10`); `aspect_ratio=16:9` (`16:9/9:16/1:1`); `imageCount=1` (`1–4`); `resolution=1080p` (`720p/1080p`); `enable_audio=true`; no inputs.
- `kling-video-o1`: required `prompt`; `duration=5` (`5/10`); `aspect_ratio=16:9`; `resolution=1080p`; `imageCount=1` (`1–4`); `elements` max 7; no inputs.
- `kling-video-v3_0_omni`: required `prompt`; `duration=5` (`3–15`); `aspect_ratio=16:9`; `resolution=4k` (`720p/1080p/4k`); `imageCount=1` (`1–4`); `prefer_multi_shots=false`; `enable_audio=false`; `elements` max 7; no inputs.
- `kling-video-v3_0`: same fields as 3.0 Omni, with `elements` max 3; no inputs.
- `kling-video-v3_0_turbo`: required `prompt`; `duration=5` (`3–15`); `resolution=1080p` (`720p/1080p`); `imageCount=1` (`1–4`); `aspect_ratio=16:9`; no inputs.

The tool-level description forbids Elements for `text_to_video`. Never pass `elements` or `<<<id>>>`.

## `image_to_video`

- `kling-video-v2_6`: optional `prompt`; `duration=5` (`5/10`); `imageCount=1` (`1–4`); `resolution=1080p` (`720p/1080p`); `enable_audio=true`; required `first_image`, optional `tail_image`.
- `kling-video-o1`: required `prompt`; `duration=5` (`3–10`); `aspect_ratio=16:9`; `resolution=1080p`; `imageCount=1` (`1–4`); `elements` max 7; required `image_1`, optional `image_2` through `image_7`.
- `kling-video-v3_0_omni`: required `prompt`; `duration=5` (`3–15`); `aspect_ratio=16:9`; `resolution=4k`; `imageCount=1` (`1–4`); `prefer_multi_shots=false`; `enable_audio=false`; `elements` max 7; required `image_1`, optional `image_2` through `image_7`.
- `kling-video-v3_0`: optional `prompt`; `duration=5` (`3–15`); `resolution=4k`; `imageCount=1` (`1–4`); `prefer_multi_shots=true`; `enable_audio=false`; `elements` max 3; required `first_image`, optional `tail_image`.
- `kling-video-v3_0_turbo`: optional `prompt`; `duration=5` (`3–15`); `resolution=1080p`; `imageCount=1` (`1–4`); required `first_image`.

## `motion_control`

- `kling-video-v2_6`: optional `prompt` and `motionId`; required `motionDirection` (`image_direction/motion_direction`); `resolution=720p` (`720p/1080p`); `keepOriginalSound=true`; required input `image`, optional input `video`.
- `kling-video-v3_0`: same fields as 2.6 plus `elements` max 1; required input `image`, optional input `video`.

Provide exactly one motion source: `motionId` or input `video`. `image_direction` supports only 3–10 second motion; `motion_direction` follows the motion video.

The current Global `who_am_i` advertises `motion_control`, while some host connector `tools/list` responses expose only the four base generation tools. Call motion control only when it is present in the current WorkBuddy `tools/list`; report capability drift otherwise.
