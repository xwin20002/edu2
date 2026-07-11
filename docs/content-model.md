# edu2 多出版社內容模型

## 設計目標

以翰林版作第一套教材基準，但共用 UI、互動工具與學習能力識別碼不得綁定出版社課次。康軒、南一等版本透過 mapping 加入，不複製整套前端。

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

國語的 source-of-truth intake 位於 `data/content-intake/chinese-hanlin-114.json`。它將「公開可核對的課名／詞彙 bank」與「需要合法 text-structure brief 的課文理解層」分開；未通過 text-structure review 的 unit 不得產生或嵌入本課 NotebookLM／YouTube artifact。
