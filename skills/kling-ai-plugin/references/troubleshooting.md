# Troubleshooting

## MCP tools are missing after installation

Reload WorkBuddy and confirm that the `kling-ai-plugin` MCP
server is enabled. If the tools still do not appear, restart the host and
check its MCP diagnostics. Do not ask for an API key as a workaround.

## Not authorized or not linked

Open WorkBuddy's connector connection entry, select `kling-ai-plugin`, and complete
the browser OAuth flow. WorkBuddy may show the connection under the connector
details page or MCP settings. If OAuth returns `invalid_target`, do not invent
an `oauth_resource` override; report the host diagnostic and verify the current
Kling protected-resource metadata.

## Media intake or image-to-video fails

- Refresh the live schema and select the model before mapping media.
- Prefer a host-provided media reference only when the selected model accepts it. If a local file has none, check [asset workflows](asset-workflows.md) for live `file_upload` availability and host multipart support. Receiving a ticket is not upload completion; never use the upload address or a local path as the final media URL.
- Preserve the same `taskTraceId` across media preparation and generation.
- Use only the input names, value types, and reference roles declared by the
  selected model. Never interchange `image_1`, `first_image`, `tail_image`, or
  `image`, and never put a local path directly in `inputs[]`.
- If the media comes from an older Kling task, call `query_tasks` once immediately
  before submission and use the fresh URL for the bound work index. If it still
  fails, ask the user to attach the image again instead of trying old URLs.

## Task is still running

During the original generation turn, continue polling with the live status tool
at intervals allowed by Kling until the task succeeds or fails. If the user
cancels or the turn times out, return the task number; the task keeps running on
Kling's side. A later explicit status request queries it once.

## Generation fails

Return the provider's failure message and preserve the IDs for support. Do
not automatically create a replacement task because that may consume credits
again.

For an opaque failure, empty result, repeated validation failure, billing
anomaly, or clearly unintended result, call `feedback` once using the live tool
contract. Feedback does not authorize a replacement generation.

## Insufficient credits

Tell the user the balance is insufficient and ask them to recharge before
trying again. Do not submit another paid generation until the user explicitly
states that the balance changed.

## Rate limited or queue full

Report the provider message and stop. Do not wait and retry automatically,
switch models, alter parameters, or bypass the account queue. Status polling
must continue to respect provider intervals.

## Submission timed out and task creation is unknown

Do not retry the generation call. `query_tasks` requires a `generationId`; when
one exists, query only that task. Without a `generationId`, neither
`taskTraceId` nor an undocumented task-list filter can recover the unknown
submission. Report the status as unknown and stop. Create a new paid task only
after the user explicitly accepts the possible duplicate charge.

## Result link expired

Output URLs expire after 24 hours. Query the preserved `generationId` once to
obtain a current URL for the bound `works[]` index, or view generation history
while signed in. An expired URL does not mean the generated work was lost.
Never log or treat a signed URL as a permanent asset identifier.
