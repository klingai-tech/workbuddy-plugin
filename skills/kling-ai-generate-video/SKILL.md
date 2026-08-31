---
name: kling-ai-generate-video
description: Optimize natural-language briefs into precise motion prompts and generate professional, cinematic videos through Kling AI in WorkBuddy. Supports T2V, I2V, motion control, product demos, ads, short films, and social content.
---

# Kling AI Video Generation

Translate a user brief into a coherent Kling motion plan and one approved remote generation request. Use only live tools and schemas from the configured MCP at `https://kling.ai/mcp`.

## Contract

- Use host-managed OAuth. Never request or expose API keys, tokens, cookies, authorization headers, or signed URLs.
- A user request to generate authorizes one submission after materially missing inputs are resolved. Do not add a credit-cost warning or a separate confirmation step.
- Submit once per explicitly authorized paid generation. Execute explicitly requested distinct video tasks serially; never automatically retry a failed or ambiguous generation.
- Discover live tools and schemas at runtime. Do not hard-code model names, input roles, duration values, or multi-shot fields from examples.
- Prefer a host-provided image reference accepted by the selected model.

Before submission, read the shared [paid-task workflow](../kling-ai-plugin/references/tool-workflows.md), [MCP contract](../kling-ai-plugin/references/mcp-contract.md), [Global model snapshot](../kling-ai-plugin/references/model-parameters.md), and [failure-prevention gates](../kling-ai-plugin/references/failure-prevention.md), then let current `tools/list` and `who_am_i` override dynamic values. Read [troubleshooting](../kling-ai-plugin/references/troubleshooting.md) only after an authorization, schema, media-intake, or provider error.

## Workflow

1. Classify the request using the mode table below.
2. Read [motion and shot planning](references/motion-and-shots.md) for every generation and select one primary quality profile; add a secondary profile only when the request genuinely spans contexts.
3. Read [scene patterns](references/scene-patterns.md) only when product showcase, UGC, explainer, multi-shot, or social-format decisions are needed. Skip it for an ordinary single shot or simple image-to-video request.
4. Ask only for missing creative facts that materially change the result: duration, destination ratio, required references, shot structure, and—only when sound is requested—dialogue, narration, music, ambience, ASMR, or source-audio intent.
5. Among live models compatible with mode, references, duration, shot structure, and audio intent, choose the closest fit from current `who_am_i` descriptions. A model without the requested in-model audio controls is incompatible. Use a model marked default or preferred when the user did not choose one. Never invent a “balanced” tier, generic `quality`, or another undeclared field.
6. Lock opening facts, protected elements, and allowed changes, then write one minimally sufficient motion prompt in time order. Separate subject, camera, and necessary environmental motion and give each beat an observable end state. Translate “cinematic,” “premium,” or “high quality” into motion rhythm, camera path, lighting, depth, and composition; omit irrelevant static decoration and do not repeat structured ratio/resolution parameters in the prompt.
7. Immediately before submission, call `query_membership_and_credits`; stop on explicit zero or insufficiency, otherwise call the selected live generation tool exactly once. Preserve `generationId` and any `taskTraceId`.
8. If the submission is not terminal, poll its status at provider-allowed intervals until success or failure. On user cancellation or current-turn timeout, return the current state and task number.
9. Return the primary video or result link and bind every displayed work to its `generationId`, `works[]` index, and `contentType`. Show `generationId` as the **task number**, state that result URLs expire after 24 hours, and keep `taskTraceId` internal unless troubleshooting requires it.

## Generation modes

| User intent | Mode | Required interpretation |
| --- | --- | --- |
| Text-to-video | Generate | No source image controls the opening frame. Define the opening composition from text. |
| Image-to-video | Image-to-video | One or more images control the first frame, last frame, identity/product reference, or visual reference. Assign each role explicitly. |
| Motion control | Motion transfer | Require a subject image and exactly one motion source: library `motionId` or a motion-source video. Obtain all other fields from the live model schema. |
| Storyboard | Single approved video plan | Split timing and continuity deliberately; do not submit one task per shot unless the user explicitly approves separate tasks. |
| Status check | Read-only | Do not call a generation tool; query the existing task. |

For image-to-video, distinguish these roles before submission:

When the user says “make a video from this image” with no other reference or contrary instruction, use it as the first frame. Ask only when first frame, identity/product reference, last frame, and style reference remain materially different plausible roles.

- **first frame:** lock opening composition and animate forward from it;
- **last frame:** define the intended destination only when the live schema supports it;
- **identity/product reference:** preserve subject facts without assuming the input is the first frame;
- **style reference:** transfer only named visual traits, not identity or composition.

