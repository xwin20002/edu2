# AGENTS.md — edu2 小二上教學駕駛艙

> **專案**：國小二年級上學期教學駕駛艙
> **GitHub Pages**：https://xwin20002.github.io/edu2/
> **GitHub Repo**：https://github.com/xwin20002/edu2
> **本機路徑**：`/Users/xwin20000/Dropbox/AIwork/D_AI_Family/課程學習資料/小二上學期/edu2/`
> **Obsidian 工作筆記**：`/Users/xwin20000/Dropbox/AIwork/D_AI_Family/課程學習資料/小二上學期/edu2/工作筆記.md`
> **Obsidian Dashboard**：`/Users/xwin20000/Library/CloudStorage/GoogleDrive-xwin20002@gmail.com/我的雲端硬碟/2ndbrain/edu2/工作筆記.md`
> **開發分支**：`main`
> **建案類型**：CC 新案／接管既有 repo（由 edu3 衍生）
> **建置狀態**：Foundation 已完成；完整教學內容與媒體產製中
> **Milestone A**：Foundation ready
> **Milestone B**：Complete Teaching Cockpit in progress
> **NotebookLM**：`https://notebooklm.google.com/notebook/2a2e7a75-9fde-439f-b3d4-8aa811bf4a73?authuser=1`（`xwin20002@gmail.com`）

## 專案目標

建立適合課堂投影、學生複習與家庭共學的小二上教學駕駛艙。沿用既有教學駕駛艙的互動架構，但所有課名、課文、生字、圖片、影音與教學提示必須依小二上正式教材重新建置。

`foundation.html` 是內部工作流程與資料入口；`index.html` 與各科／逐課頁面才是一般使用者成果。不得以 Milestone A 完成取代 Milestone B，或把只有目錄卡片的網站宣告為完整教學駕駛艙。

## 目前工作區

- Git remote 已指向 `xwin20002/edu2`。
- 工作分支為 `main`。
- 現有 HTML 與 assets 主要來自 `edu3`，只可作 UI / interaction reference，不是小二上正式教材。
- 未確認教材版本前，不得把現有「翰林版三下」內容批次改名後直接發布。

## 建議結構

```text
edu2/
├── index.html                 # 全科總覽首頁
├── README.md                  # 專案入口與操作說明
├── WORKFLOW.md                # 可重用於 edu4 的建置 SOP 與 phase gates
├── 工作筆記.md                # Obsidian／CC session 交接正本
├── project_vault_paths.md     # macOS／Windows repo-vault mapping
├── data/catalog.json          # 出版社、科目與 canonical topic catalog
├── docs/content-model.md      # 多出版社內容模型與上架條件
├── chinese.html               # 國語總覽
├── chinese/                   # 國語各課（確認範圍後建立）
├── math/                      # 數學總覽與各單元
├── life/                      # 生活課程總覽與各單元
├── assets/                    # 共用最佳化圖片與影音
├── source/                    # 本機教材來源；預設不發布
├── scripts/                   # 可重現的產生／驗證腳本
└── .github/workflows/         # GitHub Pages deployment
```

## CC 開案／關案路徑

- **Repository root**：`/Users/xwin20000/Dropbox/AIwork/D_AI_Family/課程學習資料/小二上學期/edu2`
- **工作筆記正本**：`工作筆記.md`（repo root；使用絕對路徑時見本檔頁首）
- **路徑 mapping**：`project_vault_paths.md`
- **外部 Obsidian dashboard**：Google Drive `2ndbrain/edu2/工作筆記.md`（摘要，不是 handoff 正本）
- **Git remote**：`origin` → `https://github.com/xwin20002/edu2.git`
- **Reference remote**：`edu3-reference` → `https://github.com/xwin20002/edu3.git`
- **GitHub Pages**：`https://xwin20002.github.io/edu2/`

