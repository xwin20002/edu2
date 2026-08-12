# edu2 115 康軒數學 Artifact QA

## Source gate

- Scope：二上數學 U01–U10 subject overview；不是逐單元 artifact。
- Source pack：`sources/notebooklm/115/math-kanghsuan-115.md`。
- Gate：10 個 exact-year unit briefs 均為 `publication-ready-human-confirmed`。
- Rights：只使用公開課程範圍與 edu2 原創教學設計；不重製課本、習作、教師手冊、出版社題目或圖像。

## NotebookLM isolation and concurrency

- 115 pilot notebook：`e3dab5a2-7fe0-4413-9c82-fba3c9a00038`。
- 只附加 1 個 subject source；未修改 114 historical notebook。
- Queue policy：NotebookLM generation 同時最多 1 個；slides 通過 QA 前 video 保持 blocked。
- Slides 最終 artifact：`a1764852-34ce-440e-8100-2c5743c580cb`。

## Slides QA

- 最終 PDF：14 pages、1376 × 768 pt、18 MB；本機原檔由 `.gitignore` 管理。
- Web derivatives：14 JPG，合計約 3.7 MB。
- 第一版第 5 頁尺規圖端點與 `12－3＝9` 不一致，判定 rejected。
- 第一次 revision 仍未精確對齊 3 與 12，判定 rejected。
- 第二次 revision 改用 3／12 垂直標記與 9 公分雙向箭頭，視覺與算式一致，通過。
- 全 14 頁檢查：單元覆蓋、繁體中文、數學算式、圖像對應、裁切、溢位、亂碼與兒少適切性；無其餘 blocking defect。

## Web integration QA

- `math/artifacts.html` 提供上一頁、下一頁、range、鍵盤方向鍵與 fullscreen。
- Browser runtime：下一頁由 1/14 切為 2/14，image source 同步；console 0 warning / 0 error。
- 390 × 844：document `scrollWidth == clientWidth`，無水平 overflow。
- Video 仍在獨立 generation／QA gate，未在頁面冒稱完成。

## YouTube gate

- 只在 video QA 通過後上傳。
- Visibility 固定 `unlisted`；audience 固定 `madeForKids: true`。
- 共用 uploader 已改為 audience 必填，避免把小學內容默認標成非兒少內容。

## Video QA result

- NotebookLM video artifact：`860ad9ce-0e82-4a21-95c2-1b23c4989e42`；6:46、1280 × 720、H.264＋AAC。
- 以每 12.5 秒 dense frame sampling 檢查全片。
- Blocking defect：約 162 秒尺規圖的物件起點在 2 公分附近，後續卻用 `12－3＝9`；視覺證據與算式矛盾。
- Secondary defect：加減概念頁使用 `Addition / Subtraction`，偏離全繁體中文 brief。
- 判定：`artifact-qa-rejected-not-uploaded`。為保守使用 NotebookLM 額度，本輪不立即重生第二支；YouTube 保持 blocked，沒有 video ID。

## Video revision and YouTube promotion

- 使用者確認 slides viewer 後，只啟動 1 支修正版；NotebookLM concurrency 全程維持 1。
- 修正版 artifact：`ba9e415e-62cd-46bc-bb78-59943b37b50a`；取代 rejected artifact `860ad9ce-0e82-4a21-95c2-1b23c4989e42`。
- 下載檔：9:55、1280 × 720、H.264＋AAC、約 38.7 MB；MP4 留在 ignored 本機 assets，不提交 Git。
- 視覺 QA：每 8 秒抽 1 張，共 74 張；另對 U03 長度段落做密集抽樣。舊版的尺規數字矛盾與 `Addition / Subtraction` 英文標籤均未再出現。尺規段改成無數字的「終點－起點」示意，未聲稱錯誤刻度。
- 全片 visual review 亦覆蓋位值、直式、乘法等組、時間、容量與重量；沒有發現新的 blocking visual defect。結尾約 4 秒靜音為正常收尾。
- YouTube preflight：Google 帳號 `xwin20002@gmail.com`；頻道 `xwin2000-mimi`／`@xwin2000-p4d`。
- 上傳結果：`https://youtu.be/F-JHxa_XTEI`；`unlisted`、`madeForKids: true`、Education、`zh-TW`。YouTube Studio 已確認兒童專屬、不公開、9:56 且標準畫質處理完成；本機 artifact viewer 的 privacy-enhanced embed 可載入並顯示正確頻道。
- Release commit `6d7c87c67a6c90ec149cc9185563eb908591d875` 已推送 `main`；Rules run `31571813983` 與 Pages run `31571814036` terminal success。
- Production smoke：首頁、數學總覽、artifact viewer 與第 14 張 JPG 全數 HTTP 200，negative path 404；production HTML 命中正確 video ID。383px browser runtime 無水平 overflow，14 張簡報與 YouTube privacy-enhanced iframe 均載入。
