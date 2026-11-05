# Aid Withdrawal Speech: RA coding app

Live: https://cobrienudry.github.io/aid-withdrawal-speech/

RAs see one news article at a time with the speech acts extracted from it. They choose a task:

- **All categories, speech by speech**: mark every category that applies to each speech act
  (keys 1–3, 0 = none of these, X = not a speech act).
- **One category** (e.g. *Pain only*): for each speech act, decide whether that category is
  present (1/Y) or not (0/N), plus X = not a speech act.

Follow-up questions appear under a category whenever it is marked present. Each article × task is
its own unit of work, with its own queue position, save and double-coding, so RAs can be assigned
to different tasks and switch between them. Same workflow as the Cape Town PV
labelling page: a coder code, a shared queue, and ~15% of articles double-coded for agreement.

| File | What it is |
|---|---|
| `index.html` | the app (vanilla JS, no build step) |
| `assets/codebook.js` | **categories and follow-up questions**: edit here, bump `CB_VERSION` |
| `assets/config.js` | where codes are saved (`BACKEND_URL`) |
| `data/index.json`, `data/acts/*.json`, `data/text/*.json` | full coded corpus: 7,097 articles, 36,225 speech acts (index + 100 shards loaded on demand); built by `build_speech_coding.py` in the parent project from `media2_coded_corpus_260920_full.xlsx`. The 559 Nov26-sample articles (`pool = nov26`) are served first |
| `backend/Code.gs` | Google Apps Script that saves codes to a Google Sheet |

Each article shows its country, media outlet, date and language, and RAs can open the **full
article text** (with an English translation where the article is not in English; speaker names
highlighted). Full text lives in `data/text/` and loads only on click. This repo is public, so that
text is publicly reachable; `robots.txt` and a `noindex` tag ask search engines not to index it.
Speech acts are shown in English (translated where needed), with the speaker split into name and title.

## Where codes are saved

**Without a backend** (`BACKEND_URL: ""`, the current setting) each RA's codes stay in their
browser. They press **Download my codes** and send you the CSV. There is no shared queue, so
give each RA a different computer/browser and expect overlap; double-coding is not coordinated.

**With the Google Sheet backend** (recommended) codes save centrally, the queue is shared,
and double-coding works. Setup, once:

1. Create a new Google Sheet (e.g. "Aid speech codes"). Open **Extensions → Apps Script**.
2. Replace the editor contents with `backend/Code.gs` and save.
3. **Project Settings → Script properties → Add**: `KEY` = a random string (e.g. `k7m2q9xv4p`).
4. **Deploy → New deployment → Web app**. Execute as: **Me**. Who has access: **Anyone**.
   Authorize it, then copy the web app URL (ends in `/exec`).
5. Paste that URL into `BACKEND_URL` in `assets/config.js`, commit and push.
6. Send RAs the link with the key: `https://cobrienudry.github.io/aid-withdrawal-speech/#k=k7m2q9xv4p`.
   They open it once per computer; the key is remembered and removed from the address bar.

The sheet gets three tabs: `claims` (who is coding what), `saves` (latest save per coder ×
article, which the app reloads from) and `acts <codebook version>`, one readable row per coder ×
speech act, which is the analysis file. A new `acts` tab starts when `CB_VERSION` changes.
If you change `Code.gs`, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

## Output columns

`coder, task, article_id, pool, stratum, country, source, date, url, title, act_n, speaker, speaker_name, speaker_title, speech, categories,`
then one 0/1 column per category (blank when the task did not judge that category: in a single-category task only that category and `bad` are coded) and one column per follow-up question (e.g. `pain.aid_specific`,
`pain.blame`, `accommodation.type` with multiple answers joined by `|`), then
`article_note, codebook_version, saved_at`. `article_id` and `act_n` match `article_id` and
`speaker_n` in `speech_Nov26.csv` / `speech_Nov26_french.csv`.
