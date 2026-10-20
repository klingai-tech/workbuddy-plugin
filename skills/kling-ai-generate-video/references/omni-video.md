# Omni references and Kling 4.0 recommendations

Default to `omni_ref_video` for ordinary text-to-video, image-to-video, keyframes, and omni references. Obtain actual available tool/model pairs through [video candidate discovery](../../kling-ai-plugin/references/capability-discovery.md#video-candidate-tools).

## Select from available models

Prefer a user-specified available model. Otherwise recommend a suitable returned Kling 4.0 model from `omni_ref_video`. Use live descriptions for quality and speed, and actual billing for budget. If no suitable Kling 4.0 model is returned, use an available default meeting the requirements without mentioning hidden models. Required assets, sound, duration, speed, and budget take precedence over version preferences. Never guess names, move models between tools, or raise resolution/count without authorization.

## Routing and inputs

Use this entry point by default for text-only and keyframe requests, constructing required inputs and frame roles from the selected model's live declarations. Motion transfer requires actual support for that intent. Use shared parameter modules for specifications, references, and sound; load only modules relevant to the request.

## Elements and audio inputs

- For a library character, follow [subject binding](../../kling-ai-plugin/references/asset-workflows.md#bind-a-subject-to-generation): resolve its actual ID by name, read details, and confirm model support. Bind it using an `elements` JSON array string in `arguments[]` and reference `<<<actual-subject-ID>>>` in the prompt, unless live declarations specify updated fields or syntax. Do not merely name the character or request re-upload of library assets.
- For audio, read [audio options](../../kling-ai-plugin/references/audio-options.md), place the accessible asset reference in the model-declared audio slot in `inputs[]`, and follow declared prompt reference syntax. Clarify its intended rhythm, music, voice-reference, or other supported role when ambiguity materially affects the result. Validate audio inputs separately from generated-sound switches.
- Combine Elements, images, video, and audio only within the selected model's [reference limits](../../kling-ai-plugin/references/reference-inputs.md), including counts, duration, and exclusions. Elements do not replace required images; audio does not occupy image/video slots. Never silently omit requested references.
