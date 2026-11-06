# Selected-model parameters and conditional modules

Complete [capability discovery](capability-discovery.md) first. Parameters, input slots, enums, defaults, and combination limits come from the selected model in the current account's `who_am_i` response; this package supplies no static model configurations or tiers.

## Minimal request

1. The tool must exist and the canonical `model` must belong to its `models`; this also applies to `defaultModel`. Fix the tool/model pair before constructing the request. Rebuild when changing models.
2. Treat that model's `arguments` and `inputs` as closed field allowlists. Omit absent fields and do not load their modules. Satisfy every required field; omit `inputs` only when there are no inputs.
3. Use exact enum values. If only one value is legal and compatible with intent and dependencies, use it without reading tier-selection advice. Omit irrelevant optional fields without required dependencies. Follow descriptions for free text; do not invent enums.
4. Bind every supported explicit setting to its own argument, including optional settings. Duration in the prompt cannot override the duration default. A first frame does not cancel a supported requested ratio. If a fixed model setting already meets a requirement, omit an invented field. Choose other values based on intended use and compatible live defaults.
5. Send each parameter name once. Encode numbers, booleans, and JSON arrays as required by the tool. Read the [request structure](mcp-contract.md) when constructing the outer payload.

Result count, smart shot splitting, and generated sound may have defaults that add content. When unrequested, choose one result and disable the relevant switches where legal. Omit undeclared controls. Stop and explain when an explicit requirement for count, shot structure, or sound cannot be met.

When smart shot splitting only allows `true`, follow the live schema and default. For an ordinary single-shot request, express one continuous shot in the prompt and explain the setting's limit. If the user requires a single-shot guarantee, submit only when live capabilities explicitly support it.

Minimal loading never permits skipping required fields or cross-field dependencies.

## Load only applicable modules

Load a module only when the selected model declares the capability and this request needs it. A tool's existence or generic description is insufficient. Always validate required inputs, dependencies, and conditional caps, even if the user did not name them.

| Request and model | Read |
| --- | --- |
| Actual or required reference inputs, or a supported Element is used | [Reference inputs](reference-inputs.md); skip for prompt-only requests |
| Ratio, duration, resolution, or count has multiple allowed values, or input conditions invalidate default specifications | [Output options](output-options.md); skip only when these fields all have a single legal value |
| Sound, source-audio, or audio-input support is declared and the user requests sound, supplies audio, or a related dependency/exclusion needs handling | [Audio options](audio-options.md); skip when no sound decision is needed |

If a required capability is absent, do not load instructions to work around it. Reconsider returned candidates that satisfy the entire request, or explain the limitation. Prompts cannot substitute for unavailable models or fields. Load by module rather than duplicating files for individual models or resolutions.
