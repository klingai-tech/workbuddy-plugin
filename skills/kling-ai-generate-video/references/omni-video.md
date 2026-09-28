# Omni references and new-model recommendations

Read only when the current `tools/list` exposes `omni_ref_video`. Its existence selects this document, but does not prove any model is available to the account. Do not also load standard recommendations.

## Select from available models

Candidates are actual returned tool/model pairs that fully meet asset, sound, duration, and output requirements. First obtain a model response including `omni_ref_video` through [video candidate discovery](../../kling-ai-plugin/references/capability-discovery.md#video-candidate-tools). Do not enter the no-new-model branch after querying only old entry points.

| Discovery result | Selection |
| --- | --- |
| `omni_ref_video` returns a suitable newer-generation model | Prefer that model through `omni_ref_video`. For quality, use the latest suitable model described for final output; for speed, choose an available same-generation model explicitly described for fast generation. Compare budget using live billing. |
| Only existing models are returned, or generations cannot be compared reliably | Keep `text_to_video`, `image_to_video`, or `motion_control` and their available live defaults for ordinary requests. Use a suitable available omni model when omni references are actually required. |

Prefer a user-specified available model. If the default is unsuitable, choose only within the available set. Newer does not mean best for every scenario; do not guess names or raise resolution/count without authorization.

## Routing and inputs

- Use `omni_ref_video` for supported text, image, video, Element, or audio references, verifying each type against the selected model rather than generic tool descriptions.
- Select it for text-only requests only when the model explicitly supports no assets; otherwise use `text_to_video`. Choose keyframe tools/models by their live frame-input capabilities, without assuming frames belong to one tool. Motion transfer requires actual support for that intent. Never transplant a tool's model or parameters to another entry point.

Use shared modules for specifications, references, and sound. Even when this tool exists, requests without references or sound decisions do not load those modules.
