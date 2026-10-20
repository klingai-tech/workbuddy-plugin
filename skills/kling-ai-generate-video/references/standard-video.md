# Standard video recommendations

Read only when the complete current `tools/list` has no `omni_ref_video`. Shared visibility, user-model preference, and single-submission rules apply. Do not also load omni recommendations.

## Entry point and model

| Intent | Entry point and handling |
| --- | --- |
| Text only | `text_to_video`; define the opening in words without inventing a source image |
| Single image, first/last frames, or multiple references | `image_to_video`; distinguish frame control from identity/style references using live model declarations |
| Motion transfer | `motion_control`; require a subject image and exactly one saved `motionId` or source video |
| Explicit omni, video, or audio references | Explain unmet requirements if current tools cannot support them fully; do not drop assets or silently downgrade |

Use live parameters and available defaults for an explicitly selected basic entry point. Ordinary video requests follow [omni recommendations](omni-video.md). Never infer unavailable models or features.
