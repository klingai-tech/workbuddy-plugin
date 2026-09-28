# Reference inputs and combination limits

Read only for actual/required model reference inputs or a supported Element used in this request.

- Inspect real assets when viewing/playback is available; otherwise use only user-stated facts, never inferred content from filenames. Ask when clarity, cropping, or identity conflicts affect required outcomes.
- Align each asset with its declared input slot and prompt reference. Distinguish first/last frames, identity/product, style, motion, and scene editing. Use the selected model's reference syntax, not another entry point's syntax.
- Preserve identity, structure, labels, and colors according to assigned roles. Style references transfer only requested style traits. Protect important content when changing ratio; do not stretch subjects or implicitly crop text.
- Send only declared frame slots and required inputs, preserving order and describing transitions. Do not invent intermediate-frame fields, timestamps, or frame-count formulas. A first frame locks the opening, not all subsequent camera motion.
- Read Element details to establish resource type. The model must support both that type and its binding parameters. Serialize IDs, binding names, and types as required. Do not substitute a cover for a video subject or an Element for required image input.
- Check URL origin, format, size, and individual/total durations against the model. Reuse accepted references first; read [local upload](asset-workflows.md#local-asset-upload) only when needed.
- Common current image-to-image/image-to-video reference gates are PNG/JPG, at most 30 MB per file, resolution below 4K, and long/short-side ratio at most 2:1. Motion-source videos commonly require 3–30 seconds, a short edge of at least 340 px, and a long edge at most 3850 px. Enforce stricter live constraints; do not apply gates to unrelated tools. If host metadata is unavailable, do not claim format, size, dimensions, or ratio were checked.
- Enforce `combinedItemCap` when present. For `combinedItemCaps[]`, evaluate `whenAnyInputPrefixes` / `whenNoneInputPrefixes` and satisfy every applicable cap. Count actual items, not the highest slot index, including Elements where declared.
- For `elementSupport`, check types, per-type/total counts, and extra restrictions with reference video. Exclusions in descriptions also apply. Do not bypass limits by repeating inputs, removing required assets, or changing their types.
- Library capacity and subjects per generation are different limits. Use the selected model's `maxItems` and combination caps, not membership-page storage capacity.
- Submit only relevant assets. Do not drop explicit references. Resolve excess counts or conflicting identities/roles before submission; never claim uninspected properties are verified.
- For motion transfer, compare visible body coverage, occlusion, and continuity between the subject and source. Supply the required image and exactly one motion source according to live rules. A motion preview URL is not a `motionId`.
