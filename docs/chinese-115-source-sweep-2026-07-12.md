# Chinese 115 Source Sweep｜2026-07-12

This sweep records the strengthened search after RAWdata was reorganized. It is a source-gate report, not a content draft.

## Current Gate

- Subject: Chinese / Hanlin / Grade 2 / Semester 1 / Academic Year 115
- Current lifecycle: `official-outline-verified-content-pending`
- Next promotion target: L01 `fallback-brief-approved`, then a clearly labeled fallback vertical slice

## Confirmed Sources

| Source | RAWdata Path | Result | Promotion |
| --- | --- | --- | --- |
| Hanlin 115 low-primary textbook introduction PDF | `source/RAWdata/chinese/hanlin/115/official-outline/` | Page 5 confirms Grade 2 Semester 1 Chinese themes, 12 lesson titles, authors, genres, and reading items. | Outline metadata only |
| Education Cloud 115 Grade 2 Hanlin Chinese query | `source/RAWdata/chinese/hanlin/115/education-cloud-candidates/` | Snapshot returns Academic Year 115 Semester 1, but no Grade 2 Hanlin lesson records; page content says the target word has not been collected. | Negative evidence only |
| Pingtung public 114 Hanlin Grade 2 Chinese plan | `source/RAWdata/chinese/hanlin/115/cross-year-candidates/` | Cross-year L01 candidate with general learning signals: recognize emotion, use complete sentences, use sentence patterns to record feelings. | Candidate only; not 115 |
| Taipei TLSPS candidate | `source/RAWdata/chinese/hanlin/115/rejected/` | URL/search looked like 115, but internal document year is 114. | Rejected for 115 use |

## Search Conclusion

The project has found the correct 115 Hanlin Grade 2 Semester 1 Chinese outline. It has not yet found a legally usable 115 L01 text-structure brief, vocabulary list, zhuyin list, character list, textbook prose, or unit-level NotebookLM source pack.

## User Fallback Decision

On 2026-07-12, the user explicitly accepted using 114 information as a fallback basis. This changes the practical build path:

- The project may build an original L01 teaching layer from 114 same-publisher / same-grade / same-semester / same-title evidence.
- The page, source pack, and artifact records must be labeled `114-fallback / 115-candidate`.
- This does not upgrade the material to official 115 content.
- Textbook prose, exercises, teacher manual content, publisher audio, and protected images still must not be reproduced.

## Safe Next Searches

Use these exact targets before generating any Chinese cockpit content:

1. `115 翰林 二上 國語 第一課 我的心情 課程計畫`
2. `115 學年度 二年級 國語文 翰林 我的心情`
3. `115 翰林 二年級 上學期 國語 生字詞彙 我的心情`
4. `我的心情 游珮芸 翰林 115`
5. Education Cloud: `category=國語&degree=2&press=翰林版&year=115_1`

Any result must pass internal-year, grade, semester, subject, publisher and rights checks before it can move beyond candidate status.

## Non-Goals

- Do not reconstruct or publish textbook prose.
- Do not promote 114 course plans to official 115 content; use them only as labeled fallback evidence.
- Do not treat Hanlin promo examples from other low-primary lessons as L01 brief.
- Do not build NotebookLM or YouTube artifacts before a lawful unit brief exists.
