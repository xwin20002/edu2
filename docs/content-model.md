# edu2 多出版社內容模型

## 設計目標

115 學年度採「科目別出版社 baseline」：國語翰林、數學康軒、生活南一。共用 UI、互動工具與學習能力識別碼不得綁定出版社課次；日後其他版本一律透過 mapping 加入，不複製整套前端。

`data/academic-year-115.json` 是本學年空白但可驗證的 content manifest。正式目錄未經來源核對時，單元陣列必須維持空白，網站導覽也必須停在 `awaiting-catalog`。

## 三層資料

1. **Canonical topics**：跨出版社穩定的能力或概念；ID 不使用出版社課次。
2. **Publisher mappings**：出版社、學年度、科目、冊次、課／單元與 canonical topic 的對應。
3. **Publisher content**：課文、例題、活動、素材與教師提示等版本特有內容。

## 比較模式

- `common-outcome`：不同版本共有的學習重點。
- `publisher-specific`：特定版本才有的課文、例題或活動。
- `teaching-sequence`：相同主題在不同版本的出現時間與先後差異。

比較是能力與內容的對照，不假設不同出版社逐課一一相等。

## Catalog 狀態

- `foundation`：架構已建立，尚未匯入正式教材。
- `draft`：已有教材資料，仍在內容校對。
- `ready`：版本、來源與內容均完成校對，可在正式導覽中啟用。

## 上架條件

每一課／單元至少需要：出版社、學年度、年級學期、科目、正式名稱、來源紀錄、canonical topic mapping 與校對狀態。未符合條件時，首頁只能顯示「待教材目錄」，不可沿用 edu3 舊連結。

## Reference 與 renderer

版面與互動基準見 `docs/reference-baseline.md`。共用 renderer 管理穩定架構，publisher content JSON 只管理內容；國語另支援 `verticalSummary`、`vocabulary`、`characters`，避免每冊重寫直式與注音實作。

`data/content-intake/chinese-hanlin-114.json` 是 114 歷史 intake，只可作來源欄位與 workflow 的 reference，不能當成 115 教材。115 國語同樣必須將「公開可核對的課名／詞彙 bank」與「需要合法 text-structure brief 的課文理解層」分開；未通過 text-structure review 的 unit 不得產生或嵌入本課 NotebookLM／YouTube artifact。
