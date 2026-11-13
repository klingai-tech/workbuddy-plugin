# Omni references and Kling 4.0 recommendations

Include `omni_ref_video` for ordinary text-to-video, image-to-video, keyframes, and omni references. Obtain actual available tool/model pairs through [video candidate discovery](../../kling-ai-plugin/references/capability-discovery.md#video-candidate-tools).

## Select from available models

Prefer a requested model that meets all requirements. Otherwise recommend a compatible returned Kling 4.0 model from `omni_ref_video`. Use live descriptions for quality and speed, and actual billing for budget. If no compatible Kling 4.0 pair is returned, use a compatible live default only when the model is open or the user accepts alternatives. If the user requires Kling 4.0 or no pair meets the requirements, report the unmet requirement and stop. Required assets, sound, duration, speed, and budget take precedence over version preferences. Never guess names, move models between tools, or raise resolution/count without authorization.

## Routing and inputs

When the user names Kling 4.0 or Kling 4.0 Flash, match the full model name against the current account's live response. Kling 4.0 image-to-video supports first, last, and intermediate keyframes, and its Omni-Ref accepts images, video, audio, and Elements. Flash image-to-video uses a single first frame, and its Omni-Ref accepts images, video, and Elements. Check the declared input slots for separate audio references. Use output settings for synchronized or preserved source audio.

Text-only omni requires a model that permits no media input. Keyframes require model-declared first-frame, last-frame, or ordered-frame slots. Motion transfer requires a model that explicitly supports that intent. See [standard video guidance](standard-video.md) for compatible standard entry points.

For required silence, filter out pairs without a declared way to turn sound off or an explicit silent-output guarantee. Check generated sound and preserved source audio. An entry-point name, a missing sound field, or “silent” in the prompt cannot establish silent output.

After selecting a pair, use the [parameter module table](../../kling-ai-plugin/references/model-parameters.md) for specifications, references, and sound.

## Elements and audio inputs

- For a library character, follow [subject binding](../../kling-ai-plugin/references/asset-workflows.md#bind-a-subject-to-generation): resolve its actual ID by name, read details, and confirm model support. Bind it using an `elements` JSON array string in `arguments[]` and reference `<<<actual-subject-ID>>>` in the prompt, unless live declarations specify updated fields or syntax. Do not merely name the character or request re-upload of library assets.
- For audio, read [audio options](../../kling-ai-plugin/references/audio-options.md), place the accessible asset reference in the model-declared audio slot in `inputs[]`, and follow declared prompt reference syntax. Clarify its intended rhythm, music, voice-reference, or other supported role when ambiguity materially affects the result. Validate audio inputs separately from generated-sound switches.
- Combine Elements, images, video, and audio only within the selected model's [reference limits](../../kling-ai-plugin/references/reference-inputs.md), including counts, duration, and exclusions. Elements do not replace required images; audio does not occupy image/video slots. Never silently omit requested references.
