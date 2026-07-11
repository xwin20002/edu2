# edu2 建置 Retrospective — 2026-07-11

## 結論

本次初期成果不佳，主要不是使用者缺少目標，而是 agent 沒有把已給目標轉成可驗收的階段、Golden Sample 與 quality parity gates，並在尚未完成資料供應鏈時過早宣告架構成果。

## 使用者其實已提供的關鍵目標

- 參考既有 edu3／edu1 教學駕駛艙。
- 不只做架構，還要資料蒐集、NotebookLM、YouTube 與 Web 成品。
- Milestone A 是工作流程／資料入口；Milestone B 才是一般使用者成果。
- 必須使用 `xwin20002@gmail.com` 的 NotebookLM 與 YouTube。
- Obsidian 與既有 SOP 應納入接管流程。

因此問題不是「沒有目標」，而是沒有在開始前建立 acceptance checklist。

## Root Causes

### 0. 沒有先啟動既有知識系統

最上層問題不是缺少資訊，而是沒有把 GitHub、Skills、Obsidian 當成 mandatory reuse preflight。GitHub 已保存可執行架構與歷史；Skills 已保存 subject workflow 與 YouTube uploader；Obsidian 已保存路徑、帳號與踩坑。但 agent 沒有先建立 reuse map，造成重做已解問題。

**預防：** 開工前先完成 GitHub／Skills／Obsidian 三方盤點，將候選項標成 `reuse`、`adapt`、`recollect`、`forbidden-content`。未完成 reuse map，不得開始產頁。

### 1. 未先讀完 source of truth

Agent 一開始沒有完整讀取 Obsidian dashboard 與既有工具 SOP，甚至判斷 Obsidian 不需要 follow。結果漏掉既有 YouTube command-line uploader，錯走 Chrome／Finder 上傳流程。

**預防：** `cc開案` 必須先讀 repo handoff、Obsidian dashboard、reference repos、既有 SOP，再做任何建置。

### 2. 把「架構完成」誤當成「成果接近完成」

初期只建立首頁、schema 與空內容架構，卻沒有同步完成 sources、NotebookLM artifacts、YouTube 與逐課內頁。這違反使用者已定義的 Milestone A／B 邊界。

**預防：** 每次狀態報告必須分別列出 Architecture、Data、Artifacts、Integration、Validation、Parity 六欄，不得用單一百分比或「已完成網站」概括。

### 3. 未先 inventory edu1／edu3 GitHub repo

只看少數發布頁面，沒有先盤點 reference repo 中可重用的 generator、CSS、JS、assets 與科目 renderer，導致重做低品質內頁，之後才向 edu1 L8 靠齊。

**預防：** Phase 1 第一個交付物必須是 reference inventory 與 reuse matrix，而不是新 HTML。

### 4. 任務一次切得太大

同一輪同時承擔三科、28 個單元、多出版社、NotebookLM、YouTube、GitHub Pages、Obsidian 與 workflow 文件。缺少 vertical slice，造成大量頁面先被生成，再反覆整批改造。

**預防：** 先完成一個 end-to-end vertical slice：一科一課 → source → NotebookLM → YouTube → page → QA → parity。通過後才擴散。

### 5. Golden Sample 定義太晚

早期沒有先定義國語、數學、生活各自的 Golden，也沒有區分科目 × 年段 profile。結果把共用頁面 shell 誤當成各科都足夠的完成標準。

**預防：** 批次建置前必須登錄 Global Shell Golden 與 Subject-Grade Golden；Golden 未通過，不得重建全站。

### 6. 未先驗證帳號與工具路徑

NotebookLM 起初進入錯誤帳號；YouTube 又先嘗試 browser upload，後來才找到已存在的 CLI uploader。

**預防：** Artifact phase 的第一個 gate 是 Account／Tool Preflight：帳號、notebook ID、channel、token scope、uploader path 全部核對後才能產製。

### 7. 缺少 reference parity checklist

技術驗證只確認頁面可開、互動可點，沒有一開始就對照 edu1／edu3 的資訊密度、直式、注音、素材完整度與課堂可用性。

**預防：** 技術 QA 與 quality parity 必須分開；只有 parity checklist 經人工確認，才能宣告 Milestone B complete。

### 8. 狀態宣告過早

多次以「已完成」「已上線」描述尚缺少正式資料、科目 artifacts 或 parity 的成果，讓實際缺口不易被看見。

**預防：** 完成宣告必須附 evidence：commit、production URL、artifact manifest、validator、Golden QA、未完成清單。

## 任務大小的正確切法

1. **Architecture slice**：reference inventory、reuse matrix、global shell。
2. **Chinese lower-primary Golden**：一課完整走完六階段。
3. **Math lower-primary Golden**：一單元完整走完六階段。
4. **Life lower-primary Golden**：一主題完整走完六階段。
5. **Batch promotion**：三科 Golden 通過後才建置 28 頁。
6. **Publisher expansion**：翰林完成後，康軒／南一各自重新 intake 與 mapping。

## 10–15 分鐘 Early Warning Check

開工後第一個 checkpoint 必須能回答：

- 是否已讀 repo handoff、Obsidian 與 SOP？
- 是否已搜尋 reference GitHub source 與安裝／共用 skills，並產生 reuse map？
- 是否已 inventory reference GitHub，而不是只看畫面？
- 目前是在六階段中的哪一階段？
- Golden Sample 是哪一頁、哪一個 subject-grade profile？
- 新資料來源是否可追溯？
- NotebookLM／YouTube 帳號與工具是否已 preflight？
- 本輪交付是 vertical slice 還是 batch？若是 batch，Golden 是否已通過？
- 「技術可用」與「reference 品質一致」是否被分開驗證？

任一題答不出來時，立即停止批次產製，回到上一個 gate。

## Knowledge Maturation Loop

本次真正可累積的架構不是單一 edu2 頁面，而是：

`專案發現 → Obsidian 記錄 → 重複驗證 → 提煉進共用 Skill → script／validator 固化 → 下一案 mandatory preflight`

- 專案特定狀態留在 repo handoff／Obsidian。
- 跨專案重複流程移入 GitHub-managed skill。
- 容易做錯且可判定的規則移入 script／validator。
- 下一個 edu 專案先載入 skill 與 reuse map，不從空白規劃。

## 快速接回流程

發現走偏時，不重做全部專案。依序記錄：

1. `currentPhase`：目前六階段位置。
2. `lastVerifiedGate`：最後通過的 gate 與 evidence。
3. `firstDivergence`：第一次偏離 reference／workflow 的地方。
4. `preserve`：可保留的架構、資料與 artifacts。
5. `replace`：必須替換的錯誤內容或流程。
6. `nextSmallestTest`：下一個最小可驗證動作。

以最小修正回到 Golden Sample，Golden 通過後再恢復 batch promotion。
