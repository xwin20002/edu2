# edu2｜小二上教學駕駛艙

國小二年級上學期的跨學科 teaching cockpit，目標是提供課堂投影、平板互動、學生複習與家庭共學使用。

> 目前為 initialization / content migration 階段。Repo 內既有頁面承接自 `edu3`，僅作 UI 與互動功能 reference；尚不代表小二上教材已完成。

## 專案連結

- GitHub Pages：<https://xwin20002.github.io/edu2/>
- GitHub repo：<https://github.com/xwin20002/edu2>
- 開發分支：`feature/grade2-semester1-foundation`
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
- 翰林版 114 學年度公開課程目錄已完成：國語 12 課、數學 10 單元、生活 6 主題。
- 教學任務為本站原創，不重製課文、題本或教師手冊。

## 多出版社 foundation

- 預設版本：翰林。
- 預留版本：康軒、南一。
- 首頁提供出版社切換及版本差異比較模式。
- 結構化 registry：`data/catalog.json`。
- 內容規則：[docs/content-model.md](docs/content-model.md)。
- 翰林三科入口已啟用；康軒、南一在完成查證前維持 planned，不能誤開翰林內容。

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
