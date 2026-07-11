# 國語內容供應鏈修正 — 2026-07-11

## Why the former result was unreliable

原有國語 12 課只有課名、一句 focus、一句任務；NotebookLM source 也只有相同骨架。因此全冊影片被誤放到逐課頁面，卻沒有逐課 source、內容 brief、artifact 或 QA。這是 **content pipeline 缺失**，不是 CSS 或 carousel 問題。

## Current execution contract

| Field | Status | Evidence |
|---|---|---|
| `currentPhase` | `2 — Recollect Target Data` | 已完成公開來源 intake；尚未取得可核對的逐課 text-structure brief。 |
| `firstDivergence` | outline 被當成 lesson content | 原資料只有一行原創 focus／mission，卻被當作完整頁內容。 |
| `preserve` | 國語直式、手工 flex 注音、發音、雙模式與工具列 | 這些是 renderer contract，不是教材內容。 |
| `replace` | generic source、全冊影片冒充逐課影片、未核對的生字／注音 | 改為 source intake、unit pack、artifact ledger 與 unit gate。 |
| `nextSmallestTest` | L01 text-structure brief + unit NotebookLM artifact | 先只完成一課的端到端資料與 QA。 |

## Source intake completed

- 教育雲 114 翰林二上國語：12 課 title 全數核對，逐課詞彙頁已下載到受控 `source/`，並萃取 **365 筆**公開生字／認讀字／語詞。
- 公開學校 114 課程計畫：已轉換為 Markdown，核對學期、版本、課次順序與通用識字／閱讀理解／句型／口語表達方向。
- 產出：`data/content-intake/chinese-hanlin-114.json`、`sources/notebooklm/chinese/L01–L12-*.md`。
- 來源探索與下載足跡：`data/source-registry/chinese-lower-primary-114.json`、`data/source-acquisition-log.json`；規格見 `docs/source-acquisition.md`。Tier C 的教師網站／YouTube 候選只作發現與活動靈感，未核對授權不得下載、嵌入或當教材事實。

這些資料足以支援詞彙、字卡、注音校對與來源連結；**不等於課文全文、故事事件、人物關係或習題**。

## Per-lesson gate

| Data layer | Requirement | Current status |
|---|---|---|
| 課名與課次 | 114 翰林公開來源可追溯 | 12/12 verified |
| 詞彙 bank | 教育雲逐課來源＋本機 source snapshot | 12/12 verified |
| 注音與字卡 | 從 official word bank 選取並逐字查核 | L01 verified slice；L02–L12 pending |
| 課文結構 brief | 合法課本摘要或教師核對稿；事件、理解問題與句型皆可追溯 | 0/12 pending |
| 原創教學層 | 依 brief 重寫 focus、任務、Bloom、評量與離堂卡 | L01 provisional; L02–L12 pending |
| NotebookLM artifact | 使用該課 source pack 產製、下載、QA、回填 manifest | 0/12 pending |
| YouTube | 僅在有該課 artifact 且 QA 通過後上傳並回填 media ID | 0/12 pending |

## Publishing rules now in force

1. 全冊導覽影片 `oD0GIU4UKPc` 只能標為 overview，不能再嵌入或命名為某一課的學生自學影片。
2. 逐課頁面可呈現教育雲公開詞彙入口；課文結構未核對前，頁面必須說明其狀態。
3. 不可從課名、詞彙表、舊年級 repo 或 NotebookLM 生成文字推論課文情節。
4. 每課要有 source pack、source review、artifact QA、production check 四項 evidence，才可解除「本課媒體尚未產製」。

## What is still needed

下一步需要每課的合法 text-structure brief。可接受來源為：使用者提供的合法課本／教師授權摘要、出版社明確允許的公開教材，或教師依合法課本撰寫並核對的摘要。拿到後先只處理 L01，再由同一個 schema 擴展至 L02–L12。
