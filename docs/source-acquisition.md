# Source Registry & Download Provenance

這是 edu2 Phase 2 的 **source traceability contract**。目標是下次重新蒐集相近教材、網站、創作者或 YouTube 影片時，不必重新從零搜尋，也不會把「看過」誤當成「可用」。

## Two committed records

- `data/source-registry/<subject>-<grade-band>-<year>.json`：可重用來源名單、分級、適用範圍與禁止用途。
- `data/source-acquisition-log.json`：每次下載、轉檔或只發現未下載的候選來源。

Raw PDF、HTML、影音與付費教材放在 ignored `source/`，不可直接提交 Git；但其 URL、取得日期、相對路徑、hash、權利狀態、用途與 review 結論必須提交到 provenance log。

## Required source tiers

| Tier | Meaning | Can establish curriculum facts? | Default action |
|---|---|---:|---|
| A | 教育部／教育雲／出版社等正式公開來源 | Yes, but only inside documented scope | Download snapshot, hash, log, review |
| B | 公開學校課程計畫 | Only sequence, general goals and public extensions | Download, hash, log, cross-check with Tier A |
| C | 教師網站、YouTuber、社群資源 | No | Register first; check rights/version/child suitability before linking; do not download or embed by default |

## Every acquisition

1. Search the registry first. Prefer a listed Tier A source; use the query templates for a new candidate.
2. Before download, record the candidate's publisher/version/grade/semester match and rights status. A same-title result is not enough.
3. Save the raw file under `source/<owner-or-type>/`; keep it out of Git.
4. Run the recorder. It calculates a SHA-256 and appends a committed provenance record.

```bash
node scripts/record-source-acquisition.mjs \
  --source-id education-cloud-hanlin-114-wordbank \
  --url 'https://example.invalid/source' \
  --file source/official/example.html \
  --role '公開詞彙表' \
  --rights 'public-reference-not-textbook-license' \
  --review verified
```

5. For a candidate that is *not* downloaded (especially a YouTube creator), add `action: discovered-no-download` manually to the log, with `rightsStatus: unknown-review-required` until reviewed.
6. Only after the unit's source review passes may the data enter a NotebookLM pack. A source link, screen capture, or search result never authorizes reconstructing copyrighted textbook prose.

## Video / creator review checklist

Before linking a third-party video to a lesson, record the channel, exact URL, retrieval date, publisher/version match, audience suitability, rights/embedding status, teacher review, and intended role. The role must be one of `supplement`, `activity-inspiration`, or `external-reference`—never `lesson-fact` unless Tier A/B evidence independently confirms it.

Do not download and re-upload third-party YouTube content. An edu2 generated video is uploaded only after its own verified source pack and artifact QA pass.

## Current Chinese finding

`gsyan-html5-fun-hanlin-grade2-114` is a recent teacher resource that lists 12 lesson-aligned activities for 114 Hanlin grade 2 Chinese. It is intentionally logged as **link-only / rights-review-required**. It is useful for finding activity formats (stroke order, zhuyin, sentence ordering, punctuation and word formation), not for replacing textbook source data.

The prior-portfolio audit is recorded in `docs/prior-portfolio-source-audit-2026-07-11.md`. Its practical rule is important: edu1 had real 112 → 114 lesson changes, while edu3 recorded completed artifacts without a committed source provenance ledger. Treat prior projects as workflow evidence, never as curriculum evidence.
