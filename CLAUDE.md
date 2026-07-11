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
- 首套教材以翰林為 baseline；康軒／南一透過 `data/catalog.json` 與 `docs/content-model.md` 的 mapping 架構加入。
- canonical topic 與共用 UI 不使用出版社課次作穩定識別碼；比較模式分成共通重點、版本特有與教授順序。
- 未達 ready 的教材不可啟用首頁 `href`，也不可導向現存 edu3 reference 頁面。
- 建置遵循 `WORKFLOW.md` 的 phase gates；教材 intake 與 mapping 使用 `data/templates/`，驗證執行 `node scripts/validate-foundation.mjs`。
- 翰林三科資料維護於 `data/hanlin-114.json`；修改後執行 `node scripts/build-subject-pages.mjs`，不要直接修改 generated subject HTML。
- Milestone A 是 `foundation.html` 的工程／資料入口；Milestone B 才是 `index.html` 與逐課教學成品。Foundation ready 不得宣告整個專案 complete。
- 正式 NotebookLM 必須使用 `xwin20002@gmail.com`；notebook ID 為 `2a2e7a75-9fde-439f-b3d4-8aa811bf4a73`。YouTube 也必須使用同一帳號所屬頻道並設為 unlisted。
- 不重新 `git init`、不重建 remote、不中斷或覆寫既有 Git history。

<!-- CC-SESSION-HANDOFF:START -->
## 📌 Session 交接區

- **Last session**: 2026-07-11 — 國語公開學習層完成，加入教育雲詞彙、翰林逐課朗讀外連、發音互動與來源 gate。
- **Current state**: production 的 28 個內頁仍可作架構／interaction reference；Milestone B 未完成。國語 12 課 title／公開詞彙 bank（365 筆）及翰林「聽 e 聽」逐課播放清單已核對；每頁提供分組詞彙、`zh-TW` 發音與 link-only 朗讀入口。L01 是直式／注音 Golden，但直式文字現在明標為原創朗讀練習，不是課文本文。舊有由課名或詞彙推測的 L02-L12 文意已移除。YouTube `oD0GIU4UKPc` 僅是全冊 overview，不得當逐課影片；逐課 text-structure、NotebookLM artifact、media 均 pending。
- **Next**: 取得 L01 合法 text-structure brief／教師核對稿，跑完一課 source → NotebookLM → QA → media ID；L02-L12 再依同一 schema 擴充。每次候選網站／YouTube 發現或下載都先更新 source registry／provenance log；Obsidian 必須同時搜尋 project dashboard 與 `創作庫/` 的 cockpit/SOP notes；再將可重用流程套用到 edu4。
- **Open questions**: L01-L12 的課文結構合法來源與人工校對；Tier C 教師／YouTube 資源的授權、版本與兒少適切性；Actions Node.js 20 deprecation annotation 待官方 action 升級時處理。
<!-- CC-SESSION-HANDOFF:END -->
