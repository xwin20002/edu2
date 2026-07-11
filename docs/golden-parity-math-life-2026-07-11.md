# Math / Life Golden Parity Checklists — 2026-07-11

> **Purpose**：將 Global shell 與 subject-grade Golden 分開驗收。此文件是 diagnostic quality gate，並不表示 U01／T01 已達成 Golden。
>
> **References**：edu2 `math/U01`、`life/T01`；edu3 `math/U1`、`science/U1` 的資訊架構與互動層；shared `edu-teaching-cockpit` skill。Reference 只供 reuse architecture，絕不取用小三教材內容。

## Review Result

| Golden | Profile | Status | Reason |
|---|---|---|---|
| `math/U01` | `math-lower-primary` | `blocked` | 有任務、流程、評量與工具列；但沒有可操作表徵、分步推理與可判定的單元作答。 |
| `life/T01` | `life-lower-primary` | `blocked` | 有動物需求任務與共用互動；但沒有觀察證據、非侵擾安全、紀錄表與主題特有反思。 |

`blocked` 的意思是「禁止將目前 generic renderer 推廣到該科全冊」，不是要求刪除既有頁面；現有完成的 shell、輪播、字級、計時與畫筆功能應保留。

## Shared Shell — evidence only

- [x] 清楚的課程地圖返回路徑、標題、年級／版本 badge 與學生／教師模式入口。
- [x] 13 頁 NotebookLM 全冊簡報輪播、形成性評量、全冊影片與課堂工具列。
- [x] 小二可讀的焦點、任務、自我檢核與離堂小卡。
- [ ] 教師模式的 browser interaction 需在實體瀏覽器人工再確認；自動頁面檢查確認按鈕與 renderer code 存在，但本次 automation 未能觀察到 mode state 改變，不能把它列為已通過證據。

## `math-lower-primary` — U01（200以內的數）

### Required parity contract

| Gate | Required evidence | Current result | Promotion condition |
|---|---|---|---|
| 年段適切表徵 | 至少一種可見、可操作的百／十／一表徵；學生可將數量連到位值。 | `partial`：任務文字提到百格、十條、單位積木，頁面沒有表徵元件。 | 加入 renderer-neutral `representations` data 與可操作或可標記的視覺元件。 |
| 分步推理 | 讀數量 → 組成百十個 → 寫數／比較 → 用一句話說明。 | `partial`：通用流程有「操作或畫圖／列式」，未描述 U01 的位值步驟。 | 將 unit-specific `reasoningSteps` 寫入資料並顯示。 |
| 方法比較與迷思 | 至少比較兩種表徵或辨識一個位值迷思，不以速度作唯一成功指標。 | `blocked`：目前迷思為跨數學通用文案。 | 提供每單元 `misconceptions` 與教師追問。 |
| 形成性評量 | 有能判定「位值理解」的作答或觀察規準，而非只選出焦點句。 | `blocked`：兩題皆為通用 focus／學習態度選擇題。 | 加入作答欄、接受答案規則或教師觀察 checklist。 |
| 可近用與課堂控制 | 學生／教師模式、鍵盤、字級、計時、畫筆、reduced motion 均可用。 | `partial`：共用實作存在；教師模式須人工驗證。 | 桌機／平板／手機三種 viewport 的互動 QA 紀錄。 |

### Smallest implementation slice

1. 在資料模型新增 `mathExtension`：`representations`、`reasoningSteps`、`misconceptions`、`formativeChecks`。
2. 只為 U01 實作百／十／一 representation card 與「說明為什麼」評量；不得拿 edu3 題目改數字。
3. 重建 U01，跑 validator，人工確認 student／teacher mode、答題回饋、平板與手機。
4. 全部 gate 有 evidence 後，才將數學 renderer 擴散至 U02–U10。

## `life-lower-primary` — T01（動物好朋友）

### Required parity contract

| Gate | Required evidence | Current result | Promotion condition |
|---|---|---|---|
| 觀察證據 | 能記錄可見特徵、行為或環境線索；觀察與猜測明確分開。 | `blocked`：任務僅列出食物、環境、照顧方式，沒有 observation record。 | 加入 `observationPrompts` 與原創 observation record。 |
| 問題與探究 | 對應主題的可觀察問題、比較與基於證據的回答。 | `partial`：通用流程有「提出問題／探究」，但 T01 沒有可填寫問題與比較規準。 | 提供 subject-specific `inquiryFlow`，不強制把所有生活主題套成單變因實驗。 |
| 生命關懷與安全 | 非侵擾觀察、不餵食／不捕捉陌生動物、清潔與成人協助等可見提醒。 | `blocked`：無安全／動物福祉 guardrail。 | 加入 `safetyNotes`，並由教師依場域校對。 |
| 紀錄與反思 | 以圖、符號或一句話保留發現，說明下一個想查證的問題。 | `blocked`：離堂小卡為通用句型，沒有 T01 的 evidence reflection。 | 加入 `reflectionPrompt` 與教師檢核規準。 |
| 形成性評量 | 能判定學生是否根據觀察提出合宜照顧／關懷行動。 | `blocked`：目前題目只選出主題焦點與一般學習態度。 | 加入 scenario-based check 或教師 observation checklist。 |
| 可近用與課堂控制 | 學生／教師模式、鍵盤、字級、計時、畫筆、reduced motion 均可用。 | `partial`：共用實作存在；教師模式須人工驗證。 | 桌機／平板／手機三種 viewport 的互動 QA 紀錄。 |

### Smallest implementation slice

1. 在資料模型新增 `lifeExtension`：`observationPrompts`、`inquiryFlow`、`safetyNotes`、`reflectionPrompt`、`formativeChecks`。
2. 只為 T01 實作「可見線索 → 需要推論 → 合宜關懷行動」的原創 observation card；不重製課本圖片、活動單或題目。
3. 重建 T01，跑 validator，人工確認學生能以圖／符號／一句話完成紀錄。
4. 全部 gate 有 evidence 後，才將生活 renderer 擴散至 T02–T06。

## Evidence required to promote

Promotion 必須同時附上：資料 source status、renderer commit、validator result、desktop/tablet/mobile visual QA、student/teacher interaction QA、每科 reference parity 人工確認。若任何一項未完成，status 保持 `blocked`，不得說「全冊已由 Golden 驗證」。
