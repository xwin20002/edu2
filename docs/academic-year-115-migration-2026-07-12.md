# edu2｜115 學年度版本切換

## Verified baseline

桃子腳國民中小學公開的 115 學年度教科書版本表，標示小二上採用：

| 科目 | 出版社 | 狀態 |
| --- | --- | --- |
| 國語 | 翰林 | publisher verified；逐課目錄待核對 |
| 數學 | 康軒 | publisher verified；逐單元目錄待核對 |
| 生活 | 南一 | publisher verified；逐主題目錄待核對 |

來源：<https://www.tykjh.ntpc.edu.tw/p/426-1000-59.php>（115/6/17 課發會通過）。

## Migration decision

1. `data/catalog.json` 的 project year 切為 115，首頁基準切為「115 學年校訂組合」。
2. 115 正式目錄未查證前，三科首頁導覽均維持 `awaiting-catalog`；既有 114 連結不在 115 首頁啟用。
3. 114 的 `data/hanlin-114.json`、國語 intake、NotebookLM overview 與舊生成頁保留為 historical reference，不得重新標示為 115。
4. 115 的每一科都必須重新取得 Tier A official outline；國語另需逐課詞彙／合法 text-structure brief，數學與生活各自建立出版社正確的 Golden source pack。

## First 115 gates

1. 國語：教育雲或翰林公開 115 二上目錄 → source intake → L01 source brief。
2. 數學：康軒 115 二上目錄 → U01 `math-lower-primary` Golden。
3. 生活：南一 115 二上目錄 → T01 `life-lower-primary` Golden。

The publisher table establishes the publisher choice only. It does not license or establish unit titles, textbook prose, exercises, or media artifacts.
