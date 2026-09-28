# Sound and audio

Read only when the selected model declares sound controls, source-audio retention, or audio inputs and this request needs a choice, input, or related dependency check. Tool-level audio support does not imply every model supports it.

- Distinguish generated sound, preserved source audio, silence, dialogue, and narration. Map each only to declared parameters/values. Missing controls guarantee neither silence nor sound; audio references do not automatically support voice cloning or exact dialogue.
- If the model makes `enable_audio` and `keepOriginalSound` mutually exclusive, never set both true. Set both fields only when both are declared. Explain incompatible requests without pretending prose makes them compatible.
- Use only declared audio slots, reference syntax, formats, and duration limits. Never pass audio through image/video slots when no audio input exists.
- Preserve supplied dialogue verbatim, with speaker, language, tone, and order. Do not convert narration to in-scene speech, dialogue to subtitles, or add slogans.
- Assess whether words, pauses, action, and ending fit the duration; a fixed word-count formula cannot guarantee fit. Resolve clear conflicts without speeding, truncating, or deleting speech. Read [output options](output-options.md) only if specifications need reselection.
- Give voice, ambience, and music distinct purposes and levels; subordinate background sound when speech needs clarity. Inspect actual audio when required, not a cover or silent preview.
