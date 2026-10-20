---
name: kling-ai-plugin
description: Generate images or videos with Kling AI in WorkBuddy, or handle existing tasks, asset uploads, subject and motion libraries, credits, and account connections. Capabilities depend on the current account's live MCP response. Do not use for media analysis that does not call Kling.
---

# Kling AI

Use the `kling-ai-plugin` connector in this package's `mcp.json`. WorkBuddy manages OAuth; do not request API keys, override client registration, or log credentials, private account fields, or signed URLs.

## Load rules by request

- Image generation, editing, posters, and reference-based creation: use `kling-ai-generate-image`.
- Video generation, keyframes, omni references, motion control, and shot planning: first read the [video Skill](../kling-ai-generate-video/SKILL.md) and prefer a suitable Kling 4.0 model from `omni_ref_video`. Reading only this core Skill and the submission workflow is insufficient.
- Progress, existing results, or refreshed output links: read only [task results](references/task-results.md), without generation recommendations, model parameters, or creative references.
- New generation, edits, or authorized retries: select through the relevant creative Skill, then follow [generation submission](references/tool-workflows.md). Execute dependent steps in order.
- Subject library, motion library, or local upload: read [asset workflows](references/asset-workflows.md). Read-only asset queries never submit generation.
- Before generation, read [capability discovery](references/capability-discovery.md). After selecting an available model, use the [parameter module table](references/model-parameters.md) to load only supported rules needed for this request.
- Authorization, upload, model, or service errors: read [troubleshooting](references/troubleshooting.md). Read [examples](references/prompt-examples.md) when examples are needed.

## Account visibility and rollout

- The current account's live `who_am_i` response governs models, parameters, specifications, input types, and combination limits. `tools/list` establishes tool availability and call structure; membership pages, tool descriptions, and static examples cannot override account capabilities.
- Display, recommend, or call a model name only when the current `tools/list` exposes its tool and `who_am_i.availableModels` lists it under that tool. Tool counts, newly exposed omni tools, example names, and default-model fields are not substitutes for membership in that model set.
- Video defaults to suitable available Kling 4.0 models from `omni_ref_video`; images default to suitable available image models. Actual selection remains governed by the current account response for the required output type.
- If a requested model is absent from filtered discovery, expand discovery as described in [capability discovery](references/capability-discovery.md). If it exists only for another output type, explain the mismatch and let the user choose whether to keep the requested medium or use the model's supported medium; do not switch silently. After complete discovery, report only that the current connection did not return the requested model, without repeating hidden names. Alternatives must be actually available and suitable.
- Rediscover tools and models after reconnecting or changing account/environment. If discovery fails or model membership cannot be established, do not submit using a static fallback.

## Creative and capability selection

Read the video Skill even for read-only video selection. Ordinary video requests default to the broadly available `omni_ref_video` entry point and its suitable returned Kling 4.0 models. Construct text, image, keyframe, Element, and audio inputs from live constraints. Specialized requirements such as motion transfer use an entry point supporting that intent.

Honor supplied asset roles, model, sound, ratio, and quality requirements. Ask only about missing information that materially changes the result. Prefer a user-specified available model. Images use an available image default, or another suitable image model. Video prefers suitable returned Kling 4.0 models; if none is suitable, use an available default meeting requirements without mentioning hidden models. Speed, budget, motion, and asset requirements take precedence over version preferences.

Never move models between tools. All selection requires account visibility and live parameters; stop if capability reading fails. Do not silently raise resolution/count or reduce requirements, and do not promise uninspected result quality.

Status, display, and link refresh are read-only. Explicit edits, variants, or video creation are new authorized steps: refresh and select the source work, then submit through the shared workflow. A dependent step must wait for a successful predecessor and a clearly selected work.

## Host and UI

Use the remote tool's actual `_meta.ui.resourceUri` (or `_meta["ui/resourceUri"]`) and `text/html;profile=mcp-app` resource. Metadata alone does not prove the widget mounted. Follow task-result rules for refresh and fallback; do not copy widget HTML or add a second MCP server.

Delete subjects, log out, or switch accounts only on an explicit request with a clear target. Uploading assets, checking credits, or selecting a subject does not authorize generation.
