# CLAUDE.md — edu3 小三下國語教學駕駛艙

> **專案**：翰林版 三年級下學期 第7-10課
> **GitHub Pages**：https://xwin20002.github.io/edu3/
> **GitHub Repo**：https://github.com/xwin20002/edu3
> **NotebookLM**：https://notebooklm.google.com/notebook/d16786fd-5290-444a-81e7-4a1d877c18ce
> **本機路徑**：`/Users/xwin20000/Dropbox/AIwork/D_AI_Family/課程學習資料/小三國文下學期/L7-L10/`

## 專案結構

```
L7-L10/
├── index.html          # 四課總覽首頁
├── L7/index.html       # 做泡菜
├── L8/index.html       # 行人的守護者
├── L9/index.html       # 就愛兩兩在一起
├── L10/index.html      # 飛行員和小王子
├── assets/
│   ├── chars_L07~L10.jpg   # 生字卡（1920×1080）
│   ├── text_L07~L10.jpg    # 直式課文（1080×1920）
│   ├── theme_L07~L10.jpg   # 故事地圖（1920×1080）
│   ├── slide_01~12.jpg     # 授課簡報頁（1920×1080）
│   ├── 授課簡報.pdf         # 原始 PDF（本機，不在 GitHub）
│   ├── *.png               # 原始高清圖（本機，不在 GitHub）
│   └── 影片_學生自學.mp4    # 本機存檔（60MB，不在 GitHub）
├── .github/workflows/deploy.yml  # GitHub Actions Pages 自動部署
├── .gitignore          # 排除 PNG/PDF/MP4
└── /tmp/rebuild_grade3_L7L10.py  # HTML 重建腳本（本機 /tmp/）
```

## 技術重點

- **注音布局**：手工 flex（`char_html()` Python 函式），禁用 `<ruby>+vertical-rl`
- **直式課文**：`writing-mode:vertical-rl; width:100%`（絕不加 `direction` 屬性）
- **發音**：`SpeechSynthesisUtterance` lang=`zh-TW` rate=0.75，`addEventListener`（非 inline handler）
- **YouTube 影片**：ID `KNPnxPmhzJQ`（unlisted），已嵌入 L7~L10 四課

## 修改方式

任何 CSS / 注音 / 內容變更：
1. 編輯 `/tmp/rebuild_grade3_L7L10.py`
2. `python3 /tmp/rebuild_grade3_L7L10.py`
3. `cd` 到本機路徑，`git add . && git commit && git push`

<!-- CC-SESSION-HANDOFF:START -->
## 📌 Session 交接區

- **Last session**: 2026-05-26 — 完成小三下國語教學駕駛艙 L7-L10（翰林版 114學年度），部署至 GitHub Pages edu3
- **Current state**:
    - edu3 已上線：https://xwin20002.github.io/edu3/（L7~L10 四課全部可用）
    - NotebookLM 14 個 artifacts 全部 completed（簡報/影片/生字卡/直式課文/故事地圖）
    - YouTube 影片 KNPnxPmhzJQ 已嵌入四課 HTML（unlisted）
    - 本機原始 PNG、PDF、MP4 存於 Dropbox L7-L10/assets/（不在 GitHub）
    - rebuild 腳本位於 /tmp/rebuild_grade3_L7L10.py（需重建時使用）
- **Next**: 視需求繼續其他年級/課次駕駛艙；或跑 5/26 daily2report
- **Open questions**: 無
<!-- CC-SESSION-HANDOFF:END -->
