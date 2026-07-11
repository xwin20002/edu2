# 多出版社教學駕駛艙建置流程

本流程以 `edu2` 為首個 reference implementation，可重用於 `edu4` 或其他年級。年級、學期、科目與出版社是資料，不應散落成寫死的前端邏輯。

## 核心原則

1. 先建立 publisher-neutral foundation，再匯入教材。
2. 翰林可作首套 baseline，但不是 canonical model。
3. 未校對的教材不得出現在正式導覽。
4. 不以出版社課次作跨版本穩定 ID。
5. 一課／一單元 pilot 通過 QA 後才批次擴充。
6. 所有產製與驗證步驟必須保存在 repo，不依賴 `/tmp` 腳本。

## Phase 0 — 接管既有專案

### 輸入

- 已存在的 Git repo、branch、remote 與 Git history。
- 可作 UI reference 的既有教學駕駛艙。

### 動作

- 不執行 `git init`，不重建 repo，不 force push。
- 補齊 `AGENTS.md`、`CLAUDE.md`、`README.md`、`.gitignore`、`工作筆記.md`。
- 建立 `project_vault_paths.md`，明確區分 CC handoff 正本與 Obsidian dashboard。

### Exit gate

- 文件路徑一致。
- `origin`、reference remote、branch 已記錄。
- `git diff --check` 通過。

## Phase 1 — Publisher-aware foundation

### 動作

- 建立 `data/catalog.json`。
- 預設出版社設為 baseline；其他出版社先標 `planned`。
- 建立 publisher selector 與 comparison mode。
- 正式首頁移除所有舊年級教材連結。

### Exit gate

- Catalog JSON 可解析。
- 預設出版社存在且 enabled。
- 尚未校對的 subject `href` 必須是 `null`。
- 首頁不存在舊年級名稱或舊教材入口。

## Phase 2 — 教材 intake

每批教材先填 `data/intake/<publisher>-<subject>.json`，格式參考 `data/templates/intake.template.json`。

最低欄位：

- 學年度、出版社、年級、學期、科目。
- 正式課／單元名稱與順序。
- 來源類型與本機／雲端識別資訊。
- 校對人與校對狀態。
- 是否允許發布衍生素材。

### Exit gate

- 來源可追溯。
- 課名與順序已對照正式目錄。
- 未知欄位保留 `null`，不得推測填寫。

## Phase 3 — Canonical mapping

- 為學習能力建立穩定 canonical topic。
- 使用 `data/templates/publisher-mapping.template.json` 對應出版社單元。
- 標記 `common-outcome`、`publisher-specific`、`teaching-sequence`。
- 不強迫不同版本逐課一對一。

### Exit gate

- 每個 mapping 都有來源單元與至少一個 canonical topic。
- 版本特有內容不寫進共通 topic。
- 課次變動不會改變 canonical ID。

## Phase 4 — Golden template

選一課／一單元完成：

- 課程導覽、教學重點、教材素材與教師提示。
- 國語：注音、直式課文、朗讀。
- 數學：公式、操作、例題與形成性評量。
- 生活／自然：觀察、實作、安全提示與表達活動。
- 字級、計時器、畫筆、遮罩等共用工具。

### Exit gate

- Desktop、tablet、mobile 與投影版可用。
- Keyboard、touch、reduced motion 與基本 accessibility 通過。
- 無 console error、broken link、missing asset。
- 教材內容經人工校對。

## Phase 5 — 批次產製

- 只從已校對資料產製其他課／單元。
- 產生器放在 `scripts/`。
- 每批變更先跑 `npm` 無關的輕量驗證：`node scripts/validate-foundation.mjs`。
- 批次完成後抽查內容與跨裝置 rendering。

## Phase 6 — Review 與部署

1. Feature branch 完成驗證。
2. 更新 repo `工作筆記.md` 與重大狀態的 Obsidian dashboard。
3. Commit message 說明完成內容與驗證依據。
4. Review 後合併 `main`。
5. GitHub Actions 部署 GitHub Pages。
6. Production URL 做 smoke test。

## edu4 套用方式

複製流程與 schema，不複製 edu2 教材資料：

- 保留 `WORKFLOW.md`、`docs/content-model.md`、`scripts/validate-foundation.mjs` 與 `data/templates/`。
- 修改 project ID、年級、學期、subjects 與 repo URLs。
- 重新建立該年級的 intake、canonical topics、publisher mappings。
- 舊 `edu3` 頁面仍只能作 UI reference。

## 每次 session

- `cc開案`：讀 `project_vault_paths.md` 與 repo `工作筆記.md`；status/fetch，不 pull。
- 開發中：完成一個 phase gate 才進下一階段。
- `cc關案`：更新 handoff、重大 dashboard 狀態、驗證、commit、push。
