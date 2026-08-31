# Paid-task workflow

1. Read `tools/list` from remote `kling-ai-plugin` at `https://kling.ai/mcp`. Before generation, call `who_am_i` and use only the target model's declared arguments, defaults, allowed values, and media inputs.
2. For a cross-media request, identify only the paid stages the user explicitly requested. Apply the image Skill to an image stage and the video Skill to a video stage. Run them strictly in dependency order; start a dependent stage only after the previous task succeeds and its exact work is selected. If any stage fails, is cancelled, times out without a usable result, or has unknown submission status, terminate the dependent chain.
3. At each stage, select the tool and model before mapping media. Rebuild `arguments` and `inputs` from that model's live schema, run failure-prevention gates, and query credits immediately before submission.
4. Once materially missing inputs are resolved, call the selected remote generation tool once with `{model, arguments[], inputs[], rationale, taskTraceId}` and preserve its `generationId`. Reuse one UUIDv7 `taskTraceId` throughout the objective. Do not add a credit warning or separate confirmation step.
5. If submission is not terminal, poll with the status tool declared by the live schema at provider-allowed intervals until success or failure. On user cancellation or current-turn timeout, return the state and task number.
6. Bind every displayed `works[]` item to its task number, work index, and `contentType`; present the primary result and note the 24-hour URL lifetime.

Never retry a generation automatically or continue a dependent paid stage without a successful usable predecessor.
