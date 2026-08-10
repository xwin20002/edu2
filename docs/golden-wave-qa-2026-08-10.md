# edu2 Golden wave QA — 2026-08-10

## Release boundary

本批先在 `codex/edu2-main-materials` 建立可審核支線；2026-08-10 使用者已完成國語 L01 與數學 U01 human parity 確認，核准合併 `main` 並部署這個 historical/fallback baseline。115 正式首頁仍停用三科入口。NotebookLM／YouTube 延後為 edu2／edu4 共用第二階段。

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
| 國語 L01 | 18 個生字卡、manual flex zhuyin、`vertical-rl`、無 `ruby`／`direction`、教師模式可切換 | fallback technical pass；2026-08-10 human confirmed；待 115 unit brief |
| 數學 U01 | 位值拆解器、3 個表徵卡、1 個 worked example、4 步推理、2 個迷思與單元評量；教師模式可切換 | historical renderer candidate；2026-08-10 human confirmed；待 115 康軒 unit brief |
| 生活 T01 | 共用 shell、教師模式與 responsive 正常 | 0 個 observation record、0 個 safety section；維持 blocked |

Desktop、390×844 mobile、820×1180 tablet 均無水平 overflow；三頁 browser console 無 error／warning。

## Promotion decision

- 國語與數學已完成使用者 human parity，可將當前 historical/fallback renderer baseline 合併部署；但因 115 unit brief 仍未過 gate，不標記 115 publication-ready。
- 生活不得升級，下一個最小測試是先取得南一 115「標誌與生活」合法 unit brief，再建立 observation／safety／record／reflection vertical slice。
- 未追蹤的兩份 `SANITIZED_*.md` 不屬本批專案內容，不納入 stage 或 commit。

## Production evidence

- Deployed commit：`e88c1e624bdef2c1590bcabfa8f4a1e8ed92b1cf`，驗證時 `main = origin/main`。
- GitHub Pages run：`31398534989`，terminal status `success`。
- HTTP smoke：首頁、國語 L01、數學 U01、生活 T01、workflow 均 200；不存在路徑為 404。
- Production browser smoke：L01 為 18 個 manual-flex 注音字卡且無 `ruby`；U01 輸入 182 正確輸出「1 個百、8 個十、2 個一」；三頁台與 workflow 的 console 皆 0 error / 0 warning。
- CI maintenance note：Actions 顯示 Node 20 action runtime 將被強制使用 Node 24，屬後續 workflow dependency 升級項，不是本次部署失敗。