執行 `cc開案` 時，先讀 `project_vault_paths.md`，再讀取 repo root 的 `工作筆記.md`、檢查 `git status` 與 `git fetch`，不得自動 `git pull`。執行 `cc關案` 時，先更新 repo root 的 `工作筆記.md` 與本檔／`CLAUDE.md` 的 handoff；重大狀態變更才同步外部 dashboard，最後只 stage 本次檔案並 commit、push 當前分支。不得使用破壞歷史的 Git 指令。

## 沿用的技術原則

- **注音布局**：優先使用已驗證的手工 flex 結構，避免 `<ruby> + vertical-rl` 的跨瀏覽器偏移。
- **直式課文**：`writing-mode: vertical-rl; width: 100%`，不加 `direction`。
- **發音**：`SpeechSynthesisUtterance`，`lang = zh-TW`、`rate = 0.75`，事件使用 `addEventListener`。
- **互動與可及性**：支援觸控、鍵盤操作、適當字級與 reduced motion；不得只以顏色傳達狀態。
- **素材管理**：大型 PDF、PNG、MP4 等原始檔不直接進 Git；發布前轉為適合網頁的尺寸與格式。
- **可重現建置**：內容或 CSS 若由腳本產生，腳本必須保存在 repo 的 `scripts/`，不可只放 `/tmp`。

## 建置順序

1. 確認出版社／版本、科目與課次範圍。
2. 盤點教材來源與 NotebookLM artifacts。
3. 建立小二上首頁與 navigation information architecture。
4. 先完成一課／一單元作為 golden template。
5. 驗證桌機、平板、手機、注音、發音與互動後，再批次擴充。
6. 最後設定 GitHub Pages deployment 與 production QA。

## 多出版社架構

- `data/catalog.json` 是 publisher/subject registry；schema 說明見 `docs/content-model.md`。
- 115 校訂組合為國語翰林、數學康軒、生活南一；各科仍須各自完成正式目錄與來源校對，不能以單一出版社資料跨科填入。
- 共用能力使用 publisher-neutral canonical ID；出版社課次只存在 mapping，不作跨版本主鍵。
- 比較頁分成「共通學習重點、版本特有內容、教授順序差異」，不可暗示逐課一一相等。
- `href` 只有在內容達到 ready 後才能啟用；現存 edu3 頁面不得出現在正式小二導覽。
- 實際建置順序與各階段 exit gate 以 `WORKFLOW.md` 為準；每次進入下一階段前執行 `node scripts/validate-foundation.mjs`。
- `data/hanlin-114.json` 是 114 historical outline；115 source-of-truth 是 `data/academic-year-115.json`。後者未通過 official outline gate 前，所有 unit arrays 必須為空，且不得執行 legacy `scripts/build-subject-pages.mjs` 生成 115 頁面。
- 公開網站只呈現課程名稱、學習重點與本站原創活動；不得重製受版權保護的課文、習題或教師手冊。

<!-- CC-SESSION-HANDOFF:START -->
## 📌 Session 交接區

