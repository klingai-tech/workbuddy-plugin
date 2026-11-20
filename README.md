# Kling AI Global for WorkBuddy

Use Kling AI in a WorkBuddy chat to generate images and videos, track your tasks, and reuse assets from your subject and motion libraries.

The `global` branch is for Kling accounts that sign in at **kling.ai**. It connects to `https://kling.ai/mcp/plugin`. For the China edition, see the [`main` branch](https://github.com/klingai-tech/workbuddy-plugin/tree/main).

## Quick start

1. **Open the connector in WorkBuddy.** On the integration page, select **Open in WorkBuddy** and allow your browser to launch the desktop app. [Kling AI for WorkBuddy](https://www.workbuddy.ai/integrations/kling)
2. **Connect your Kling account.** Select **Connect**, sign in to your kling.ai account in the browser, and approve access. Return to WorkBuddy after authorization. WorkBuddy handles OAuth and token refresh automatically.
3. **Check the connection.** In a WorkBuddy chat, ask “Use Kling AI to check my remaining credits.” Once WorkBuddy shows your balance, try one of the prompts below.

For the full setup guide, see the [official Kling MCP & CLI guide (Global)](https://kling.ai/app/mcp/guide).

## Try these prompts

Send any of these prompts in a WorkBuddy chat. For image-to-video, attach the reference image to the same message. Generation uses credits from your connected Kling account. Available models and settings depend on that account.

| What you want to do | Prompt to send |
| --- | --- |
| Generate an image | Use Kling AI to generate one square product photo of a white coffee mug on a light wood table, with morning light coming from the left. |
| Generate a video from text | Use Kling AI to make a 5-second landscape video of a neon-lit street after rain, with a low camera slowly moving forward. |
| Animate an image | Use my attached product photo as the first frame of a 5-second Kling AI video. Slowly orbit the product. |
| Generate an HDR video | Use Kling 4.0 to generate a 5-second HDR video at 1080p. Neon lights reflect on a rain-soaked street as the camera slowly moves forward along the road. |
| Browse your subjects | Use Kling AI to list my saved Elements by name. |
| Preview motions | Use Kling AI to preview the motions saved in my motion library. |

## Find results and fix common issues

- **Generation is still running.** Check the result card in the chat. If WorkBuddy gives you a task number, ask “Use Kling AI to check task `<task number>` and show me the result.”
- **The result link expired.** Look up the original task number for a fresh link, or sign in to the same Kling account and check its generation history.
- **You are out of credits.** Recharge on the Kling site with the same account, then return to the original chat and say “Continue the previous task.” WorkBuddy checks the original task first if it was already submitted.
- **Authorization failed or you need to switch accounts.** Disconnect Kling AI in WorkBuddy and authorize again with the account for this region. If you switch regions, use the connector for that region.

## Capabilities

- [Kling Image 4.0](https://kling.ai/quickstart/kling-image-4-user-guide) supports text-to-image, reference-guided image editing, native 8K, and coherent image series. When no model is specified, prefer Kling Image 4.0 if it is available and fits the request. Resolution and per-request count depend on the live MCP capabilities for the account.
- Kling 4.0 supports text-to-video, image-to-video with first, last, and intermediate keyframes, and Omni-Ref with images, videos, audio, and Elements. It generates 3–30 seconds at 720p, with 1080p and 4K available to eligible accounts. HDR output at 1080p or 4K depends on the connected account and generation mode.
- Kling 4.0 Flash supports text-to-video, image-to-video from a single first frame, and Omni-Ref with images, videos, and Elements. It generates 3–20 seconds at 720p.
- Both Omni-Ref models support smart shot splitting and can generate synchronized audio or preserve source video audio. The two audio settings are mutually exclusive.
- Subject library (Elements): create, browse, inspect, update, delete, and reuse subjects
- Motion-library browsing and motion control from a saved motion or reference video
- Two-step local asset upload when supported by the current Global MCP and host
- Credit and task-status queries
- Generation progress tracking and result delivery

## License

[MIT](./LICENSE)
