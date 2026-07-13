# 多出版社教學駕駛艙建置流程

共用 Codex／Claude skill：<https://github.com/xwin20002/Claude_code_mdskill/tree/main/skills/edu-teaching-cockpit>

本流程以 `edu2` 為首個 reference implementation，可重用於 `edu4` 或其他年級。年級、學期、科目與出版社是資料，不應散落成寫死的前端邏輯。

## 兩個 Milestones

### Milestone A - Foundation

工程與資料供應鏈的基礎：repo 接管、專案文件、publisher-neutral schema、教材 intake、mapping templates、建置腳本、validator、版本隔離與部署骨架。

- 對應頁面：`foundation.html`
- 主要使用者：建置者、維護者、AI agents。
- 可以作為工作流程說明頁與資料入口。
- **Foundation ready 不等於專案 complete。**

### Milestone B - Complete Teaching Cockpit

一般教師、學生與家長實際使用的成果：完整教材脈絡、NotebookLM artifacts、YouTube 自學影片、逐課／逐單元教學內容、互動活動、教師提示、課堂工具與 production QA。

- 對應頁面：`index.html`、各科首頁與逐課／逐單元頁。
- 主要使用者：教師、學生、家長。
- 公開導覽不顯示工程 placeholder、資料表單或未完成版本。
- 只有 Milestone B 全部 exit gates 通過，才可標記專案 complete。

## 核心原則

1. 先建立 publisher-neutral foundation，再匯入教材。
2. 翰林可作首套 baseline，但不是 canonical model。
3. 未校對的教材不得出現在正式導覽。
4. 不以出版社課次作跨版本穩定 ID。
5. 一課／一單元 pilot 通過 QA 後才批次擴充。
6. 所有產製與驗證步驟必須保存在 repo，不依賴 `/tmp` 腳本。

## 六階段交付模型

這六階段不可混為同一個「建站」任務。每一階段都有獨立輸入、輸出與 exit gate；前一階段未通過，不得宣告下一階段或整體完成。

1. **架構起始**：從 edu1／edu3 GitHub repo copy 已驗證的工程架構，包括資訊層級、共用元件、CSS、JS、generator、validator 與部署方式。只搬架構，不搬其他年級教材內容。
2. **重新蒐集資料**：依目標年級、學期與出版社重新尋找正式或合法公開來源；課名、順序、學習目標、生字、注音及發布權限都要重新核對。
3. **資料處理**：製作 source pack，使用指定帳號產出 NotebookLM 簡報、圖卡、字卡、測驗與影片；影片下載後由既有 CLI uploader 上傳 YouTube，並更新 artifact manifest。
4. **資料換入架構**：將已核對資料填入 content schema，由 renderer／generator 批次建置各課；不得逐頁複製 HTML 或把教材寫死在共用元件。
5. **技術驗證**：執行 validator、broken links、assets、responsive、雙模式、直式、注音、發音、評量、影片及 production smoke tests。
6. **品質確認與舊版對比**：與 edu1／edu3 reference 做 quality parity comparison；資訊完整度、視覺層級、互動與課堂可用性必須達到一致水準，並留下差異紀錄與人工確認。

### 完成定義

- 架構完成不等於資料完成。
- NotebookLM／YouTube 完成不等於資料已換入網站。
- 技術驗證通過不等於品質達到舊版水準。
- 只有第 6 階段通過，才可執行 `cc關案` 或宣告 Milestone B complete。

## Golden Sample Promotion Model

Golden Sample 是批次變更前的 executable quality baseline，registry 位於 `data/golden-samples.json`。

Golden 的識別單位不是「所有科目共用一頁」，而是 **科目 × 年段 × 教材能力需求**。共用 shell 可以相同，但 subject renderer 與 presentation profile 必須分開。

- **Global reference**：edu1 L8，定義資訊架構、雙模式、課堂工具與 responsive 水準。
- **國語 Golden**：`chinese/L01/index.html`，定義直式導讀、詞彙、生字、注音、聲調與發音。
- **數學 Golden**：`math/U01/index.html`，定義概念表徵、解題流程與形成性評量。
- **生活 Golden**：`life/T01/index.html`，定義觀察、探究、紀錄、反思與實作流程。

