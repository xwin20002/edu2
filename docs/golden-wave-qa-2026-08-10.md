# edu2 Golden wave QA — 2026-08-10

## Release boundary

本批只在 `codex/edu2-main-materials` 建立可審核支線，不合併 `main`、不部署 production。115 正式首頁仍停用三科入口。NotebookLM／YouTube 延後為 edu2／edu4 共用第二階段。

## Source boundary correction

- 國語 L01 可使用已記錄、使用者核准的 `114-fallback / 115-candidate`，但不得標為 115 official。
- `data/hanlin-114.json` 的數學與生活是 114 翰林歷史內容，只能驗證 renderer，不得標為康軒 115 或南一 115 教材。
- 南一 115 官方 T01 是「標誌與生活」；舊歷史頁「動物好朋友」不是同一 target unit，因此生活 T01 維持 blocked。
- 康軒 115 二上完整數學 outline 尚未通過 gate；數學 U01 的位值內容只作 historical renderer Golden candidate。

## Automated QA

- `node scripts/build-subject-pages.mjs`：國語 12、數學 10、生活 6 頁可由 repo generator 重建。
- `node scripts/validate-foundation.mjs`：PASS。
- Shared `audit_cockpit.py`：0 errors、0 warnings。
- JSON parse 與 `git diff --check`：PASS。

## Browser QA

| Golden | Technical result | Source/parity result |
|---|---|---|
| 國語 L01 | 18 個生字卡、manual flex zhuyin、`vertical-rl`、無 `ruby`／`direction`、教師模式可切換 | fallback technical pass；待 115 unit brief 與 human parity |
| 數學 U01 | 位值拆解器、3 個表徵卡、1 個 worked example、4 步推理、2 個迷思與單元評量；教師模式可切換 | historical renderer candidate；待 115 康軒 unit brief 與 human parity |
| 生活 T01 | 共用 shell、教師模式與 responsive 正常 | 0 個 observation record、0 個 safety section；維持 blocked |

Desktop、390×844 mobile、820×1180 tablet 均無水平 overflow；三頁 browser console 無 error／warning。

## Promotion decision

- 國語與數學只升為「等待使用者 human parity 的 candidate」，不標記 publication-ready。
- 生活不得升級，下一個最小測試是先取得南一 115「標誌與生活」合法 unit brief，再建立 observation／safety／record／reflection vertical slice。
- 未追蹤的兩份 `SANITIZED_*.md` 不屬本批專案內容，不納入 stage 或 commit。
