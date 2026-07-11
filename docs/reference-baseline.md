# 教學駕駛艙 Reference Baseline

## 目的

Reference 頁面定義穩定的資訊架構與互動行為；新年級、學期或出版社只替換內容資料，不複製整份 HTML。

## 核准基準

- 國語完整內頁：<https://xwin20002.github.io/edu1/L8/index.html>
- 小二上實作頁：<https://xwin20002.github.io/edu2/chinese/L01/index.html>
- 小三教學駕駛艙：<https://xwin20002.github.io/edu3/>

## 穩定層與內容層

### 穩定層（跨專案沿用）

- `scripts/build-subject-pages.mjs`：頁面組裝與 subject-specific renderer。
- `assets/css/unit.css`：駕駛艙視覺、直式導讀、注音、生字、簡報、評量與工具列。
- `assets/js/unit.js`：學生／教師模式、輪播、測驗、發音、字級、計時器與畫筆。
- `scripts/validate-foundation.mjs`：檔案與 phase gate 驗證。

### 內容層（換冊時替換）

- `data/hanlin-114.json` 或其他 publisher content JSON。
- 每單元的 title、focus、mission、objectives、flow、verticalSummary、vocabulary、characters。
- NotebookLM slides、影片 ID 與 artifact manifest。

## 國語不可破壞規則

### 直式導讀

- 使用 `writing-mode: vertical-rl`。
- 使用 `text-orientation: mixed`。
- 不加入 `direction`；它會造成直式閱讀順序錯亂。
- 不放入受版權保護的課文全文；只放原創摘要或已取得發布授權的內容。

### 生字與注音

- 不使用 `<ruby>` 疊加 `vertical-rl`。
- 漢字與注音採手工 flex layout。
- 注音符號由上而下排列；聲調符號放在最後一個注音符號右側。
- 點擊漢字使用 `SpeechSynthesisUtterance`，`lang=zh-TW`、`rate=0.75`。
- 每筆資料格式：`{"char":"情","zhuyin":"ㄑㄧㄥˊ"}`。

## 建置流程

1. 依 `data/templates/unit-content.template.json` 準備內容。
2. 將已查證內容放入 publisher content JSON。
3. 執行 `node scripts/build-subject-pages.mjs`。
4. 執行 `node scripts/validate-foundation.mjs`。
5. 對至少一個國語頁做直式、聲調位置、發音與手機版 visual QA。

