---
name: kling-ai-plugin
description: Generate images or videos with Kling AI in WorkBuddy, or handle existing tasks, asset uploads, subject and motion libraries, credits, and account connections. Capabilities depend on the current account's live MCP response. Do not use for media analysis that does not call Kling.
---

# Kling AI

Use the `kling-ai-plugin` connector in this package's `mcp.json`. WorkBuddy manages OAuth; do not request API keys, override client registration, or log credentials, private account fields, or signed URLs.

## Load rules by request

- Image generation, editing, posters, and reference-based creation: use `kling-ai-generate-image`.
- Video generation, keyframes, omni references, motion control, and shot planning: first read the [video Skill](../kling-ai-generate-video/SKILL.md) and follow its entry-point routing before choosing a model. Reading only this core Skill and the submission workflow is insufficient.
- Progress, existing results, or refreshed output links: read only [task results](references/task-results.md), without generation recommendations, model parameters, or creative references.
- New generation, edits, or authorized retries: select through the relevant creative Skill, then follow [generation submission](references/tool-workflows.md). Execute dependent steps in order.
- Subject library, motion library, or local upload: read [asset workflows](references/asset-workflows.md). Read-only asset queries never submit generation.
- Before generation, read [capability discovery](references/capability-discovery.md). After selecting an available model, use the [parameter module table](references/model-parameters.md) to load only supported rules needed for this request.
- Authorization, upload, model, or service errors: read [troubleshooting](references/troubleshooting.md). Read [examples](references/prompt-examples.md) when examples are needed.

## Account visibility and rollout

- The current account's live `who_am_i` response governs models, parameters, specifications, input types, and combination limits. `tools/list` establishes tool availability and call structure; membership pages, tool descriptions, and static examples cannot override account capabilities.
- Display, recommend, or call a model name only when the current `tools/list` exposes its tool and `who_am_i.availableModels` lists it under that tool. Tool counts, newly exposed omni tools, example names, and default-model fields are not substitutes for membership in that model set.
- Compare "latest" only within available models supporting the required output type and intent. Do not mix image and video versions; `defaultModel` does not mean latest. Qualify the conclusion as the latest image/video model available to the current account. If no suitable new model is returned, use an available model without mentioning higher versions, unreleased names, allowlists, or better hidden models. Never fill gaps from Skills, snapshots, other accounts, or earlier sessions.
- If a requested model is absent from filtered discovery, expand discovery as described in [capability discovery](references/capability-discovery.md). If it exists only for another output type, explain the mismatch and let the user choose whether to keep the requested medium or use the model's supported medium; do not switch silently. After complete discovery, report only that the current connection did not return the requested model, without repeating hidden names. Alternatives must be actually available and suitable.
- Rediscover tools and models after reconnecting or changing account/environment. If discovery fails or model membership cannot be established, do not submit using a static fallback.

## Creative and capability selection

Read the video Skill even for read-only video model selection. When `omni_ref_video` exists, inspect its `who_am_i` model set before choosing or falling back. Text-only input does not imply `text_to_video` is the only option: required assets depend on the selected model's input and combination rules, not the tool's name.

Honor supplied asset roles, model, sound, ratio, and quality requirements. Ask only about missing information that materially changes the result. Prefer a user-specified available model; otherwise use these branches without maintaining fixed model lists:

| Live capability | Selection |
| --- | --- |
| The current entry point, or a new one supporting the same intent, returns a suitable newer-generation model | Prefer the newer model. Use live descriptions for quality or speed preferences and actual billing information for budget comparisons. |
| No suitable new model is returned, including a new tool exposing only existing models | Keep the existing entry point and its available `defaultModel`; if that default does not meet requirements, select a suitable model within its available set. Do not mention unopened models. |

Determine newer generations from current descriptions and comparable versions within the same family, not tool count, a new tool, or speed-related names alone. If uncertain, use the existing branch without guessing. Include a new entry point only when it supports the user's asset roles and intent; never move models between tools.

Both branches require live parameters and account visibility. Stop selection when capability reading fails. Required identity/product consistency, text, motion, and sound come before version preferences. Defaults cannot override assets, duration, speed, or budget; do not silently raise resolution/count or reduce requirements. "Best quality" is not synonymous with maximum resolution or fastest generation, and does not justify claims about uninspected results.

Status, display, and link refresh are read-only. Explicit edits, variants, or video creation are new authorized steps: refresh and select the source work, then submit through the shared workflow. A dependent step must wait for a successful predecessor and a clearly selected work.

## Host and UI

Use the remote tool's actual `_meta.ui.resourceUri` (or `_meta["ui/resourceUri"]`) and `text/html;profile=mcp-app` resource. Metadata alone does not prove the widget mounted. Follow task-result rules for refresh and fallback; do not copy widget HTML or add a second MCP server.

Delete subjects, log out, or switch accounts only on an explicit request with a clear target. Uploading assets, checking credits, or selecting a subject does not authorize generation.
