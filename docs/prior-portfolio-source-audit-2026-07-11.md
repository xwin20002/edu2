# Prior Portfolio Source Audit — edu1 / edu3 → edu2

**Purpose:** recover the useful source-discovery process from earlier grade projects without copying their curriculum, source packs, videos, or textbook text into Grade 2 Semester 1.

## Evidence inspected

| Portfolio | Evidence | What it proves | What it does *not* prove |
|---|---|---|---|
| edu1 小一國語下 | `RAW資料/資源索引.md` (2026-05-24) | A working source-index pattern: local downloads, official word bank, publisher audio, publisher Wordwall, external activity candidates, version-change notes | That any 小一教材, 112 materials, questions, or artifacts apply to 小二上 |
| edu1 小一國語下 | `L6-caterpillar/source_material.md` | The source pack separated official word-bank facts from a separately identified text source, and explicitly noted when the textbook was authoritative | That a public text from another volume is licensed or equivalent for edu2 |
| Obsidian 創作庫 | `20260527_Win11-SOP驗證_L6毛毛蟲過河.md` | The same L6 workflow was preserved outside Git: official word-bank → separately identified legal text source → physical-textbook audit; it also records NotebookLM / YouTube recovery steps | That its Grade 1 source, text, artifacts or version apply to Grade 2 |
| edu3 小三下 | `CLAUDE.md`, Git commits `8fc55f4` → `ad08874` | NotebookLM artifact creation, local raw assets, unlisted YouTube integration and page-level commits were recorded | The original source set. edu3 Git history has artifact evidence but no committed curriculum-source provenance ledger |

## Recoverable method

1. **Start with official fact sources.** Education Cloud establishes lesson title/order and public word bank.
2. **Add publisher-operated media as link-only evidence.** Hanlin `聽e聽` and official Wordwall can strengthen vocabulary, listening and activity planning only after the exact Grade 2 Semester 1 lesson is checked.
3. **Use teacher/creator resources as Tier C.** The current 114 Hanlin Grade 2 site by 雄老師 HTML5 FUN and the L01 Wordwall activity are useful discovery signals, not textbook truth and not downloadable source material.
4. **Record version drift.** edu1 documented a real 112 → 114 lesson move/removal. Therefore an older matching title is not sufficient; every edu2 item needs publisher, year, grade, semester and lesson match.
5. **Do not repeat edu3's missing link.** An artifact ledger alone does not preserve where the curriculum facts came from. edu2 requires source registry + acquisition log before its NotebookLM unit artifact gate can pass.
6. **Search the entire Obsidian knowledge path.** `2ndbrain/edu2/工作筆記.md` is only the project dashboard. Phase 0 must also search `2ndbrain/創作庫/` for cockpit, subject and SOP notes; the L6 record was missed when search was limited to target-grade labels.

## New edu2 candidates, by role

| Candidate | Role in edu2 | Status |
|---|---|---|
| Education Cloud 114 Hanlin Grade 2 Semester 1 | title and public word-bank facts | verified and downloaded |
| 明湖國小 114 二上國語課程計畫 | sequence, unit themes, general objectives and extension-reading direction | verified and downloaded |
| Hanlin 聽e聽 | per-lesson listening / reading evidence | discovered; unit-level check required |
| Hanlin Primary Wordwall | publisher activity discovery | discovered; exact unit/version check required |
| 雄老師 HTML5 FUN 114 Hanlin Grade 2 | activity-format discovery and word-bank cross-check | link-only; rights review required |
| Teachersay Wordwall L01 | single lesson external activity candidate | link-only; rights/version/child-suitability review required |

## L01 smallest next evidence pack

Before rebuilding L01 as a full content page, collect and log:

1. an authorized text-structure brief or teacher-reviewed summary;
2. the exact `聽e聽` Grade 2 Semester 1 / L01 access evidence, if available;
3. any official Hanlin L01 activity URL with year/version confirmation;
4. a teacher decision on whether the Tier C candidates are external links, activity inspiration, or rejected.

Only then update `data/hanlin-114.json`, rebuild the L01 page, and generate a dedicated NotebookLM source pack and media artifact. No Grade 1/3 text, old-version item, or third-party activity answer is a substitute for item 1.
