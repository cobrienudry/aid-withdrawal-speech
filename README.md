# Aid Withdrawal Speech: RA coding site

Static GitHub Pages site for research assistants coding speech acts in African
news articles (Oct 2024 – Oct 2025) by theme.

- `index.html` – RA instructions
- `codebook.html` – codebook, rendered from `assets/codebook.js`
- `code.html` – the coding tool (vanilla JS, no build step)
- `assets/codebook.js` – **single source of truth** for speaker types, themes and sub-codes. Bump `VERSION` when you change it.

## Data is not in this repo

Article text is scraped news content, so it is **not** published here. Batch
files (`EN-B01.json` … `FR-B20.json`, ~25 articles each) are built locally by
`build_ra_batches.py` (in the parent project) and handed to RAs privately. The tool
reads them in the browser; nothing is uploaded.

## RA output

Each RA exports `<batch>_<initials>_<timestamp>.csv`: one row per speech act
(articles with no acts get one row with `act_n = 0`), plus a JSON backup that
can be reloaded to resume. Columns include `codebook_version`, `article_id`
(e.g. `EN-0042` = row 43 of the source xlsx), speaker fields, `quote`,
`primary_theme`/`primary_sub`, `secondary_theme`/`secondary_sub`, `confidence`.
