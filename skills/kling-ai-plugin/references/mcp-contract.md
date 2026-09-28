# Generation request structure

Read only when constructing the outer generation payload. Use [capability discovery](capability-discovery.md) and [parameter rules](model-parameters.md) for selection and module loading. Asset-management tools use their own schemas; queries and UI follow task results.

- The current tool's `inputSchema` governs the envelope and value encoding; `who_am_i` governs model capabilities. Generation tools commonly use `model`, `arguments[]`, `inputs[]`, `rationale`, and `taskTraceId`. Do not add undeclared fields from examples.
- `model` is the canonical name returned for this account under this tool. `arguments[]` contains `{name, value}`; current tools require string values, including numbers, booleans, and JSON arrays. Send each name once.
- `inputs[]` contains `{name, inputType, url}` using only declared model slots and real resource references. Follow live `inputType` rules. Omit the array for no inputs, never required assets.
- `rationale` briefly explains intent and parameter choices; it does not replace the user's prompt. Prompt prose cannot bypass field or enum restrictions.
- Reuse a UUIDv7 `taskTraceId` for the same goal; create a new one only for an unrelated goal. It is a trace identifier, not an idempotency key or permission to replay a paid request.
- Satisfy both the tool schema and the selected model's parameters and conditional limits. Generic tool descriptions or other-model examples cannot override capabilities. Refresh conflicting discovery and stop if the mismatch persists.
- Element and image/video subject support depend on the selected tool/model declarations and conditions in `who_am_i`, not merely the presence of `elements`, tool descriptions, or historical examples.

A returned `generationId` means created/accepted, not completed. Continue with [task results](task-results.md); `creditsConsumed` does not establish success.
