# Kling AI Global for WorkBuddy

Kling AI connects WorkBuddy to the official OAuth-protected Kling MCP service
for image and video creation, reusable subject management, and motion-library browsing.

This package uses only the Global Kling MCP endpoint configured in `mcp.json`:
`https://kling.ai/mcp/plugin`.

## Capabilities

- Text-to-image and reference-guided image editing. When no model is specified, use a compatible default image model returned for the current account.
- Kling 4.0 supports text-to-video, image-to-video with first, last, and intermediate keyframes, and Omni-Ref with images, videos, audio, and Elements. It generates 3–30 seconds at 720p, with 1080p available to eligible accounts.
- Kling 4.0 Flash supports text-to-video, image-to-video from a single first frame, and Omni-Ref with images, videos, and Elements. It generates 3–20 seconds at 720p.
- Both Omni-Ref models support smart shot splitting and can generate synchronized audio or preserve source video audio. The two audio settings are mutually exclusive.
- Subject library (Elements): create, browse, inspect, update, delete, and reuse subjects
- Motion-library browsing and motion control from a saved motion or reference video
- Two-step local asset upload when supported by the current Global MCP and host
- Credit and task-status queries
- Generation progress tracking and result delivery

## Connect

Install the connector from WorkBuddy, choose **Connect**, and complete the Kling
OAuth flow in the browser. WorkBuddy manages authorization and refresh; no API
key is required.

To switch accounts or regions, disconnect the current account before installing
and connecting the intended package. Never paste credentials, tokens, or cookies
into a conversation.

## Use

Describe the image or video you want in natural language. When no model is
specified, prefer a compatible Kling 4.0 model returned for the current account
under `omni_ref_video`. Use a compatible available default if none is suitable.
Each authorized generation step is submitted once. A working result
widget refreshes progress; otherwise Kling AI checks at service-allowed
intervals until success or failure. If the current turn ends first, it returns
a **task number** that can be used to query the same task later.

If credits are insufficient, sign in to the same account on the official Kling
site to recharge. Then return to this conversation and say "Continue the previous
task." WorkBuddy checks an existing task first and checks credits before any new
submission. Completed results include the primary image, video, or result link supplied by Kling.
Temporary result links can be refreshed by querying the original task number;
the work also remains available in the authorized account's Kling generation
history.

Try "Save these front and side views as my first reusable character, Alice",
"List my subject library", or "Browse my saved motions, then apply the one I select
to this subject image". Browsing libraries only reads assets; applying a subject
or motion to generation creates a paid task. Available tools and models depend
on the current account and live Global capabilities.

## License

[MIT](./LICENSE)
