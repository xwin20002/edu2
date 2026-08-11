# 國語 L01〈我的心情〉fallback Golden source 與 QA

## Promotion boundary

- Target：115 學年翰林版二年級上學期國語 L01〈我的心情〉。
- Accepted source window：使用者已指定本案可使用 113–115 學年資料；跨學年來源必須保留實際學年與 fallback 標示。
- Current gate：`fallback-brief-approved-cross-year-user-accepted`；可建立本站原創教學 vertical slice，不代表 115 官方課文或取得教材重製授權。
- Artifact：NotebookLM／YouTube 延後到 edu2／edu4 共用第二階段。

## Source evidence

### Tier A — 翰林 115 低年級教材簡介

- Direct evidence：二上第一主題與 L01〈我的心情〉的課名、作者、文體與順序。
- Allowed use：核對目標課次 metadata。
- Forbidden use：不從宣傳表格推測或重製課文、語句、題目、圖像或音檔。

### Tier B — 114 同版同年級同學期公開課程計畫

- Source ID：`ptc-114-hanlin-grade2-chinese-plan`。
- Match：翰林、二年級、上學期、L01〈我的心情〉。
- Learning signals：辨識情緒變化、使用完整句回應、以句型表達並記錄心情。
- Rights boundary：只使用公開課程計畫的教學訊號；本站短文、句型活動與評量題全部重新撰寫。

### Historical public-learning layer

- 114 教育雲逐課詞彙與翰林聽 e 聽外部朗讀入口維持 historical／link-only。
- 不把 114 詞彙升格為 115 官方生字，也不以詞彙反推出版社課文。

## Golden contract

L01 頁面必須同時具備：

1. 明確的 `114 fallback／115 candidate` 與原創內容標示。
2. 四段 edu2 原創短文及逐段 `zh-TW` 朗讀。
3. 三題只依原創短文作答的閱讀理解。
4. 「心情＋原因＋希望」三段句互動與完整句朗讀。
5. 人工核對的注音詞卡；不使用自動轉注音、`ruby` 或 `direction`。
6. Student／teacher mode、desktop／tablet／mobile responsive 與 console QA。

## QA ledger

- Source gate：PASS。
- Schema / generator / validator：PASS；全站由 `node scripts/build-subject-pages.mjs` 重建，`validate-foundation` PASS，全部 JSON parse 與 `git diff --check` PASS。
- Shared audit：PASS；`audit_cockpit.py` 為 0 errors / 0 warnings。
- Local HTTP smoke：PASS；國語總覽、L01、CSS、JS 均為 HTTP 200，原創閱讀與句型 builder markers 均命中。
- Browser interaction / responsive / console：PASS by human parity review；使用者於 2026-08-11 檢查本機 L01 Golden 後確認 OK。
- Human parity：PASS；2026-08-11 使用者確認 OK。
- Promotion decision：`fallback-publication-ready-human-confirmed`；可以合併 `main` 並部署，但仍不得標為 115 官方課文。
- Exact 115 unit brief：仍為 open gate；即使本頁通過，也只能維持 fallback／candidate 標示。

## Production evidence

- Content / promotion commit：`af6b5101208acf08b91e7831a822035d8f95a0cf`，已 fast-forward 合併並推送 `main`。
- Rules check run：`31507794764`，terminal `success`。
- GitHub Pages run：`31507794802`，terminal `success`。
- Production smoke：首頁、國語總覽、L01、CSS、JS、workflow 均為 HTTP 200；negative path 為 404。
- L01 cache-busting response 已命中 human-confirmed 狀態、原創閱讀、心情三段句、權利邊界與 `20260811-chinese-l01-1` asset key。
