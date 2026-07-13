# RAWdata Taxonomy

`source/` is ignored by Git, but the project still needs a stable local RAW data layout. Use this taxonomy before downloading or converting any source.

## Folder Pattern

```text
source/RAWdata/<subject>/<publisher>/<academicYear>/<purpose>/
```

Examples:

- `source/RAWdata/chinese/hanlin/115/official-outline/`
- `source/RAWdata/chinese/hanlin/115/cross-year-candidates/`
- `source/RAWdata/chinese/hanlin/115/rejected/`
- `source/RAWdata/math/kanghsuan/115/official-candidates/`
- `source/RAWdata/life/nani/115/official-outline/`

## Purpose Rules

| Purpose | Meaning | Can Promote Content? |
| --- | --- | --- |
| `official-outline` | Exact year/grade/semester/publisher outline source | Metadata only until unit brief exists |
| `official-candidates` | Official source that is useful but incomplete | No |
| `education-cloud` | Public word-bank snapshots | Only within exact matching year; historical data stays historical |
| `school-plan` | Public school curriculum plans | General goals only after exact-year check |
| `cross-year-candidates` | Same-title or adjacent-year evidence | No; workflow hints only |
| `rejected` | Failed exact-year/version/rights check | No; negative evidence only |

## Committed Records

- `data/rawdata-index.json` records the local taxonomy and current collection status.
- `data/source-acquisition-log.json` records URL, local path, hash, rights status and review result.
- `data/source-registry/` records reusable source candidates and forbidden uses.

No raw PDF, HTML, MP4, MP3, or textbook snapshot is committed. If a raw file moves, update all three committed records before using the source.

## Current Priority

For Chinese, the missing item is not the official outline. The missing item is a lawful 115 Hanlin grade 2 semester 1 unit brief for L01 `我的心情`, with enough information to build original teaching activities without reproducing textbook prose.
