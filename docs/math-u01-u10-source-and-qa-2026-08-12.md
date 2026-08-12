# 數學 U01–U10 Source & QA — 2026-08-12

## Outcome

- Scope：115 學年度、康軒、二年級上學期數學 U01–U10。
- Current gate：`exact-year-technical-candidate`。
- Human gate：尚待一次全科 parity check；未開放首頁 catalog，也未合併 production。
- Artifact gate：NotebookLM 與單元 YouTube 維持 `pending-shared-stage-2`。

## Source evidence

1. 康軒 115 低年級教材簡介
   - URL：<https://945cloud.knsh.com.tw/show/E/expo/pic/textbook_levels_low/115%E5%BA%B7%E8%BB%92%E7%89%88%E5%9C%8B%E5%B0%8F%E6%95%99%E6%9D%90%E7%B0%A1%E4%BB%8B%E2%94%80%E4%BD%8E%E5%B9%B4%E7%B4%9A.pdf>
   - Evidence：PDF physical p.7 列出二上 U01–U10 與子題；p.9–10 提供教學特色交叉核對。
2. 公館國小 115 學年度二年級康軒數學課程計畫
   - URL：<https://www.cp.ptc.edu.tw/storage/134712/134712_115_B-04_2A.pdf?1783189284=>
   - SHA-256：`722ebd215c47e8f0d6ee81a89bb1b3c06cb2743ec344ea397930c38cecc6a015`
   - Evidence：p.1 明示 115／二年級／數學／康軒／第一學期；p.1–9 支援十單元的公開學習目標。

113、114 同版公開計畫只作 adjacent-year sequence cross-check；115 exact-year 來源是本批次 scope 與目標的 primary evidence。

## Original-content boundary

單元名稱、順序、公開能力目標可由來源核對；頁面中的例題、數值、表徵、活動、互動與評量均為 edu2 原創。不得重製康軒課本、習作、教師手冊、出版社圖像或原題。

## Interactive map

| Unit | Interactive |
|---|---|
| U01 | place-value |
| U02 | column-arithmetic |
| U03 | length-measure |
| U04 | fact-family |
| U05 | area-grid |
| U06 | two-step |
| U07 | groups-array（2、5、4、8） |
| U08 | clock |
| U09 | groups-array（3、6、9、7） |
| U10 | compare-measures |

## Technical QA

- `node --check scripts/build-subject-pages.mjs`：PASS
- `node --check assets/js/unit.js`：PASS
- 所有 `data/**/*.json` 經 `jq empty`：PASS
- `node scripts/validate-foundation.mjs`：PASS
- shared `audit_cockpit.py`：0 errors / 0 warnings
- `git diff --check`：PASS
- Local HTTP：`math/` 與 U01–U10 均可載入；overview 顯示 10 cards。
- Browser runtime：十頁各有 1 個 math interactive、2 組 unit checks、0 console errors。
- Renderer guard：十頁均無 `undefined` 或 `[object Object]` 可見文字。
- U09 interaction：每組 3 個、4 組，正確輸出 `3＋3＋3＋3＝12` 與 `3×4＝12`。
- Mobile viewport 390×844：interactive visible，document scroll width 375，無水平 overflow。

## Remaining gates

1. 使用者進行一次全科 human parity，從總覽抽看單元內容、投影可讀性與教學合理性。
2. 通過後才將數學 catalog 升為 ready、合併 production。
3. NotebookLM／YouTube 留在 edu2、edu4 共用的第二階段 artifact pipeline。
