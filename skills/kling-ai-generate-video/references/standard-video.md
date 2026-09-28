# Standard video recommendations

Read only when the complete current `tools/list` has no `omni_ref_video`. Shared visibility, user-model preference, and single-submission rules apply. Do not also load omni recommendations.

## Entry point and model

| Intent | Entry point and handling |
| --- | --- |
| Text only | `text_to_video`; define the opening in words without inventing a source image |
| Single image, first/last frames, or multiple references | `image_to_video`; distinguish frame control from identity/style references using live model declarations |
| Motion transfer | `motion_control`; require a subject image and exactly one saved `motionId` or source video |
| Explicit omni, video, or audio references | Explain unmet requirements if current tools cannot support them fully; do not drop assets or silently downgrade |

Keep the available `defaultModel` for the relevant entry point. If it cannot meet speed, budget, sound, or asset requirements, select a suitable available model within that entry point. Absence of an omni tool does not imply other tools are unchanged: if an entry point returns a suitable newer model, follow core selection rules and read its live parameters.

Use shared parameter modules after selection; do not load or construct undeclared features. Compare speed and budget using live descriptions and billing, not names. Never mention unreturned models or suggest upgrading to a hidden model.
