# 國語 L02–L12 fallback 長批次 QA（2026-08-12）

## 結論

- 本批建立 L02–L06、L08–L12 共 10 課的 fallback unit brief 與教學頁；technical QA 與使用者 human parity 均已通過，狀態升為 fallback publication-ready human-confirmed。
- L01 保留既有 human confirmed Golden。
- L07 不建立 brief、不提供課程地圖連結：115 官方課名是〈不一樣的故事〉，114 公開課程計畫與詞庫是〈不一樣的美食〉，不得跨課套用。
- NotebookLM／YouTube 仍是第二階段 artifact pipeline，本批不混用 114 全冊簡報充當逐課教材。

## Source contract

1. hanlin-115-low-primary-promo：115 官方 outline，只核對課名、作者、文體與順序。
2. ptc-114-hanlin-grade2-chinese-plan：114 公開課程計畫；使用者接受 113–115 資料窗，只取同名課次的教學訊號。
3. education-cloud-hanlin-114-wordbank：114 公開詞彙層；用於來源詞彙與人工注音練習卡的逐字 provenance check。
4. 所有閱讀短文、理解題、語文互動與教學提示均由 edu2 原創；不是翰林課文、摘要、習作或 115 官方內容。

## Batch contract

每一課必須具備：

- 4 段獨立原創閱讀（L03 為公共領域童話基礎的 edu2 原創改寫）。
- 3 題閱讀理解，且每題恰有一個正確答案。
- 3–4 個動態句型欄位，renderer 與 shared JS 不綁死 L01 的三欄名稱。
- 6 張人工核對注音練習字卡，且字來自 114 公開詞庫。
- 學習目標、teacher notes、來源狀態、版權邊界與第二階段 artifact pending 標示。

## Human parity result

2026-08-12 使用者由國語課程地圖完成本批 human parity，回覆 OK。抽查契約如下：

- L07 顯示「來源待補，不開放」，沒有進入連結。
- 原創短文、理解題、注音與 3–4 欄句型活動可讀、可操作。
- 任一 select 變更後，完整句會依該課 template 更新。
- 教師模式、字級、計時器、畫筆與語音朗讀維持可用。

L02–L06、L08–L12 已可 promotion；L07 仍維持 blocked。這項確認不會把 fallback 內容變成翰林 115 官方課文，也不會提前完成 NotebookLM／YouTube artifact gate。
