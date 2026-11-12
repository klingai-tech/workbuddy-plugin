# Generation submission and retries

Read only for generation or an authorized retry. For accepted submissions or ordinary status queries, use [task results](task-results.md).

## Identify intent

| Request | Action |
| --- | --- |
| Create, explicitly retry, edit, or make a variant | Execute one authorized step when inputs are complete; failure alone does not authorize retry |
| Check progress, view results, refresh links | Query the existing task without regeneration |
| Multiple works or cross-media tasks | Treat each explicitly requested step as authorization and execute in dependency order |
| Previous timeout or lost response | Recover a known task first; unknown does not mean never created |

Reuse a UUIDv7 `taskTraceId` for the same goal; unrelated goals get new values. It is for tracing, not idempotency. Stable work identity consists of `generationId`, original `works[]` index, and `contentType`, never a temporary URL.

## Prepare and submit once

1. Follow [capability discovery](capability-discovery.md) for relevant tools and models. Reuse the response obtained during preparation. Apply [creative and capability selection](../SKILL.md#creative-and-capability-selection) to find a compatible pair. Display, recommend, and call only models returned for the current account.
2. The request authorizes one call per explicit step. Resolve only material missing information without repeating confirmation. Disclose omni billing only when required by the live tool, using actual returned information.
3. Prefer host references accepted by the model; use [two-step upload](asset-workflows.md) when needed. Before new generation with a historical Kling work, query its original task once and select the current URL by original index/type. Stop if identity is missing, refresh fails, or the resource remains unusable; do not retry old URLs.
4. Validate required fields, types, enums, counts, and exclusions against the [MCP contract](mcp-contract.md) and model. Rebuild requests after switching models, without old parameters.
5. Immediately before paid generation, call `query_membership_and_credits`. Pause through the recovery workflow below if the balance is nonpositive, the service explicitly declines for insufficient credits, or the live estimate for the same settings exceeds the available balance. A positive balance without a task cost does not confirm sufficiency. Read-only task and asset queries do not require a credit lookup.
6. Submit each authorized step once and retain task/trace IDs. Label the user-facing ID as a task number. Acceptance and `creditsConsumed` are not completion evidence. Do not stop at preparation when submission is authorized.
7. Keep at most one nonterminal paid task per goal. Dependent generation continues only after the previous task succeeds and a source work is clearly selected; terminate the dependent chain on failure or unresolved source selection.

## Resume after insufficient credits

1. Keep the original intent, tool, canonical model ID, prompt, specifications, asset slots, and usable host asset references in the current conversation. Retain the `taskTraceId`, submission state, and any known `generationId`. Use `query_membership_and_credits` as the source of the current balance. Report a shortfall only when the live service gives an estimate for the same settings.
2. Provide the official recharge entry returned by the current connection for the account's region. Otherwise direct the user to the account page on the [official Kling Global site](https://kling.ai/) using the same account. Avoid test or staging links, guessed payment URLs, and asset references. The user completes the recharge. Explain the original task's status and invite them to return to the same conversation and ask to continue.
3. When the user only says they recharged, refresh the balance and explain the next step. For an explicit request to resume, identify the original task in the current conversation. If there are several candidates, ask which one to resume. If `generationId` is known, query the original task before checking credits or preparing a submission. Deliver its status or work through [task results](task-results.md). Proceed to normal submission only if the generation call was never sent or the service confirms no task was created and no credits were charged. Handle unknown submission outcomes under the rules below.
4. For an eligible new submission, check credits again on the same account and verify that the model and assets are still usable. Keep the original settings and trace ID. If credits remain insufficient, preserve the task and report its status. Replace an expired reference using the original asset when still available and request only assets that cannot be recovered. Ask the user to choose if the original settings are unavailable and a model or billing setting needs to change. Follow the single-submission rule once the conditions are met.

## Ambiguity, failure, and stopping

If an ambiguous response includes `generationId`, query that task. If no task number was obtained, report the known outcome or error, mark any unresolved creation or billing state unknown, and stop. `query_tasks` requires the task number and cannot search history, check credits, or recover tasks by `taskTraceId`. An unchanged balance or missing history entry cannot establish creation or billing state.

Credit, membership, queue, rate-limit, asset, or service errors do not trigger automatic retries, model switching, or intent changes. Another submission requires fresh authorization, including after a rejected call or a report that no task is visible. For an explicit retry, check the original submission state. If it remains unknown, submit a replacement only after the user explicitly accepts the risk of duplicate charges.

Continue subsequent authorized steps when their dependencies are satisfied. Use [task results](task-results.md) for refresh, fallback, and inspection, and [troubleshooting](troubleshooting.md) for error details.
