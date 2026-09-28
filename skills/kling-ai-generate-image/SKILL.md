---
name: kling-ai-generate-image
description: Use Kling AI in WorkBuddy for text-to-image, image-to-image, editing, repainting, and controlled variants, including posters, products, ads, portraits, and social visuals. For existing tasks, use the core Skill's shared query workflow.
---

# Kling AI image generation

Turn a creative request into one well-specified Kling image request. Use live tools and models from `kling-ai-plugin` in this package's `mcp.json`; do not define another endpoint here.

## Operating rules

- Use host-managed OAuth. Never request or expose API keys, tokens, cookies, authorization headers, or upload tickets. Requested preview/download URLs may be delivered, but never logged or used as permanent identities.
- A generation request authorizes one submission after resolving missing inputs that materially affect the result. Do not add credit warnings or separate confirmation.
- Submit each explicitly authorized step once. Run distinct tasks and cross-media dependencies serially through the shared workflow. Never blindly retry failed or ambiguous submissions.
- Discover live definitions before selecting tools, models, input names, or enum values. Live provider fields override examples.
- Upload attached references through the remote upload workflow when needed, preserving the exact provider references.

Read [asset workflows](../kling-ai-plugin/references/asset-workflows.md) for subjects, motions, or local upload.

Before generation, obtain candidates through [capability discovery](../kling-ai-plugin/references/capability-discovery.md) and honor [account visibility](../kling-ai-plugin/SKILL.md#account-visibility-and-rollout). After selection, read the [parameter module table](../kling-ai-plugin/references/model-parameters.md), loading only applicable files. Submit through [generation submission](../kling-ai-plugin/references/tool-workflows.md). For existing tasks, go directly to [task results](../kling-ai-plugin/references/task-results.md).

## Workflow

Skip generation steps for an existing-task query.

1. Determine candidate entry points from the mode table and supplied assets. Discover relevant models and check required capabilities before choosing one or constructing parameters.
2. Load only applicable parameter modules. Skip output-selection advice only when all relevant specification fields have a single legal value. Resolve unsupported requirements before reading detailed instructions for an unavailable feature.
3. Read [prompt construction](references/prompt-construction.md) for every new generation, edit, or variant. Select a quality profile to decide visible facts and acceptance checks. Only read-only queries and authorized retries with unchanged parameters may skip it. Add [scene patterns](references/scene-patterns.md) when further scene decisions are needed. An existing complete plan is not a reason to skip prompt construction.
4. Internally establish intended use, locked facts, and creative scope. Ask only about missing critical identity/copy or conflicting requirements; choose ordinary lighting, backgrounds, and unspecified optional settings reasonably.
5. Align the prompt with the selected model and actual asset bindings, submit once through the shared workflow, then follow task results. Do not redefine polling or retry behavior here.

## Generation modes

| Intent | Mode | Interpretation |
| --- | --- | --- |
| Text-to-image | New image | Build from text without using a source image to control identity or composition. |
| Image-to-image | Edit or reference-guided image | At least one image controls content, identity, structure, composition, or style. Assign a role to each input. |
| Element reference | An available image entry point | Read the Element and use `who_am_i` to verify its type, binding parameters, and required inputs. Do not allow or forbid it based only on tool name. |
| Variant/restyle | Image-to-image with a defined change scope | State every allowed change and lock other facts. Use a single change dimension only when the user has not specified the scope. |
| Browse/preview motions | Read-only asset query | Use `motion_library_list` and the [motion workflow](../kling-ai-plugin/references/asset-workflows.md#motion-library-and-motion-control) for real results and previews; do not generate. |
| Apply a saved motion/reference video | Motion-control video | Use the [video Skill](../kling-ai-generate-video/SKILL.md) with `motion_control`: a subject image and exactly one library `motionId` or source video, with model/required parameters from `who_am_i`. Do not submit as image-to-image. |
| Progress/status | Read-only | Query the existing task without generation. |

Do not silently change modes. An attachment does not automatically imply image-to-image: ignore it only after establishing that it is unrelated to the requested new image. Never downgrade an explicit image-to-image request to text-to-image after upload or schema validation fails.

Before calling tools, internally check mode, ratio, reference roles, and allowed changes. Do not show process messages unless creative clarification is necessary.

## Creative constraints

Use selected-model modules for specification values; do not add fields or tiers from examples. Add new text only when requested. Preserve labels, logos, and product structure outside the edit scope. Variants follow all authorized changes while retaining other facts. Never invent efficacy, certifications, prices, or statistics.

## Quality gates

Before submission, align change scope, copy, ratio, and count across the request, prompt, parameters, and references. Keep a clear focal hierarchy and compatible composition/lighting; do not add details merely to fill a template.

When the host can inspect original outputs, check identity, product structure, text/labels, counts/anatomy, crops/layout, and obvious distortion against intended use. Low-resolution thumbnails cannot validate fine text. Deliver issues through [inspection and iteration](../kling-ai-plugin/references/task-results.md#inspection-and-iteration), without automatic regeneration.

## Failure handling

- Authorization: use WorkBuddy's native MCP connection flow.
- Unsupported parameters: refresh capabilities and prepare a correction, without automatically resubmitting a prior generation.
- Insufficient credits: explain and stop until recharged; do not retry automatically.
- Lost response: recover or report unknown through task results; never replay blindly.
- Provider failure: summarize safely, retain the task ID, and do not automatically resubmit.
