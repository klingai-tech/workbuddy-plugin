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

1. Follow [capability discovery](capability-discovery.md) for complete tools and relevant models, defaults, parameters, and inputs, avoiding unrelated/repeated queries. Apply the [selection branches](../SKILL.md#creative-and-capability-selection). Do not display, recommend, or call unreturned models, change endpoints, or submit capability probes.
2. The request authorizes one call per explicit step. Resolve only material missing information without repeating confirmation. Disclose omni billing only when required by the live tool, using actual returned information.
3. Prefer host references accepted by the model; use [two-step upload](asset-workflows.md) when needed. Before new generation with a historical Kling work, query its original task once and select the current URL by original index/type. Stop if identity is missing, refresh fails, or the resource remains unusable; do not retry old URLs.
4. Validate required fields, types, enums, counts, and exclusions against the [MCP contract](mcp-contract.md) and model. Rebuild requests after switching models, without old parameters.
5. Immediately before paid generation, call `query_membership_and_credits`. Stop on nonpositive or explicitly insufficient balance until it changes. A positive balance without task cost is not proof of sufficiency. Read-only task/asset queries do not require a credit lookup.
6. Submit each authorized step once and retain task/trace IDs. Label the user-facing ID as a task number. Acceptance and `creditsConsumed` are not completion evidence. Do not stop at preparation when submission is authorized.
7. Keep at most one nonterminal paid task per goal. Dependent generation continues only after the previous task succeeds and a source work is clearly selected; terminate the dependent chain on failure or unresolved source selection.

## Ambiguity, failure, and stopping

If an ambiguous response includes `generationId`, query it. Without one, use task-list or trace lookup only if explicitly exposed by live tools. Otherwise report unknown and stop, without inferring non-creation or replaying.

Credit, membership, queue, rate-limit, asset, or service errors do not authorize automatic retry, model switching, or intent changes. For an explicit retry, resolve whether the earlier task was created, then submit once using the same goal's trace ID. If ambiguity cannot be resolved, explain potential duplicate charging and treat replacement as a new paid step only after the user explicitly accepts that risk.

Continue subsequent authorized steps when their dependencies are satisfied. Use [task results](task-results.md) for refresh, fallback, and inspection, and [troubleshooting](troubleshooting.md) for error details.