- **Last session**: 2026-07-12 — 115 source recollection gate 已固化，國語／生活完成 outline-only intake。
- **Current state**:
  - GitHub repo 使用 `main`；不得重新 init 或改寫 history。
  - 115 publisher baseline 已確認：國語翰林、數學康軒、生活南一；三科入口仍停用，不得把 historical 114 頁面導入正式 115 導覽。
  - `docs/content-source-gates.md` 已成為 Phase 2 mandatory gate；`WORKFLOW.md`、`workflow.html`、`foundation.html` 與 `scripts/validate-foundation.mjs` 均要求依序通過 `publisher-baseline-verified` → `official-outline-verified` → `unit-brief-verified` → `publication-ready` → `artifact-ready`。
  - 115 翰林二上國語 official outline 已由翰林 115 低年級教材簡介第 5 頁核對，並寫入 `data/content-intake/chinese-hanlin-115.json` 與 `data/academic-year-115.json`：4 主題、12 課、2 篇來閱讀；第 4 頁是一下一頁，先前誤讀的〈春天來了〉等資料已移除並在 validator 加入 regression gate。
  - 115 南一二上生活 official outline 已寫入 `data/content-intake/life-nani-115.json`；康軒數學仍只有官方片段示例，尚未取得完整二上 exact outline。
  - L01〈我的心情〉已有 `data/content-intake/chinese-hanlin-115-l01-brief.candidate.json`，但來源是 114 屏東公開課程計畫，只能當跨學年 workflow candidate；不得升格為 115 `unit-brief-verified`，也不得重製課文、注音、字詞或題目。
  - 114 翰林公開目錄、28 個單元頁與相關 artifacts 只保留作架構／interaction historical reference，不得被標示、連結或產生為 115 內容。
  - NotebookLM 使用 `xwin20002@gmail.com`；YouTube unlisted 影片 `oD0GIU4UKPc` 是全冊 overview，**不得**再當逐課影片。
  - `docs/reference-baseline.md` 與 `data/templates/unit-content.template.json` 已建立；L01 是國語 golden example。
  - 國語直式／注音依 edu1 L8：`vertical-rl`、禁用 `direction`／`ruby`、手工 flex 聲調定位及 zh-TW 發音。
  - `workflow.html` 公開記錄 pipeline、reference layer 與不可破壞規格。
  - 國語 12 課公開詞彙、`zh-TW` 詞語發音與翰林「聽 e 聽」朗讀外連是 114 historical layer；原始音檔只允許 link-only，不下載、嵌入、重製或重新上傳。
  - 由課名或詞彙推測的 L02–L12 文意、事件與評量已移除；L01 直式文字明標為原創朗讀練習。`data/source-registry/chinese-lower-primary-114.json` 與 `data/source-acquisition-log.json` 是後續探索／下載的必經紀錄。
  - 已完成 `docs/prior-portfolio-source-audit-2026-07-11.md`：edu1 提供來源索引與版本異動檢查模式；edu3 提供 artifact integration history，但兩者教材內容均不可搬用。
  - Obsidian `創作庫/20260527_Win11-SOP驗證_L6毛毛蟲過河.md` 是必查 workflow evidence：前置搜尋不得只限 edu2 dashboard 或目標年級名稱。
  - 逐課課文結構 brief、NotebookLM artifact 與專屬影片是 `pending`；公開詞彙／朗讀層不構成課文理解完成，缺少合法來源時不得推測或產製。
  - 115 出版社隔離與比較框架已完成；新資料必須依國語翰林／數學康軒／生活南一各別重新蒐集，且每次來源候選都要記入 `data/source-acquisition-log.json`。
  - GitHub Pages production 仍是既有 114 historical/public learning layer；本 session 未產生 115 NotebookLM、YouTube 或正式逐課頁。
- **Next**:
  - 先取得 115 翰林二上國語 L01〈我的心情〉合法 text-structure brief／教師核對稿，完成 source → NotebookLM → QA → media ID vertical slice。
  - 取得 115 康軒二上數學與 115 南一二上生活 official outline，分別建立 U01／T01 subject Golden，禁止用 114 翰林資料替代。
  - 對每個教師／YouTube 候選完成版本、授權與兒少適切性 review，再決定是否 external link；視需求補做三科獨立 NotebookLM artifacts。
  - 每次資料發現先更新 source registry／provenance log，再建立 115 formal data 與 comparison mappings。
  - 將本 repo 的 `WORKFLOW.md`、schema、templates 與 validator 套用到 edu4。
- **Open questions**:
  - 115 國語與生活僅完成 official outline，逐課／逐單元合法 brief 尚未完成；114 公開詞彙 bank 與跨學年學校計畫不足以反推 115 內容。
  - 115 康軒二上數學完整 official outline 尚未找到。
  - GitHub Actions 顯示 Node.js 20 deprecation annotation；目前部署成功，後續需隨官方 action major release 更新。
<!-- CC-SESSION-HANDOFF:END -->