### 年段 profile

- `chinese-lower-primary`（小一／小二）：`zhuyinPolicy=dense`。生字、注音、聲調定位與點讀是核心功能。
- `chinese-middle-primary`（小三／小四）：`zhuyinPolicy=selective`。只為生字、難詞與易誤讀字提供注音，不直接沿用低年段密集注音。
- `math-lower-primary`：以操作、圖像表徵、算式與方法說明為核心；不繼承國語直式／注音 contract。
- `life-lower-primary`：以觀察、提問、探究、紀錄與反思為核心；不繼承國語直式／注音 contract。

### 變更擴散規則

1. 共用 CSS／JS／頁面 shell 變更：三科 Golden 全部通過後，才重建 28 頁。
2. 科目 renderer 變更：該科 Golden 通過後，才重建該科全部單元。
3. 單元內容變更：只驗證該單元，但不得破壞 Golden schema。
4. Golden QA 包含 validator、visual QA、互動測試與 edu1／edu3 parity comparison。
5. Golden 未通過時不得以「其他頁會一起正常」作推論。
6. 跨年段專案只能沿用共用 shell；必須建立自己的 subject-grade Golden，不得把小二國語 Golden 當成小四國語完成標準。

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

在開始任何 intake 前，先讀 [Content Source Gates](docs/content-source-gates.md)。資料狀態必須明確使用 `publisher-baseline-verified`、`official-outline-verified`、`unit-brief-verified`、`publication-ready`、`artifact-ready` 其中之一；不可用「找到資料」「看過網站」或「有簡報」替代 gate。

開始下載前，先查 `data/source-registry/` 與 `data/rawdata-index.json`；每個下載、轉檔或未下載候選都要記入 `data/source-acquisition-log.json`，規格見 `docs/source-acquisition.md` 與 `docs/rawdata-taxonomy.md`。原始檔仍放 ignored `source/RAWdata/`，但 provenance log 必須納入 Git。**檔名、URL 或搜尋摘要有「115」不構成年份核對：必須核對 PDF／文件內文的年度與版本；不一致即記 rejection，不抽取任何內容。** 若使用者接受 114 fallback，可建立明確標示為 `114-fallback / 115-candidate` 的原創教學層；不得標為 115 official，不得重製課文或批次擴散。YouTube／教師網站預設是 Tier C 候選：先查版本、授權與教師 review，不能直接當課文事實或 NotebookLM source。

Obsidian preflight 不只讀 `edu2/工作筆記.md`：還要以 `駕駛艙`、科目、出版社與 `NotebookLM` 搜尋 vault 的 `創作庫/`。可重用的是來源分層、下載紀錄與 artifact SOP；其他年級的教材內容仍是 `forbidden-content`。

最低欄位：

- 學年度、出版社、年級、學期、科目。
- 正式課／單元名稱與順序。
- 來源類型與本機／雲端識別資訊。
- 校對人與校對狀態。
- 是否允許發布衍生素材。

### 115 資料升級規則（不得跳關）

1. **Publisher baseline** 只能決定搜尋條件，不能產生課名／單元／頁面。
2. **Official outline** 只允許填入來源明列的名稱、順序與子題；不允許從宣傳頁、舊學年、詞彙 bank 或同名資料推測內容。
3. **Unit brief** 必須有合法來源與人工／教師 review，才可開始該科的 Golden candidate。
4. **Publication-ready** 才可啟用 `href`；每個公開頁的內容須是原創摘要／活動或已授權內容。
5. **Artifact-ready** 才可進 NotebookLM／YouTube。全冊 overview、未核對的創作者影片、出版社 audio 都不可當作逐課 artifact。
6. 每一次提升狀態時，都要更新 source registry、provenance log、`工作筆記.md` 與相應 validator；任何一項缺失即停在原關卡。

### Exit gate

