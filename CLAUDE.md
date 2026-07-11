# CLAUDE.md — edu2 小二上教學駕駛艙

本專案的 authoritative project instructions 位於 [AGENTS.md](AGENTS.md)。開始工作前請完整讀取並遵循該檔案。

## 專案路徑

- Repository root：`/Users/xwin20000/Dropbox/AIwork/D_AI_Family/課程學習資料/小二上學期/edu2`
- Obsidian 工作筆記：`/Users/xwin20000/Dropbox/AIwork/D_AI_Family/課程學習資料/小二上學期/edu2/工作筆記.md`
- 路徑 mapping：`/Users/xwin20000/Dropbox/AIwork/D_AI_Family/課程學習資料/小二上學期/edu2/project_vault_paths.md`
- Obsidian dashboard：`/Users/xwin20000/Library/CloudStorage/GoogleDrive-xwin20002@gmail.com/我的雲端硬碟/2ndbrain/edu2/工作筆記.md`
- GitHub repo：`https://github.com/xwin20002/edu2`
- GitHub Pages：`https://xwin20002.github.io/edu2/`
- 開發分支：`feature/grade2-semester1-foundation`

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

- **Last session**: 2026-07-11 — 翰林114小二上三科網站完成並部署。
- **Current state**: production 已上線；國語12課、數學10單元、生活6主題可用；康軒／南一 planned 且版本隔離正常。
- **Next**: 加入 NotebookLM／合法素材，或把 `WORKFLOW.md` 流程套用到 edu4。
- **Open questions**: 後續素材來源；Actions Node.js 20 deprecation annotation 待官方 action 升級時處理。
<!-- CC-SESSION-HANDOFF:END -->
