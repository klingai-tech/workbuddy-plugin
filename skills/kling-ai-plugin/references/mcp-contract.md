# 生成请求结构

仅在构造生成工具的外层 payload 时读取。能力发现、选型与模块加载见[能力发现](capability-discovery.md)和[参数规则](model-parameters.md)；素材管理按自身工具 schema，查询与 UI 按任务结果流程执行。

- 外层请求结构与值的编码以当前工具 `inputSchema` 为准，模型能力以 `who_am_i` 为准。生成工具通常使用 `model`、`arguments[]`、`inputs[]`、`rationale`、`taskTraceId`；不按示例补未声明字段。
- 提交时始终显式填顶层 `model`，逐字使用当前账号在所选入口返回的规范 ID。旧工具 Schema 的 `required` 可能漏掉 `model`，服务端仍会校验。用户未指定时按 Skill 规则选定兼容模型再填入；缺失、`null`、空字符串、纯空白或仅把型号写进提示词都无法满足校验。
- `arguments[]` 为 `{name, value}`；当前工具要求所有 `value` 为字符串，包括数字、布尔值和 JSON 数组。逐项补齐所选模型要求的参数，每个参数名只出现一次。要求 `prompt` 时，填入按用户意图构建的有效提示词；仅在当前模式明确允许空提示词且符合用户意图时使用空字符串。分辨率按当前模型声明的参数名、枚举和适用条件填写。
- `inputs[]` 为 `{name, inputType, url}`，按实时工具 schema 填写 `inputType`。逐项填入所选模型在本模式下要求的素材槽位，例如声明必填的 `image_1`。素材 URL 与文字描述分别提交；没有素材输入且模型允许时省略 `inputs`。上传成功后的 URL 按[素材上传规则](asset-workflows.md#本地素材上传)传递。
- `rationale` 简述用户目标与选参理由，不代替用户提示词。提示词不用于绕过字段或枚举限制。
- 同一目标复用 UUIDv7 `taskTraceId`，无关目标才创建新值。它仅用于追踪，不是幂等键；不能据此自动重放收费请求。
- 工具输入结构与 `who_am_i` 所选模型的参数、条件约束同时成立。工具泛化描述或其他型号示例不覆盖当前模型的能力；结构冲突按能力发现流程刷新，仍不一致时停止。
- Element 支持及图片/视频主体类型以 `who_am_i` 中目标入口、所选模型的声明和条件限制为准，不能只看是否列有 `elements`，也不用工具描述或历史举例覆盖账号能力。

以下是结构示例。仅当所选模型声明 `duration`、`aspect_ratio` 且支持这些值时才使用。将占位模型 ID 换成当前响应的实际值；需要素材时同时填入模型要求的 `inputs[]` 槽位。

```json
{
  "model": "<who_am_i 返回的模型 ID>",
  "arguments": [
    {"name": "prompt", "value": "视频创意描述"},
    {"name": "duration", "value": "7"},
    {"name": "aspect_ratio", "value": "9:16"}
  ]
}
```

提交前逐项将用户的显式要求与实际传入的值、素材槽位或模型固定设置核对。结果摘要按实际提交的设置填写。

提交返回 `generationId` 只表示创建/受理，后续按[任务结果](task-results.md)处理；不因返回 `creditsConsumed` 就声称生成完成。