Do not silently fall back from image-to-video to text-to-video when upload, reference count, or schema validation fails. Report the limitation and let the user revise the request.

Before calling the tool, check the selected mode, reference roles, duration,
resolution, shot structure, and protected elements internally. Do not show a
pre-submission process message unless you need the user to clarify a missing
creative requirement.

## Image-input validation

- Select the exact `image_to_video` or `motion_control` model before mapping media to its current input names. `image_1`, `first_image`, `tail_image`, and `image` are not interchangeable; rebuild both inputs and arguments after changing models.
- Prefer a host-provided reference accepted by the selected model. Never put a local path directly in `inputs[]`. If the host cannot provide an accepted reference, explain the limitation and stop.
- For an older Kling output, ignore the saved URL. Immediately before submission, call `query_tasks` once using the bound `generationId`, select the saved `works[]` index and `contentType`, and use the fresh URL. If task/work identity is missing, refresh fails, the model rejects the source, or the fresh URL is still missing, ask the user to attach the image again; do not query repeatedly or try old URLs.
- Before submission, require `model` and validate all required inputs, duration, and resolution against the selected live schema. `1080p` is a `resolution` value only when allowed; never pass it as `img_resolution`.

## Quality and cost strategy

- A quality profile controls prompt design, shot planning, and acceptance criteria, not model, resolution, or credit use by itself. Do not mix continuous narrative, product advertising, image animation, UGC, motion control, and multi-shot grammar indiscriminately.
- Pass `resolution` only when declared by the selected model, using its live default or a user-specified allowed value. Increase it only for an explicit final-delivery, large-screen, post-production, or resolution requirement; reduce it only for preview, speed, or cost. Use only that model's current subset of `720p`, `1080p`, and `4k`. Never send `img_resolution`, `quality`, `size`, `width`, `height`, or `fps`. If the model omits `aspect_ratio`, omit it.
- Use `5` seconds for one action or one shot; prefer `10` seconds for dialogue, singing, a complete product action, or two connected beats; use a longer supported duration only when the narrative requires it. Choose the shortest duration that can complete the idea.
- Infer text-to-video ratio from the destination: `9:16` for vertical shorts, `1:1` for square feeds, and `16:9` for landscape ads, web, or YouTube. Use `16:9` only when no destination context exists.
- For image-to-video, derive composition from source and destination. If the model declares `aspect_ratio`, pass only a live allowed value rather than silently accepting an unsuitable default; if the model does not declare it, omit it.
- Prefer one continuous shot for a single moment. Use multi-shot only for explicit narrative progression, multiple locations/times, or a requested sequence.
- If the model declares `prefer_multi_shots`, pass `false` for one continuous shot and `true` for an explicit multi-shot plan; otherwise omit it. Do not let the model default override the shot structure.
- Map audio intent only to fields declared by the selected model. If `enable_audio` exists, use `true` only for requested dialogue, narration, music, ambience, or ASMR, and `false` when sound is not requested or silence is explicit. Set `enable_asmr` true only for explicit ASMR. Pass `audio_prompt` or `music_prompt` only for the corresponding requested sound, never invented dialogue, lyrics, or claims. In motion control, `keepOriginalSound` means preserving motion-source audio; ask only when that choice matters and cannot be inferred.
- Keep the first generation focused. Do not add unrequested dialogue, narration, lyrics, music, on-screen copy, characters, or product claims.

## Quality gate

Before submission, verify that the prompt preserves user facts and adds no unsupported content; the subject action fits the duration; subject, camera, and environmental motion are distinct and non-conflicting; each beat has an observable end state; reference identity/product geometry remains protected; and multi-shot durations form a coherent whole. Then apply the selected quality profile's gate.

## Failure behavior

- Authorization failure: direct the user to WorkBuddy's native MCP connection flow.
- Invalid argument/model: refresh the live schema and revise only the unsupported field.
- Missing resource: follow the historical-URL rule above; if refresh is impossible or still fails, ask the user to attach the image again and never reuse the old URL.
- Rate limit: report the provider message and stop. Do not wait and retry or change parameters automatically.
- Insufficient credits: tell the user to recharge and stop. Do not submit again until they explicitly state that the balance changed.
- Lost response: task creation is unknown. Query only when a `generationId` exists; without it, `query_tasks` cannot search. Report unknown status and stop unless the user explicitly accepts the duplicate-charge risk of a new paid task.
- Provider failure: report the message and preserve IDs; never resubmit automatically.
- Opaque failure, empty result, repeated validation failure, billing anomaly, or clearly unintended result: call `feedback` once as declared by the live tool and stop.
