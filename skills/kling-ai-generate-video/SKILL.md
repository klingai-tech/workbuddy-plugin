---
name: kling-ai-generate-video
description: Use Kling AI in WorkBuddy for text-to-video, image-to-video, omni references, keyframes, or motion control, including ads, short films, and single- or multi-shot creation. Use current account capabilities and the shared lifecycle for existing tasks.
---

# Kling AI video generation

Turn the request into coherent motion direction and one authorized remote generation. Use live tools and models from `kling-ai-plugin` in this package's `mcp.json`; do not define another endpoint here.

## Operating rules

- Use host-managed OAuth. Never request or expose API keys, tokens, cookies, authorization headers, or upload tickets. Requested preview/download URLs may be delivered, but never logged or used as permanent identities.
- A generation request authorizes one submission after resolving missing inputs that materially affect the result. Do not add credit warnings or separate confirmation. If a live tool requires billing disclosure, explain its actual returned billing scope before submission without inventing prices or billing methods.
- Submit each explicitly authorized step once. Run distinct tasks and cross-media dependencies serially through the shared workflow. Never automatically retry failed or ambiguous generation.
- Discover live tools and definitions at runtime. Never hardcode model names, input roles, durations, or multi-shot fields from examples.
- Upload attached media through the remote upload workflow when needed and retain exact returned references.

Read [asset workflows](../kling-ai-plugin/references/asset-workflows.md) for subjects, motions, or local upload.

Before generation, obtain candidates through [capability discovery](../kling-ai-plugin/references/capability-discovery.md) and honor [account visibility](../kling-ai-plugin/SKILL.md#account-visibility-and-rollout). After selection, read the [parameter module table](../kling-ai-plugin/references/model-parameters.md), loading only applicable files. Submit through [generation submission](../kling-ai-plugin/references/tool-workflows.md). For existing tasks, go directly to [task results](../kling-ai-plugin/references/task-results.md).

## Load recommendations by capability

Existing-task queries skip recommendations and creative references. For new generation, read the current connection's complete `tools/list`, following every `nextCursor`, then read exactly one file:

| Tool discovery | Read |
| --- | --- |
| No `omni_ref_video` | [Standard video recommendations](references/standard-video.md) |
| `omni_ref_video` exists | [Omni and new-model recommendations](references/omni-video.md), which branches further using actual model availability |

Then discover models through the [video candidate tools](../kling-ai-plugin/references/capability-discovery.md#video-candidate-tools). When `omni_ref_video` exists, ordinary text/image video requests must query it together with the existing entry point before deciding whether its models meet input requirements. Recommendation files govern selection; parameter modules govern payloads. Do not preload both files or branch on tool count. Discovery failure is not absence of a new tool: explain the inability to read capabilities and stop selection. Re-evaluate after reconnecting or switching account/environment; discard the invalidated branch.

## Workflow

1. Select the tool/model pair using recommendations and live responses, preferring a requested available model. Use the module table for specifications, required/optional inputs, and sound; do not preload irrelevant modules.
2. Read [motion and shot planning](references/motion-and-shots.md) for every new generation, edit, or variant. Select a profile governing motion budget, camera path, continuity anchors, and acceptance checks. Only read-only queries and authorized retries with unchanged parameters may skip it. Add [scene patterns](references/scene-patterns.md) when products, UGC, explainers, multi-shot stories, or social formats need further decisions. A complete existing plan does not replace motion planning.
3. Internally establish intended use, protected subjects, and target action. Ask only about blocking assets/dialogue or conflicting requirements; choose ordinary camera movement, lighting, and unspecified options reasonably instead of requiring a questionnaire.
4. Write a motion-centered prompt covering subject/camera/environment movement, rhythm, continuity, and protected elements. Translate abstract quality into lighting, materials, depth, and composition.
5. Validate parameters, check credits, and submit once through the shared workflow. After acceptance, follow task results. Do not generate comparison samples automatically or create an unrequested final version after a preview.

## Creative constraints

Load applicable modules for reference roles, frame order, combination caps, sound controls, and output specifications. Never silently discard unsupported inputs, convert them to text, guess fields/models/enums, or switch account/endpoint to probe availability.

Focus the prompt on requested action and visuals. Do not add unrequested narration, on-screen text, characters, or claims. Match single/multi-shot structure to narrative intent and supported parameters; do not split into multiple paid tasks merely to add shots.

## Quality gates

Before submission, align duration, ratio, shot structure, and sound switches with the prompt. Actions need a beginning, progression, and end; frames need plausible transitions; multi-shot continuity must be explicit. Each ad/explainer shot needs a communication purpose.

When the host can inspect video, check opening, key action, transitions, and ending for identity drift, deformation, flicker, discontinuity, and cropping. Listen to required dialogue/audio for wording, lip sync, and original-sound intent. Covers or still frames cannot establish motion or audio quality. Follow [shared inspection rules](../kling-ai-plugin/references/task-results.md#inspection-and-iteration).

## Failure handling

- Authorization: use WorkBuddy's native MCP connection flow.
- Invalid model/parameters: refresh capabilities and prepare a correction without automatically resubmitting a prior generation.
- Insufficient credits: explain and stop until recharged; do not retry automatically.
- Lost response: recover or report unknown through task results; never replay blindly.
- Provider failure: summarize safely, retain the task ID, and do not automatically resubmit.
