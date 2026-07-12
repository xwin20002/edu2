# Content Source Gates｜資料收集安全關卡

此檔是 Phase 2 的 mandatory gate。它把「找到來源」與「可以產生教學內容」分開，避免將舊學年、片段宣傳頁或同名資源誤擴散到網站、NotebookLM 或 YouTube。

## Evidence lifecycle

| 狀態 | 最低證據 | 可以做 | 明確禁止 |
| --- | --- | --- | --- |
| `publisher-baseline-verified` | 學校版本表或同等正式公告 | 設定科目出版社、建立搜尋條件與 registry | 建立課名、單元、頁面、NotebookLM pack 或影片 |
| `official-outline-verified` | exact 學年、年級、學期、科目、出版社的 Tier A/B outline | 登錄課名／主題、順序與直接列出的子題 | 推測課文、習題、教學活動、評量或媒體 |
| `unit-brief-verified` | 單課／單元合法 source brief 加人工／教師 review | 建立該 unit 的原創教學任務與 subject Golden candidate | 批次擴散到其餘單元，或以詞彙／標題補足文意 |
| `publication-ready` | outline + unit brief + 權利檢查 + 內容 QA | 開啟該 unit 的正式導覽與發布頁 | 重製課文、習題、教師手冊、出版社音檔／圖像 |
| `artifact-ready` | publication-ready + verified NotebookLM source pack + artifact QA | 產製／回填該 unit 的 NotebookLM 與 YouTube artifact | 使用全冊 overview 或他人影片冒充逐課媒體 |

## Mandatory checks before each promotion

1. **Exact match**：核對 `academicYear + grade + semester + subject + publisher`；同名、同出版社或相鄰學年都不構成 match。
2. **內文年度核對**：檔名、URL、搜尋摘要或上傳日期含有「115」仍不足；必須視覺或文字核對封面／課程頁的內文年度。URL 標 115、PDF 內文標 114 的候選必須記為 rejection，不能抽取任何內容。
3. **Provenance**：原檔放 `source/`、SHA-256 與 URL／日期／權利／review 寫入 `data/source-acquisition-log.json`；沒有 log 即不可使用。
4. **Scope**：只抽取來源明確支持的 metadata。宣傳頁可以證明列出的主題，不能補全未列的內容。
5. **Copyright**：公開 PDF、電子書、朗讀、Wordwall 與教師手冊均不等於可重製授權；只保留必要 metadata 或 link-only。
6. **Subject Golden**：國語、數學、生活各自過 Golden；不可用國語注音／直式的完成度替代數學或生活的內容品質。
7. **Artifact boundary**：NotebookLM／YouTube 是資料處理 Phase 3，不是用來補缺失資料。source brief 不足時，artifact status 必須保持 `pending`。

## Current 115 application

- 國語／翰林：`official-outline-verified`；已保存 4 主題、12 課課名與文體 metadata，仍等待 L01 合法 text-structure brief，故不可開啟頁面或建立 artifacts。
- 數學／康軒：`publisher-baseline-verified`；115 官方介紹只提供片段示例，等待 exact outline。
- 生活／南一：`official-outline-verified`；可保存 6 主題／16 子題 metadata，仍等待 T01 unit brief，故不可開啟頁面或建立 artifacts。

Every session must record the subject's current gate in `工作筆記.md`; a workflow status such as “資料已找到” is invalid without the lifecycle status and source ID.
