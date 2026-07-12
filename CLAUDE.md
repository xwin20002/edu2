# CLAUDE.md — edu2 小二上教學駕駛艙

本專案的 authoritative project instructions 位於 [AGENTS.md](AGENTS.md)。開始工作前請完整讀取並遵循該檔案。

## 專案路徑

- Repository root：`/Users/xwin20000/Dropbox/AIwork/D_AI_Family/課程學習資料/小二上學期/edu2`
- Obsidian 工作筆記：`/Users/xwin20000/Dropbox/AIwork/D_AI_Family/課程學習資料/小二上學期/edu2/工作筆記.md`
- 路徑 mapping：`/Users/xwin20000/Dropbox/AIwork/D_AI_Family/課程學習資料/小二上學期/edu2/project_vault_paths.md`
- Obsidian dashboard：`/Users/xwin20000/Library/CloudStorage/GoogleDrive-xwin20002@gmail.com/我的雲端硬碟/2ndbrain/edu2/工作筆記.md`
- GitHub repo：`https://github.com/xwin20002/edu2`
- GitHub Pages：`https://xwin20002.github.io/edu2/`
- 目前分支：`main`

## 工作規則

- 現有 `edu3 小三下` HTML 與 assets 僅供版型參考，不是小二上正式教材。
- 教材版本、科目及課次未確認前，不得自行推定或發布內容。
- 產生器與驗證腳本應保存在 repo 的 `scripts/`，不可只留在 `/tmp`。
- 維持繁體中文介面，技術詞彙可搭配專業英文。
- `cc開案` 先讀 `project_vault_paths.md`，再讀 repo root 的 `工作筆記.md`；只做 status/fetch，不自動 pull。
- `cc關案` 更新 repo handoff 正本；重大狀態變更再同步外部 Obsidian dashboard，之後 commit/push 本次變更。
- 外部 dashboard 是跨專案入口，不是 CC handoff source of truth。
- 115 校訂組合為國語翰林、數學康軒、生活南一；其正式目錄分別重新蒐集，不能以單一出版社資料填入三科。
- canonical topic 與共用 UI 不使用出版社課次作穩定識別碼；比較模式分成共通重點、版本特有與教授順序。
- 未達 ready 的教材不可啟用首頁 `href`，也不可導向現存 edu3 reference 頁面。
- 建置遵循 `WORKFLOW.md` 的 phase gates；教材 intake 與 mapping 使用 `data/templates/`，驗證執行 `node scripts/validate-foundation.mjs`。
- `data/hanlin-114.json` 與既有 artifacts 是 114 historical reference。115 source-of-truth 是 `data/academic-year-115.json`；其 unit arrays 在 official outline 核對前必須維持空白，且不得執行 legacy `scripts/build-subject-pages.mjs` 產生 115 頁面。
- Milestone A 是 `foundation.html` 的工程／資料入口；Milestone B 才是 `index.html` 與逐課教學成品。Foundation ready 不得宣告整個專案 complete。
- 正式 NotebookLM 必須使用 `xwin20002@gmail.com`；notebook ID 為 `2a2e7a75-9fde-439f-b3d4-8aa811bf4a73`。YouTube 也必須使用同一帳號所屬頻道並設為 unlisted。
- 不重新 `git init`、不重建 remote、不中斷或覆寫既有 Git history。

<!-- CC-SESSION-HANDOFF:START -->
## 📌 Session 交接區

- **Last session**: 2026-07-12 — 115 publisher baseline migration in progress.
- **Current state**: 桃子腳 115 公開版本表確認小二國語翰林、數學康軒、生活南一。首頁與 catalog 已停用三科 115 導覽；`data/academic-year-115.json` 只含空的待核對 manifest。114 翰林 outlines、28 個內頁、NotebookLM overview 與 YouTube `oD0GIU4UKPc` 全部是 historical reference，不得改名為 115；既有 L01 仍只作直式／注音 renderer Golden。
- **Next**: 各科先取得 115 official outline；國語再做 L01 合法 brief → NotebookLM → QA → media ID vertical slice，數學／生活分別做 U01／T01 subject Golden。每次發現或下載先記錄 source registry／provenance log。
- **Open questions**: 三科 115 official outline 與逐課合法來源；Tier C 資源的授權、版本與兒少適切性；Actions Node.js 20 deprecation annotation。
<!-- CC-SESSION-HANDOFF:END -->
