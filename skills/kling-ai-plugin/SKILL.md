---
name: kling-ai-plugin
description: Write Kling AI image prompts, video prompts, or storyboards in WorkBuddy. Prepare or submit image and video generation, or handle existing tasks, uploads, subject and motion libraries, credits, and account connections. Use for media analysis only when it requires Kling.
---

# Kling AI

Use the `kling-ai-plugin` connector in this package's `mcp.json`. WorkBuddy manages OAuth; do not request API keys, override client registration, or log credentials, private account fields, or signed URLs.

## Load rules by request

- Identify the requested deliverable. Finish prompt-only or storyboard work with the creative text. Use live capability discovery for final generation settings and wait if the user asked for a proposal. Submit only when generation is authorized.
- **Check credits before submitting image generation.** Call `query_membership_and_credits` on the same connection before calling `text_to_image` or `image_to_image`. Pause submission when the current balance is unavailable, nonpositive, or explicitly insufficient. Preserve the request through [recovery](references/tool-workflows.md#resume-after-insufficient-credits).
- Use the [image Skill](../kling-ai-generate-image/SKILL.md) for image prompts, generation, edits, and reference-based creation. Reuse valid image-to-image source URLs and use the exact schema literal for `inputType`, including uppercase `URL` when declared.
- Use the [video Skill](../kling-ai-generate-video/SKILL.md) for video prompts, storyboards, missing assets, generation, and model selection. Prefer a returned Kling 4.0 model from `omni_ref_video` when it meets the full generation request.
- Progress, existing results, or refreshed output links: read only [task results](references/task-results.md), without generation recommendations, model parameters, or creative references.
- New generation, edits, or authorized retries: select through the relevant creative Skill, then follow [generation submission](references/tool-workflows.md). Execute dependent steps in order.
- Resume after recharging: restore the original settings through [recovery](references/tool-workflows.md#resume-after-insufficient-credits). When the user only reports a recharge, check credits. When they explicitly ask to continue and the task number is known, query the original task first. Check credits only if a new submission can proceed.
- Subject library, motion library, or local upload: read [asset workflows](references/asset-workflows.md). Read-only asset queries never submit generation.
- Before preparing or submitting generation, read [capability discovery](references/capability-discovery.md). After selecting an available model, use the [parameter module table](references/model-parameters.md) to load only supported rules needed for this request.
- Authorization, upload, model, or service errors: read [troubleshooting](references/troubleshooting.md). If instructed to retry with the same generation ID, use [asset troubleshooting](references/troubleshooting.md#upload-or-asset-reference-failure) to distinguish asset validation, generation submission, and existing-task queries. Read [examples](references/prompt-examples.md) when needed.

## Account visibility and rollout

- `tools/list` establishes tool availability and the outer request structure. The current account's `who_am_i` response governs each tool's models, parameters, specifications, and asset limits. Always send the selected canonical model ID in the top-level `model` field, even when the tool schema lists it as optional.
- Display, recommend, or call a model name only when the current `tools/list` exposes its tool and `who_am_i.availableModels` lists it under that tool. Tool counts, newly exposed omni tools, example names, and default-model fields are not substitutes for membership in that model set.
- Video defaults to suitable available Kling 4.0 models from `omni_ref_video`; images default to suitable available image models. Actual selection remains governed by the current account response for the required output type.
- If a requested model is absent from filtered discovery, expand discovery as described in [capability discovery](references/capability-discovery.md). If it exists only for another output type, explain the mismatch. If complete discovery still omits it, say the current connection did not return the requested model. Stop if the user required that model. When alternatives are allowed, offer only compatible, returned models. Any change of model or medium must stay within the user's authorization.
- Rediscover tools and models after reconnecting or changing account/environment. If discovery fails or model membership cannot be established, do not submit using a static fallback.

## Creative and capability selection

Read the video Skill even for read-only video selection. Include `omni_ref_video` when discovering candidates for ordinary video, even without attachments. Construct text, image, keyframe, Element, and audio inputs from live constraints. Specialized requirements such as motion transfer use an entry point supporting that intent.

Honor supplied asset roles, model, sound, ratio, and quality requirements. Ask only about missing information that materially changes the result. Prefer a user-specified available model. Images use an available image default, or another suitable image model. Video prefers suitable returned Kling 4.0 models. If none is suitable, use a compatible available default only when the user has left the model open or accepted alternatives. Speed, budget, sound, motion, and asset requirements take precedence over version preferences.

Never move models between tools. All selection requires account visibility and live parameters; stop if capability reading fails. Do not silently raise resolution/count or reduce requirements, and do not promise uninspected result quality.

Status, display, and link refresh are read-only. Explicit edits, variants, or video creation are new authorized steps: refresh and select the source work, then submit through the shared workflow. A dependent step must wait for a successful predecessor and a clearly selected work.

## Host and UI

Use the remote tool's actual `_meta.ui.resourceUri` (or `_meta["ui/resourceUri"]`) and `text/html;profile=mcp-app` resource. Metadata alone does not prove the widget mounted. Follow task-result rules for refresh and fallback; do not copy widget HTML or add a second MCP server.

Delete subjects, log out, or switch accounts only on an explicit request with a clear target. Uploading assets, checking credits, or selecting a subject does not authorize generation.
