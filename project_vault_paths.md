# edu2 project / vault paths

本檔提供 `cc開案`、`cc關案` 與人工接手時的跨平台路徑 mapping。

## Source of truth

- CC handoff 正本：`<repo>/工作筆記.md`
- Obsidian dashboard：`<vault>/edu2/工作筆記.md`
- Dashboard 只保存摘要與連結，不取代 repo 內的 handoff 正本。

## macOS

```text
Repository root:
/Users/xwin20000/Dropbox/AIwork/D_AI_Family/課程學習資料/小二上學期/edu2

CC handoff note:
/Users/xwin20000/Dropbox/AIwork/D_AI_Family/課程學習資料/小二上學期/edu2/工作筆記.md

Obsidian vault:
/Users/xwin20000/Library/CloudStorage/GoogleDrive-xwin20002@gmail.com/我的雲端硬碟/2ndbrain

Obsidian dashboard:
/Users/xwin20000/Library/CloudStorage/GoogleDrive-xwin20002@gmail.com/我的雲端硬碟/2ndbrain/edu2/工作筆記.md
```

## Windows

Windows 的 repo 路徑尚未確認，不得自行假設。已確認同一 Google Drive vault 的邏輯路徑為：

```text
Obsidian vault:
G:\我的雲端硬碟\2ndbrain

Obsidian dashboard:
G:\我的雲端硬碟\2ndbrain\edu2\工作筆記.md
```

## CC discovery rules

1. 優先讀取本檔確認 mapping。
2. `cc開案` 讀取 repo root 的 `工作筆記.md`，不得把 dashboard 當成 handoff 正本。
3. `cc關案` 更新 repo root 的 `工作筆記.md`；若有重大狀態變更，再同步更新 dashboard 摘要。
4. 不自動 `git pull`，不重新 `git init`，不改寫既有 Git history。
