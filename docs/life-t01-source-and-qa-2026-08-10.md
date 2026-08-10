# 生活 T01「標誌與生活」source pack 與 QA

## Promotion boundary

- Target：115 學年南一版二年級上學期生活 T01「標誌與生活」。
- Accepted source window：使用者已指定本次可使用 113–115 學年資料；跨學年來源必須標示實際學年並核對出版社、年級、學期與主題。
- Current gate：`unit-brief-verified-cross-year-user-accepted`；可建立原創教學 vertical slice，不代表取得課本重製授權。
- Artifact：NotebookLM／YouTube 依決策延後到 edu2／edu4 共用第二階段。

## Source evidence

### Tier A — 南一 115 低年級教材簡介

- URL：<https://naniexpo.nani.com.tw/uploads/pdf/20260312_201419_4ea29e252cdd.pdf>
- Direct evidence：二上生活主題一「標誌與生活」，子題「生活中的標誌」、「標誌的妙用」。
- Allowed use：核對 115 主題、子題與順序。
- Forbidden use：不從宣傳表格推測課本活動、題目、圖像或音檔。

### Tier B — 東園國小 114 南一版二上生活課程計畫

- URL：<https://tten.tp.edu.tw/Login/Downment?grade=2&spid=34e77ca2-f290-4b10-8700-89ec75155e60&subject=LifeCourse>
- Document identity：臺北市萬華區東園國民小學 114 學年第一學期二年級生活課程計畫，南一版生活第三冊。
- Unit evidence：第 1–3 週、主題一「標誌與生活」，18 節。
- Learning signals：觀察生活與交通情境中的標誌、聲音與手勢；理解其所代表的意思與幫助；連結日常生活安全；理解標誌設計通則；以觀察、口頭、行為、態度等方式評量。
- Rights boundary：只引用公開課程計畫的課程信號；網頁活動、紀錄表與評量題均由 edu2 原創撰寫。

## Golden contract

T01 頁面必須同時具備：

1. 可見線索紀錄，並把 observation 與 inference 分開。
2. 可核對的 inquiry flow，不把所有生活課都硬套成單變因實驗。
3. 交通與場域安全提醒。
4. 可填寫的 observation record 與 evidence reflection。
5. 至少兩題 subject-specific formative checks 與教師檢核規準。
6. Student／teacher mode、desktop／tablet／mobile responsive 與 console QA。

## Current QA state

- Source gate：PASS。
- Schema / generator / validator：PASS；`node scripts/build-subject-pages.mjs` 可重建，`validate-foundation` PASS，shared `audit_cockpit.py` 0 errors / 0 warnings。
- T01 browser QA：PASS；3 個 observation fields、4 步 inquiry、3 條 safety notes、2 題 subject-specific checks；教師模式、紀錄輸入與答題回饋正常。
- Responsive：390×844 與 820×1180 無水平 overflow；mobile observation record 為單欄。
- Shared-shell regression：修正 desktop sticky header 覆蓋 mode button；L01、U01、T01 的 teacher mode 均可操作，L01 保留 18 張生字卡／0 ruby，U01 位值拆解器仍正確。
- Console：三科 Golden 0 error / warning。
- Human parity：PASS；2026-08-10 使用者確認 OK。
- Promotion decision：`publication-ready-human-confirmed`；可合併 `main` 並進入 production smoke。NotebookLM／YouTube 仍是獨立 artifact gate，不因本次通過而冒稱完成。
