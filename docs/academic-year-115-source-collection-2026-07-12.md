# edu2｜115 資料收集紀錄（第一輪）

## Scope

`portfolio`／`resumed`：小二上三科，115 學年度；國語翰林、數學康軒、生活南一。目標是建立可追溯的 official outline 與單課／單元 source pack，**不是**把 114 資料改名。

## Collected evidence

| 科目 | 優先來源 | 本次結果 | 可否填入 115 unit | 下一步 |
| --- | --- | --- | --- | --- |
| 國語／翰林 | 翰林官方 115 低年級教材簡介 PDF | 封面與**第 5 頁二上**課次表已視覺核對；4 主題、12 課、兩篇來閱讀、作者與文體已進 intake；第 4 頁一下資料已明確排除 | 僅 outline metadata | 取得 L01〈我的心情〉合法 text-structure brief，才建立小二國語 Golden vertical slice |
| 國語／翰林 | 教育雲教育百科 115 上 | 學年度篩選已出現，但未回傳二年級出版社、課次或詞彙資料 | 否 | 等待 115 二上翰林 word bank；出現後下載 snapshot、hash、補入逐課詞彙 intake |
| 國語／翰林 | 老松國小課程計畫 PDF 候選 | URL／搜尋索引為 115 候選，但 PDF 內文多處標示 114；已下載、hash 並拒絕內容使用 | 否 | 保留為 year-mismatch 負例；持續找內文與版本皆為 115 的 L01 合法 brief |
| 國語／翰林 | 屏東縣公開 114 翰林二上課程計畫 | 精確對應 L01〈我的心情〉，提供情緒表達、完整句與句型記錄心情的課程訊號；與 115 官方 outline 交叉相符 | 僅 cross-year candidate | 取得 115 同版或教師核對，才可升格為 L01 unit brief |
| 數學／康軒 | 康軒官方 115 低年級教材簡介 PDF、課程計畫入口 | 已核對 115 版本與二上部分概念示例；尚無完整二上單元表 | 否 | 取得 exact file 後核對單元順序與目標，再做 U01 Golden |
| 數學／康軒 | 康軒數位高手（數學） | 已找到數學影音、電子書與媒體盒 index；尚無已核對的 115 二上 unit resource | 否 | 僅在 unit 已核對後作 link-only 候選 review |
| 生活／南一 | 南一官方 115 低年級教材簡介 PDF | 封面與生活課程表已視覺核對；二上 6 主題、16 子題已進 intake | 僅 outline metadata | 為 T01 另找合法教學／活動來源並完成 Golden |
| 三科交叉核對 | 嘉義縣 115 課程計畫平台 | 115 平台與學校頁已開放；本次公開 metadata scan 未取得符合 edu2 組合的二年級檔 | 否 | Tier A outline 出現後，以同版本學校計畫作 Tier B cross-check |

## Non-results are evidence

教育雲與課程計畫平台「可以選 115」不等於資料已發布。翰林國語與南一生活已由各自官方 115 教材簡介 PDF 確認 outline，因此 `data/academic-year-115.json` 只新增直接列出的課名／主題／文體 metadata；數學仍不填入單元。三科都尚未建立 NotebookLM pack 或影片。

同樣地，來源 URL、搜尋摘要或檔名含有「115」也不構成 exact match。老松國小候選檔案的內文標示為 114，故記為 `SRC-20260712-010` rejection evidence；不得把其中任何週次、目標或活動帶進 115 L01。

與此不同，屏東縣公開計畫的內文與來源年份都明確是 **114**，而且精準對應二上翰林 L01〈我的心情〉；它可用於發現「情緒辨識／表達、完整句、句型記錄」的候選教學訊號，但仍不可取代 115 brief。候選輸出刻意不收錄課文正文、注音、字詞或習題，狀態是 `cross-year-candidate-not-promoted`。

## Reuse findings

- edu1 的 `RAW資料/資源索引.md` 證明同一出版社在不同學年度仍可能有課次異動；因此 112／114 的資料只能重用 **source-index pattern**，不可作 115 curriculum。
- edu3 可以重用 artifact integration workflow，但其 Git history 不足以證明教材來源；不可作本案內容來源。

## Gate to start content production

每一科先取得一份 exact `115 + 二年級 + 上學期 + 科目 + 出版社` 的 Tier A official outline；國語的 outline 已取得，但仍必須取得 L01 合法 text-structure brief。完成一科的一個 Golden vertical slice 後，才可進 NotebookLM／YouTube。