- 來源可追溯。
- 每個本機檔案可由 provenance log 找回 URL、日期、hash、權利狀態與 review 結論。
- 課名與順序已對照正式目錄。
- 未知欄位保留 `null`，不得推測填寫。
- 在 `official-outline-verified` 以前，不得執行 renderer／generator；在 `artifact-ready` 以前，不得建立 NotebookLM source pack 或請求／上傳影片。

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

版面、互動與國語直式／注音的穩定規格，以 `docs/reference-baseline.md` 為準；單元內容格式使用 `data/templates/unit-content.template.json`。

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

## Milestone B 完整產製鏈

1. 取得合法教材、備課資料與可追溯 sources。
2. 建立 NotebookLM notebook 並匯入 sources。
3. 產出授課簡報、生字卡／故事地圖、資訊圖表與學生自學影片。
4. 下載 artifacts，依命名規則整理、轉檔與壓縮。
5. 將影片上傳指定 YouTube channel，預設 `unlisted`，記錄 video ID。
6. 建立逐課／逐單元頁，嵌入 artifacts 與 YouTube。
7. 加入教師提示、Bloom 分層、形成性評量與課堂工具。
8. 驗證桌機、平板、手機、投影、音訊、互動、素材與 console。
9. 部署 GitHub Pages 並做 production smoke test。

NotebookLM source pack 由 `node scripts/build-notebooklm-sources.mjs` 產生，狀態正本為 `data/artifact-manifest.json`。來源 Markdown 可提交 Git；原始付費教材仍放在被忽略的 `source/`。

### NotebookLM／YouTube 執行踩坑與驗證方法

2026-07-13 用 edu1 小一數學 U4（已有合法資料、只缺影片收尾的既有單元）完整跑過一次 Milestone B 產製鏈的後半段（步驟 5–9），驗證並記錄以下操作級檢查點，供 115 三科正式跑 pipeline 時直接套用：

1. **素材已下載 ≠ 已嵌入頁面**：NotebookLM 簡報／影片／圖表下載到本機 `assets/` 之後，必須實際打開至少一個單元 HTML（或用 grep／DOM 查詢確認素材路徑或 YouTube embed src 真的出現在頁面）才能回報「素材已整合」；只確認檔案存在會漏掉「下載完但沒接進 HTML」的情況。
2. **`git push` 完成 ≠ 使用者立刻看得到**：GitHub Pages 與瀏覽器都會快取舊版本，push 後直接開瀏覽器可能還顯示舊內容，容易誤判部署失敗。驗證要用 `curl` 直接打 production URL，或在頁面內 `fetch(location.href,{cache:'no-store'})`，或導覽時加 cache-busting query string，不能只看一次瀏覽器畫面就下結論。
3. **終端機中文亂碼 ≠ 資料損毀**：`youtube-upload` skill 呼叫的 Python 腳本在 Windows PowerShell 下 print 中文會變亂碼（主控台編碼問題），但實際送進 API 的字串不受影響；不要因為終端機顯示亂碼就懷疑標題／描述上傳錯誤，要查 YouTube Studio 或 API 回傳值才準。
4. **CLAUDE.md／交接筆記可能與實際檔案狀態脫節**：曾發生交接筆記寫「無 NotebookLM 資產」，但實際檔案早已產出並部署上線。任何要接續 NotebookLM／YouTube 相關任務，先用 grep／ls 核對實際檔案與已部署內容，不要只信交接文字；發現落差要同步更正交接筆記。
5. **NotebookLM 影片狀態卡在 `unknown`**：改到 NotebookLM 網頁手動下載，不要一直輪詢 API 等待狀態變化。
6. **YouTube 上傳配額（約每帳號每日 5–6 支）**：批次上傳多支影片時會中途卡住，未上傳的單元先在頁面留明確占位文字（含預計恢復日期），配額重置後直接補上傳，不必重新產生 NotebookLM 內容。

### Milestone B exit gate

- 每個正式課／單元都有完整頁面，不只是目錄卡片。
- NotebookLM artifact manifest 完整，網站引用的檔案存在。
- 所有影片均有可播放的 YouTube ID 與 visibility 紀錄。
- 無 placeholder、舊年級教材、broken asset 或 console error。
- 教師區、學生區、課堂工具與跨裝置 QA 均通過。

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
