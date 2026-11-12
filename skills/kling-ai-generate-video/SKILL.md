---
name: kling-ai-generate-video
description: Write Kling AI video prompts or storyboards in WorkBuddy, request missing assets, prepare final generation settings, or run text-to-video, image-to-video, omni references, keyframes, and motion control. Use the shared lifecycle for existing tasks.
---

# Kling AI video generation

Use live tools and models from `kling-ai-plugin` in this package's `mcp.json`. Identify the deliverable for this turn.

| Current request | Deliverable |
| --- | --- |
| Prompt or storyboard only | Use [motion and shot planning](references/motion-and-shots.md) and finish with the creative text. This step needs no account query, model selection, upload, or invitation to generate |
| Required asset is missing | Ask only for the asset and explain its role, such as a product photo needed as the first frame. Prepare settings after the asset is supplied |
| Final settings only | Discover compatible pairs. Present the mode, model, prompt summary, duration, resolution, ratio, count, shot structure, reference roles, and required billing disclosure. Wait for approval |
| Authorized generation | Follow the workflow and submit once under the existing authorization |
| Existing task | Use the known task number and follow [task results](../kling-ai-plugin/references/task-results.md) |

## Operating rules

- Use host-managed OAuth. Never request or expose API keys, tokens, cookies, authorization headers, or upload tickets. Requested preview/download URLs may be delivered, but never logged or used as permanent identities.
- A generation request authorizes one submission after resolving missing inputs that materially affect the result. Do not add credit warnings or separate confirmation. If a live tool requires billing disclosure, explain its actual returned billing scope before submission without inventing prices or billing methods.
- Submit each explicitly authorized step once. Run distinct tasks and cross-media dependencies serially through the shared workflow. Never automatically retry failed or ambiguous generation.
- Discover live tools and definitions at runtime. Never hardcode model names, input roles, durations, or multi-shot fields from examples.
- Upload attached media through the remote upload workflow when needed and retain exact returned references.

Read [asset workflows](../kling-ai-plugin/references/asset-workflows.md) for subjects, motions, or local upload.

Before generation, obtain candidates through [capability discovery](../kling-ai-plugin/references/capability-discovery.md) and honor [account visibility](../kling-ai-plugin/SKILL.md#account-visibility-and-rollout). After selection, read the [parameter module table](../kling-ai-plugin/references/model-parameters.md), loading only applicable files. Submit through [generation submission](../kling-ai-plugin/references/tool-workflows.md). For existing tasks, go directly to [task results](../kling-ai-plugin/references/task-results.md).

## Default video recommendation

Include `omni_ref_video` among the candidates for ordinary text-to-video, image-to-video, and keyframes. Prefer a returned Kling 4.0 model from that entry point when it satisfies the full request. Read [omni recommendations](references/omni-video.md) and discover models through [video candidate tools](../kling-ai-plugin/references/capability-discovery.md#video-candidate-tools). Use canonical names and parameters from the live response; never infer availability from this recommendation. Discovery failure requires refreshing the connection or reporting the problem before selection. Motion control and other specialized requirements use entry points supporting their required capabilities.

## Workflow

1. Capture model restrictions, reference roles, sound, duration, ratio, resolution, count, and shot requirements. Filter live tool/model pairs against those requirements before ranking them. Use the module table for the selected pair.
2. Read [motion and shot planning](references/motion-and-shots.md) for every new generation, edit, or variant. Select a profile governing motion budget, camera path, continuity anchors, and acceptance checks. Only read-only queries and authorized retries with unchanged parameters may skip it. Add [scene patterns](references/scene-patterns.md) when products, UGC, explainers, multi-shot stories, or social formats need further decisions. A complete existing plan does not replace motion planning.
3. Internally establish intended use, protected subjects, and target action. Ask only about blocking assets/dialogue or conflicting requirements; choose ordinary camera movement, lighting, and unspecified options reasonably instead of requiring a questionnaire.
4. Write a motion-centered prompt covering subject/camera/environment movement, rhythm, continuity, and protected elements. Translate abstract quality into lighting, materials, depth, and composition. Upload assets when needed after selection. Stop preparing the request if upload fails.
5. Check actual arguments against the request, especially the top-level `model`, required prompt, and first-frame slot. For an explicit specification such as `1080p`, verify the resolution enum and its conditions for the selected tool and model. For settings-only requests, present the proposal and finish. For authorized generation, check credits, submit once through the shared workflow, and follow task results. Do not generate comparison samples automatically or create an unrequested final version after a preview.

## Creative constraints

Load applicable modules for reference roles, frame order, combination caps, sound controls, and output specifications. Never silently discard unsupported inputs, convert them to text, guess fields/models/enums, or switch account/endpoint to probe availability.

Focus the prompt on requested action and visuals. Do not add unrequested narration, on-screen text, characters, or claims. Match single/multi-shot structure to narrative intent and supported parameters; do not split into multiple paid tasks merely to add shots.

## Quality gates

Before submission, align duration, ratio, shot structure, and sound switches with the prompt. Actions need a beginning, progression, and end; frames need plausible transitions; multi-shot continuity must be explicit. Each ad/explainer shot needs a communication purpose.

When the host can inspect video, check opening, key action, transitions, and ending for identity drift, deformation, flicker, discontinuity, and cropping. Listen to required dialogue/audio for wording, lip sync, and original-sound intent. Covers or still frames cannot establish motion or audio quality. Follow [shared inspection rules](../kling-ai-plugin/references/task-results.md#inspection-and-iteration).

## Failure handling

- Authorization: use WorkBuddy's native MCP connection flow.
- Invalid model/parameters: refresh capabilities and prepare a correction without automatically resubmitting a prior generation.
- Invalid resource in image-to-video or omni references: follow [asset troubleshooting](../kling-ai-plugin/references/troubleshooting.md#upload-or-asset-reference-failure) for first frames and references. Recover a known current video task by its own number. Use source task numbers only to look up source assets.
- Insufficient credits: follow [recovery](../kling-ai-plugin/references/tool-workflows.md#resume-after-insufficient-credits) and retain the original model, specifications, prompt, and references. When resuming image-to-video, validate the original first-frame slot and reference. Use the original settings when the user explicitly asks to continue after recharging.
- Lost response: recover or report unknown through task results; never replay blindly.
- Provider failure: summarize safely, retain the task ID, and do not automatically resubmit.
