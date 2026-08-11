# 生活 T02–T06 source reconciliation 與 QA（2026-08-11）

## 範圍

- 目標：115 學年度南一二上生活 T02–T06。
- Golden：已由使用者確認的 T01「標誌與生活」。
- 狀態：T02–T06 已完成 technical QA，並於 2026-08-11 由使用者一次性確認 human parity；NotebookLM／YouTube 保留第二階段。

## 來源與映射

| 115 目標 | 115 官方 outline | 114 東園二上南一課程計畫 | 使用方式 |
|---|---|---|---|
| T02 吸住了 | 第 12 頁 | PDF 第 3 頁，同名主題二 | cross-year unit brief |
| T03 我愛泡泡 | 第 12 頁 | 無同名主題 | official-outline-only；只發布 edu2 原創 inquiry |
| T04 大樹 | 第 12 頁 | PDF 第 3 頁，114 編為主題三 | 依標題映射，不沿用舊編號 |
| T05 和風做朋友 | 第 12 頁 | PDF 第 4 頁，114 編為主題四 | 依標題映射，不沿用舊編號 |
| T06 冬天 | 第 12 頁 | PDF 第 5 頁，同名主題六 | cross-year unit brief |

- 南一 115 官方簡介：<https://naniexpo.nani.com.tw/uploads/pdf/20260312_201419_4ea29e252cdd.pdf>
- 東園國小 114 二上南一生活課程計畫：<https://tten.tp.edu.tw/Login/Downment?grade=2&spid=34e77ca2-f290-4b10-8700-89ec75155e60&subject=LifeCourse>
- 東園 PDF SHA-256：`250057ba79cfc6cae7874365b6113967cfe4a5df01d533e194cee6510d1ca76c`

## 內容邊界

- 課名與子題以 115 南一官方 outline 為準。
- 114 課程計畫只提供學習表現、探究、安全與評量訊號；不能標成 115 文件。
- 跨年映射必須同年級、同學期、同出版社且標題相符；不可只按單元編號映射。
- T03 無二上同名公開課程計畫，因此明示 `official-outline-verified-original-inquiry`。
- 所有任務、紀錄、題目與教師 checklist 為 edu2 原創；不重製課本、習作、歌曲、圖像、音檔或教師手冊。

## QA evidence

- `node scripts/validate-foundation.mjs`：PASS。
- JSON parse：T01–T06 briefs、intake、manifest、registry、acquisition log 全部 PASS。
- `git diff --check`：PASS。
- Browser desktop：生活總覽與 T01–T06 無水平 overflow；每頁包含 source layer、observation、inquiry、safety、reflection、teacher checklist 與 4 組 quiz items（2 共用＋2 單元題）。
- Browser mobile 390×844：生活總覽與 T01–T06 均無水平 overflow；observation record 單欄顯示。
- Interaction：教師模式可切換、教師區可見、正確選項會顯示 `correct`；console 0 errors / 0 warnings。
- Artifact boundary：生活 T01–T06 不再混用 114 全冊 NotebookLM 簡報／YouTube；顯示第二階段 pending。

## Human parity gate（PASS）

使用者已由 `life/index.html` 一次檢查五頁並回覆「確認OK」：

1. T02 磁鐵公平測試與安全規則是否適合二年級。
2. T03 泡泡活動是否清楚標示原創、且安全規則足夠。
3. T04 樹朋友觀察是否兼顧證據與低干擾愛護。
4. T05 風的證據與強弱比較是否容易帶班。
5. T06 冬日照顧、保暖與關懷是否合宜。

T02–T06 已晉為 `publication-ready-human-confirmed`；後續仍須通過 `main` deployment 與 production smoke，才可宣告線上發布完成。
