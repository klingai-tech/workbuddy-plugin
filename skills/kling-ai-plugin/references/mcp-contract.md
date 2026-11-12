# Generation request structure

Read only when constructing the outer generation payload. Use [capability discovery](capability-discovery.md) and [parameter rules](model-parameters.md) for selection and module loading. Asset-management tools use their own schemas; queries and UI follow task results.

- The current tool's `inputSchema` governs the envelope and value encoding; `who_am_i` governs model capabilities. Generation tools commonly use `model`, `arguments[]`, `inputs[]`, `rationale`, and `taskTraceId`. Do not add undeclared fields from examples.
- Always set the top-level `model` to the exact canonical ID returned for the current account under the selected tool. The service validates this field even when older schemas omit it from `required`. Select a compatible model when unspecified. Supply a nonblank ID as its own field.
- `arguments[]` contains `{name, value}`. Current tools require string values, including numbers, booleans, and JSON arrays. Supply each required argument once. When the model requires `prompt`, provide a valid prompt reflecting user intent. Use an empty string only when the mode explicitly supports it and the request calls for it. Follow the selected model's resolution parameter name, enum, and conditions.
- `inputs[]` contains `{name, inputType, url}`. Follow the live `inputType` rules and supply each slot required by the selected model and mode, such as `image_1` when required. Send asset URLs separately from the text prompt. Omit the array only when there are no inputs and the model permits it. Pass uploaded URLs using the [upload rules](asset-workflows.md#local-asset-upload).
- `rationale` briefly explains intent and parameter choices; it does not replace the user's prompt. Prompt prose cannot bypass field or enum restrictions.
- Reuse a UUIDv7 `taskTraceId` for the same goal; create a new one only for an unrelated goal. It is a trace identifier, not an idempotency key or permission to replay a paid request.
- Satisfy both the tool schema and the selected model's parameters and conditional limits. Generic tool descriptions or other-model examples cannot override capabilities. Refresh conflicting discovery and stop if the mismatch persists.
- Element and image/video subject support depend on the selected tool/model declarations and conditions in `who_am_i`, not merely the presence of `elements`, tool descriptions, or historical examples.

This example applies only when the selected model declares `duration` and `aspect_ratio` and supports the values shown. Replace the placeholder model ID with the value from the current response and supply any required `inputs[]` slots.

```json
{
  "model": "<model ID returned by who_am_i>",
  "arguments": [
    {"name": "prompt", "value": "Creative video description"},
    {"name": "duration", "value": "7"},
    {"name": "aspect_ratio", "value": "9:16"}
  ]
}
```

Before submitting, check each explicit requirement against the actual argument, reference slot, or fixed model setting. Use the submitted settings in the result summary.

A returned `generationId` means created/accepted, not completed. Continue with [task results](task-results.md); `creditsConsumed` does not establish success.
