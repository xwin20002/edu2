# edu2｜小二上教學駕駛艙

國小二年級上學期的跨學科 teaching cockpit，目標是提供課堂投影、平板互動、學生複習與家庭共學使用。

> 目前為 initialization / content migration 階段。Repo 內既有頁面承接自 `edu3`，僅作 UI 與互動功能 reference；尚不代表小二上教材已完成。

## Milestone 狀態

- **Milestone A - Foundation：已完成。** 建置說明與資料入口見 [foundation.html](foundation.html)。
- **Milestone B - Complete Teaching Cockpit：進行中。** 這才是一般教師、學生與家長使用的最終成果；需完成 NotebookLM、YouTube、逐課內容與完整 QA 才能宣告專案完成。

## 專案連結

- GitHub Pages：<https://xwin20002.github.io/edu2/>
- GitHub repo：<https://github.com/xwin20002/edu2>
- 開發分支：`main`
- 技術參考 remote：`edu3-reference` → <https://github.com/xwin20002/edu3>

## 本機與 CC 路徑

| 用途 | 路徑 |
|---|---|
| Repository root | `/Users/xwin20000/Dropbox/AIwork/D_AI_Family/課程學習資料/小二上學期/edu2` |
| 專案規格 | `AGENTS.md` |
| Claude Code 規格入口 | `CLAUDE.md` |
| Obsidian／CC 工作筆記 | `工作筆記.md` |
| 跨平台路徑 mapping | `project_vault_paths.md` |
| 外部 Obsidian dashboard | Google Drive `2ndbrain/edu2/工作筆記.md` |

Repo 的 `工作筆記.md` 是 CC handoff 正本。外部 Obsidian dashboard 只提供跨專案瀏覽、摘要與連結；macOS／Windows 對應位置記錄於 [project_vault_paths.md](project_vault_paths.md)。

## 現況

- Git repo、GitHub repo、remote 與 Git history 已存在，禁止重新初始化。
- `origin` 指向 `xwin20002/edu2`。
- `edu3-reference` 保留作基底比較。
- 正式首頁已切換為小二上；舊三下內頁仍保留作 reference，但不在正式導覽中。
- 115 學年度 publisher baseline 已確認：國語翰林、數學康軒、生活南一；正式逐課／逐單元目錄仍在重新蒐集。
- 既有 114 翰林三科 outline、頁面與 NotebookLM overview 為 historical reference，不會作為 115 內容上架。
- 教學任務為本站原創，不重製課文、題本或教師手冊。
- Production 已於 2026-07-11 完成部署與 smoke test。
- 上述 production 是 Foundation／公開目錄版本，不代表 Milestone B 已完成。

## 多出版社 foundation

- 115 校訂組合：國語翰林、數學康軒、生活南一。
- 其他出版社仍可於 schema 擴充，但不能取代已確認的 115 科目選用。
- 首頁提供出版社切換及版本差異比較模式。
- 結構化 registry：`data/catalog.json`。
- 內容規則：[docs/content-model.md](docs/content-model.md)。
- 115 三科入口在取得正式目錄前維持停用；不得誤開 114 翰林內容或將其改名為 115。

## 建置流程

完整且可套用到 `edu4` 的流程請見 [WORKFLOW.md](WORKFLOW.md)。每次 foundation 變更後執行：

```bash
node scripts/validate-foundation.mjs
```

1. 確認出版社、學年度、科目及課次／單元範圍。
2. 整理合法可用的教材、NotebookLM artifacts 與影音來源。
3. 選一課／單元建立 golden template。
4. 驗證 desktop、tablet、mobile、projection、audio 與 accessibility。
5. 通過內容校對後，再批次產製其他單元。
6. 在 feature branch 完成 review，再合併並部署 GitHub Pages。

## Session workflow

- `cc開案`：讀取 `工作筆記.md`，檢查本地 Git 與遠端差異；不自動 pull、不修改筆記。
- `cc關案`：更新工作筆記與 handoff，stage 本次檔案，commit 並 push 當前分支。

完整規格請閱讀 [AGENTS.md](AGENTS.md)。
