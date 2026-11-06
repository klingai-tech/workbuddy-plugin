# Standard video recommendations

Read when considering a standard entry point returned by live discovery. Shared visibility, user-model preference, and single-submission rules apply.

## Entry point and model

| Intent | Entry point and handling |
| --- | --- |
| Text only | `text_to_video`; define the opening in words without inventing a source image |
| Single image, first/last frames, or multiple references | `image_to_video`; distinguish frame control from identity/style references using live model declarations |
| Motion transfer | `motion_control`; require a subject image and exactly one saved `motionId` or source video |
| Explicit omni, video, or audio references | Explain unmet requirements if current tools cannot support them fully; do not drop assets or silently downgrade |

Use only returned models and live parameters. Apply the same compatibility checks and model restrictions as [omni routing](omni-video.md), including required silence and actual frame roles.
