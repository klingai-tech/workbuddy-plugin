# Generation failure-prevention gates

Convert observed failure classes into pre-submission checks and explicit stopping conditions. Error names are diagnostic labels only; they do not override the live schema or authorize retries, intent changes, or provider-limit workarounds.

## Five gates for every paid generation

1. **Connection and account:** call `who_am_i`; for an Element, also call `element_get` and verify that the current account can access it and that its resource type matches the target tool.
2. **Credits and membership:** call `query_membership_and_credits` immediately before each paid submission. Stop on zero, a non-positive value, or an explicit insufficient-credit result. A positive balance is not proof that it covers a task whose exact cost is unknown. Use only models, resolutions, and membership capabilities returned for the current account.
3. **Queue and concurrency:** keep at most one non-terminal paid task for one user objective. Prefer one legal `imageCount` for multiple results; when distinct tasks are necessary, submit them serially and wait for terminal state.
4. **Request shape:** build closed allowlists for top-level fields, `arguments`, and `inputs` from the selected model. Satisfy required/default values and validate enums, counts, mutually exclusive fields, and string values. Rebuild from empty after changing models.
5. **Media and mode:** refresh historical Kling results by task number; validate type, size, dimensions, ratio, role, accepted source, and Element type. Motion control also validates the subject, exactly one motion source, direction, and declared duration limits.

## Account, credits, and queue

| Error | Prevent before submission | Handle after occurrence |
| --- | --- | --- |
| `PointNotEnough` | Query credits immediately before every paid call. Do not probe the balance with more outputs, longer duration, or higher resolution. | Report insufficient credits and stop. Do not submit any paid generation until the user explicitly states that the balance changed. If the balance appeared sufficient, call `feedback` once for a billing anomaly. |
| `MembershipNeed` | Select only models and values currently available to the authorized account. | Explain that the capability requires membership. Change model or parameters only after the user chooses an available alternative. |
| `MembershipQueueLimit` | Serialize paid generations; do not submit the next task before the previous one is terminal. | Report a full account queue and stop. Do not wait and retry or switch models to bypass it. |
| `RateLimitExceeded` | Serialize paid tasks, avoid duplicate submissions, and respect provider status-query intervals. | Return the provider message and stop. Do not wait and retry, switch models, or change parameters to create another task. |
| `Unauthorized` | Require a successful `who_am_i` in the current turn before preparing generation. | Use the host's native reconnect flow. Do not call other Kling tools until reauthorization completes. |
| `RiskUnauthorized`, `BehaviorRiskPOther` | Do not disguise subjects, purposes, or media provenance or rewrite prompts to evade risk controls. | Explain the restriction and stop. Call `feedback` once when the reason is opaque; do not retry. |

## Parameters, modes, and Elements

| Error | Prevent before submission | Handle after occurrence |
| --- | --- | --- |
| `InvalidParameter`, `InvalidArguments` | Use the live closed allowlist; require a canonical `model`; make every argument value a string; reject undeclared parameters, inputs, enums, and empty placeholders. | Identify the rejected field and reread the schema. Resubmit a corrected complete request only when the user authorizes another generation. |
| `ImageTaskDisallowsVideoElement` | If `element_get` exposes `resource.video`, do not use it in an image task. Route it only to an `image_to_video` model whose live schema allows it. | Preserve the Element ID and explain that a video task or image Element is required; do not degrade it into a cover or text description. |
| `ElementNotBelongToUser` | Call `element_get` and verify access in the current account. Do not reuse a bare ID from another account, a logged-out session, or history. | Ask the user to select an accessible Element in the current account; never guess or replace the ID. |
| `AioImageRatio`, `ImageRatio` | Use only the selected model's live `aspect_ratio` values; omit the field when undeclared. Also validate any separately declared input-image ratio limit. | Distinguish output-ratio rejection from input-image rejection and show the current allowed values. Do not crop user media automatically. |

## Image and file media

Observed image-to-image and image-to-video contracts may require PNG/JPG input, no larger than 30 MB, below 4K, with long-to-short edge ratio no greater than 2:1. Enforce these values only when the current Global tool description declares them, and use any stricter live limit; do not generalize them to other tools.

| Error | Prevent before submission | Handle after occurrence |
| --- | --- | --- |
| `UnsupportedFileType` | When metadata is available, verify actual PNG/JPG content; stop if extension and MIME disagree. | Ask for a real PNG/JPG export, not a renamed extension. |
| `FileTooLarge` | When size is available, verify it does not exceed 30 MB. | Ask the user to compress or re-export; do not reduce quality without their request. |
| `ImageSize` | When dimensions are available, verify them against the current tool's 4K ceiling. Do not invent an undeclared minimum. | Report the actual dimensions and live limit; ask for compliant media. |
| `FileUploadFailed`, `InvalidBucketName` | Before paid generation, verify that the host supplied a non-empty reference accepted by the selected model. | Treat this as a host media-intake or storage error; do not call generation. Call `feedback` once and ask the user to retry later or provide the media again. |
| `ResourceNotFound` | Never reuse an old URL for a historical Kling result. Immediately before submission, query once by `generationId` and bound work index. | If the fresh URL still fails, stop and ask the user to attach the image again. Do not query repeatedly or try another old URL field. |

If the host cannot read metadata, do not claim to have verified file type, size, dimensions, or ratio; rely only on facts explicitly validated by the host or provider.

## Motion control

| Error | Prevent before submission | Handle after occurrence |
| --- | --- | --- |
| `MOTION.DURATION_MORE_THAN_EXPECTED`, `MOTION.DURATION_LESS` | Require subject `image` and exactly one of `motionId` or motion video. For `motionDirection=image_direction`, require a 3–10 second source; for other directions use only current declared limits. | Report actual versus allowed duration and ask for another motion or a user-prepared trim. Do not trim or retry automatically. |
| `MOTION.PIC_NOT_MATCHED` | Verify that the subject image clearly contains the intended person or animal rather than a scene, style, or product reference. | Ask for a clearer subject image and reconfirm the role; do not convert the request to ordinary image-to-video. |
| `MOTION.RESOLUTION_TOO_SMALL` | Enforce a live or host-declared minimum when available; never invent a value when none is published. | Ask for a clearer, higher-resolution subject image and call `feedback` once with `CAPABILITY_SPEC_MISMATCH` because the server did not publish the minimum. |

## Content and platform failures

| Error | Prevent before submission | Handle after occurrence |
| --- | --- | --- |
| `Copyright` | Do not promise replication of protected characters, works, or marks. Preserve the user's stated rights boundary for supplied media. | Ask for owned or original material; do not use synonym rewrites to evade enforcement. |
| `Unknown`, `GenImageOther`, `POther`, `Unexpected`, `TaskSubmitFailed` | Complete account, credit, schema, media, and queue gates; submit once and preserve `generationId`, model, and `taskTraceId`. | Report the provider message and stop. Call `feedback` once when appropriate; never retry automatically. |

`feedback` reports an issue; it does not retry, refund, or repair a task. Call it at most once per incident and still follow the stopping condition for the original error.
