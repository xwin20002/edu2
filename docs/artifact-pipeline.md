# edu2／edu4 共用 Artifact Pipeline

這份規格把 NotebookLM 與 YouTube 視為第二階段 artifact，不把「已送出生成」當成「可上線」。兩個 repo 採同一狀態機；教材內容仍各自保存在自己的 repo。

## 固定順序

`publication-ready-human-confirmed` → `source-pack-validated` → `notebook-created` → `source-attached` → `generating` → `downloaded` → `artifact-qa-passed` → `youtube-uploaded-unlisted` → `site-integrated` → `production-verified`

任何一關失敗都停在當關，不並行啟動下一種 artifact。

## Concurrency policy

- NotebookLM 同時最多 **1** 個 generation。
- pilot 一次只處理一個 subject；不逐單元平行生成。
- 先完成並下載一份 subject slide deck，QA 通過後才可生成 subject overview video。
- YouTube 每日上傳上限由 queue 控制；本 pilot 設為 **1**，且只允許 `unlisted`。
- 若 NotebookLM 顯示 active job、rate limit、quota 或不明狀態，新的 generation 必須保持 `blocked`。

## Source 與 rights boundary

- source pack 只收入公開可核對的課程範圍、repo 內已 human-confirmed 的原創教學設計、來源 URL 與權利邊界。
- 不收入或重製課本、習作、教師手冊、出版社題目、圖像、音訊或第三方 YouTube 內容。
- 114 historical notebook 不追加 115 source；每個 target-year pilot 建立獨立 notebook。
- NotebookLM 產物仍需人工檢查：年級、版本、數學正確性、中文字形、注音、圖片、兒少適切性與版權風險。

## Queue contract

`data/artifact-queue.json` 是操作正本。每個 job 都必須具備：

- repo／subject／academic year／publisher／scope
- `dependsOn` 與目前 `status`
- source pack 路徑與 source gate
- NotebookLM notebook／artifact ID（建立後才填）
- QA 結果與本機下載路徑
- YouTube visibility、made-for-kids 與 video ID（上傳後才填）

不得以 queue 中的預定 ID 或空欄位冒稱外部產物已存在。
