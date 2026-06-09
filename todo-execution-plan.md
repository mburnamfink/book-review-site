# Execution Plan — Organizational Improvements & New Features

Plan for the `# Organizational Improvements` and `# New Features` sections of
[todo.md](todo.md). The `# Content` section is excluded (hand-written by the author).

## Project facts (for a fresh agent)

- **Site**: Astro static site at `site/site/`. Pure static output — no SSR adapter, no
  serverless backend today. Deploys from GitHub repo `mburnamfink/book-review-site`.
- **Content**: reviews live at `site/content/reviews/{type}/{slug}/index.md` with
  `cover.jpg` / `og-cover.jpg` alongside. Types: `book` (1735), `audiobook` (25), `rpg` (57).
  URL of a review is `/{type}/{slug}/`.
- **Schema** is defined in **two** places that must stay in sync:
  - `site/site/src/content.config.ts` (Zod, used by Astro at build)
  - `review-cli/src/review/models.py` (Pydantic, used by the CLI's `validate`)
- **Review page template**: `site/site/src/pages/[type]/[slug].astro` (renders meta table,
  stars, and the existing Bluesky discussion block).
- **review-cli**: Python tool in `review-cli/`. Run everything with `uv run python` /
  `uv run review …` (never bare `python`). Commands: `new, edit, add-read, fetch-cover,
  process-cover, list, validate, init`. Slug logic: `src/review/slug.py`.
- **Data exports** in `review-cli/import/`: `goodreads_library_export (1).csv` and
  `storygraph.csv`. Goodreads `Title` embeds series as `Title (Series Name, #N)`.
  `diff_year.py` already has a reusable `normalise(title)` helper for CSV↔review matching.
- After any content/schema change, run `uv run review validate` and `npm run build`
  (in `site/site/`) to confirm nothing breaks.

## Decisions already made (do not re-litigate)

- **Type reclassification changes URLs and that is acceptable** — just move the directory;
  no redirects needed.
- **This is a one-time cleanup of ~30 items, not recurring** — handle it with a throwaway
  script, not a new `review` subcommand.
- **`narrator`/`runtime_hours` are populated, not left blank** — but via a pre-populated CSV the
  author fills in by hand (this is the bulk of the effort), then a script writes them back. Same
  CSV-roundtrip pattern as the series work (Task 4).
- **Social integration = full multi-auth + DB** (Google / Facebook / ATProto OAuth, real
  likes + comments). This requires new infrastructure — see Task 5.

---

## Task 1 — Reclassify misclassified reviews (book ↔ audiobook)

Two lists in todo.md:
- **"actually a book"** — 4 dirs currently under `audiobook/` that should be `book/`:
  `the-bridge-at-dong-ha-miller`, `second-variety-dick`, `hell-divers-smith`,
  `children-of-ruin-tchaikovsky` (all confirmed present).
- **"Actually Audiobooks"** — ~26 titles currently under `book/` that should be `audiobook/`,
  given by title only (e.g. "The Achilles Trap", "Small Things Like These", …). Slugs must be
  resolved by matching title → review dir.

**Approach — one-time throwaway scripts in `review-cli/tools/`, driven by the two hard-coded
lists.** Three phases; the manual CSV fill is the real work.

**Phase A — move + retype (mechanical, scripted).** For both lists:
1. Resolve each item to its review dir. The "actually a book" 4 are explicit slugs. For the ~26
   audiobook titles (given by title only), match title → `book/{slug}/index.md` using
   `normalise(title)` from `diff_year.py`; print each resolved match for a quick eyeball before
   moving (avoids mis-hits across 1735 books).
2. Rewrite `type:` in the front matter to the new value, then move the directory from
   `{old_type}/{slug}` to `{new_type}/{slug}` (cover files move with it).
   - **Keep the existing slug** — don't rename to the canonical audiobook slug (which would
     append the narrator). Renaming is unnecessary churn and the narrator isn't known yet. The
     directory name need not match `slug.py`'s audiobook convention.

**Phase B — build the narrator/runtime CSV (scripted).** Emit
`reclassify_audiobooks.csv` with one row per newly-reclassified audiobook, pre-populated with
`slug, author, title` and **blank `narrator` and `runtime_hours` columns**. The author fills the
two blank columns by hand (this is the time-consuming part).

**Phase C — write CSV back into front matter (scripted).** Read the finalized CSV and write
`narrator` (as a contributor with `role: narrator`) and `runtime_hours` into each review's front
matter. Then `uv run review validate`.

**Files**: throwaway scripts under `review-cli/tools/` (e.g. `reclassify.py`,
`apply_audiobook_meta.py`) + the generated `reclassify_audiobooks.csv`. No changes to
`cli.py` / `slug.py`.

---

## Task 2 — Fix covers

Two sub-tasks in todo.md: download missing covers, and find/replace bad covers.

- **Missing covers** — just produce a **list**. The automated fetch pipeline has already been
  run and exhausted its hits, so do **not** re-run it. 133 of 1735 `book/` dirs lack
  `cover.jpg`; scan `audiobook/` and `rpg/` too. Emit `missing_covers.txt` (one
  `{type}/{slug}` — and `title` for legibility — per line) for the author to source covers by
  hand. A `find_missing_covers.py` already exists in `review-cli/missing_covers/`; extend it to
  cover all `{type}/` dirs and write the list. That's the whole task — no fetching.
- **Bad covers** (poor photography / wrong book) — inherently a judgement call, not fully
  automatable. Provide assistance, not full automation:
  1. Generate a contact-sheet HTML page that tiles every `cover.jpg` with its title for fast
     visual scanning (a small script writing one `<img>` grid). Author flags bad ones.
  2. The author sources a better image by hand and replaces it via
     `review process-cover {SLUG} file.jpg` (same manual path as missing covers).

**Files**: `review-cli/missing_covers/find_missing_covers.py` (extend to all types + write the
list); a small contact-sheet script.

---

## Task 3 — Fix typos and typology

Sub-task 1 is assistive (flag for review). Sub-tasks 2–4 are **fully automated** — they edit
files in place and each emits a **list of every review changed** (write a single
`typology_changes.md`/`.csv` log: `slug, change-type, before → after`).

1. **Common typos** (missing prepositions, dropped `-s`/`-ed`, homonyms) — *assistive only*,
   not auto-applied. A script extracts each `index.md` body (front matter stripped) and emits a
   report of `file:line: suggestion`. `codespell` for a cheap misspelling/homonym first pass;
   an LLM pass per-file for grammar / missing-word issues codespell can't catch. Author
   accepts/rejects from the queue.

2. **Book titles in italics — automate.** Build the set of known titles from the local reviews
   plus the Goodreads + StoryGraph CSV `Title` columns (strip series suffixes). For each review
   body, find occurrences of a known title in Title Case that are **not already** italic (`*…*`
   / `_…_`), bold, a heading, inside a link's anchor text, or inside a code span, and wrap them
   in `*…*`.
   - **False-positive guard**: very short / common-word titles (e.g. *Pet*, *Breath*,
     *Crossings*, *Drop*) will over-match. Require a whole-word, case-sensitive match, skip
     titles below a length/word-count threshold, and keep a small denylist. Log every change so
     these are easy to audit in the changed-reviews list.

3. **Internal links — automate, rewrite to own site.** Targets: links to `goodreads.com`,
   `storygraph.app`/`thestorygraph.com`, and `pagebound` (currently 64 goodreads links across
   ~50 reviews; 0 storygraph/pagebound today, but handle them for future-proofing). The
   **anchor text is the book title** (e.g. `[Blades in the Dark](…goodreads.com/review/show/…)`),
   so match anchor text → local review via `normalise()`. If a local review exists, rewrite the
   URL to `/{type}/{slug}/`; if not, leave the link and report it as "no local match".
   - **Also: repair internal links broken by Task 1's recategorization.** Reviews already
     contain ~9 same-site links like `](/book/{slug})` / `](/audiobook/{slug})` / `](/rpg/{slug})`.
     Any whose `{slug}` moved to a new type (the ~30 reclassified items) now 404. Re-point them
     to the correct current `/{type}/{slug}/`. Run this **after** Task 1. As a general guard,
     validate that every internal `/{type}/{slug}/` link resolves to an existing review dir and
     report any that don't.

4. **Non-local images — automate download + rewrite.** For each `![alt](http(s)://…)` in a body
   (currently 2), download the image into that review's dir (e.g. `img-1.jpg`) and rewrite the
   markdown to the relative path (same convention as `cover.jpg`). **Preserve the original URL
   as an invisible HTML comment** immediately adjacent, e.g.
   `<!-- original-image: https://… -->`, as a fallback if a download is later found broken.
   Skip/report any download that fails rather than producing a dead relative link.

**Files**: scripts under `review-cli/tools/` (e.g. `lint_typos.py`, `italicize_titles.py`,
`fix_internal_links.py`, `localize_images.py`) + the `typology_changes` log. Run
`uv run review validate` and `npm run build` after the automated passes.

---

## Task 4 — Add series and numbering info

Goal: export a CSV of all reviews sorted by author (so series cluster together), the author
**manually** fills in series + number, then a script writes that info back into the reviews. No
auto-population from external sources — the author enters series/number by hand.

**Schema change** (required, both files kept in sync):
- Add optional `series: string` and `series_number: number` (allow half/decimal like `1.5`, for
  novellas/`#2.5`) to **`content.config.ts`** (Zod) and **`review-cli/src/review/models.py`**
  (Pydantic, on `ReviewBase` so all types inherit it).
- `uv run review validate` must accept the new fields (it will, once added to the model).
- Render in the meta table in `[type]/[slug].astro` (a `Series` row: `{series} #{number}`).
- Optional follow-on (scope separately, not required for the data work): a `/series/{slug}`
  index page listing a series in number order, with the series name linked from each review.

**Workflow**:
1. **Export script** — walk every review and write `series_sheet.csv` **sorted by author
   (last, then first), then title**, with columns `slug, type, author, title, series, number`.
   `series` and `number` are left **blank** for the author to fill. Pre-fill `series`/`number`
   from any existing front-matter values so the sheet is idempotent if regenerated. `author` =
   the primary author's display name; `slug` is the write-back key (`{type}/{slug}`).
2. **Manual step** — author fills `series` and `number` in the CSV.
3. **Write-back script** — read the finalized CSV and write `series` / `series_number` into each
   review's front matter (skip rows left blank; only touch rows that gained a value). Default to
   a dry-run that prints the diff; apply with `--apply`. Report every review changed.
4. `uv run review validate` + `npm run build` (in `site/site/`).

**Files**: schema (`content.config.ts`, `models.py`), template (`[type]/[slug].astro`), new
`review-cli/tools/build_series_sheet.py` and `apply_series.py`, generated `series_sheet.csv`.

---

## Task 5 — Social integration (likes + comments, multi-auth)

todo.md: "Likes, Comments, with some kind of OAuth Google/Facebook/ATProto authentication."
Decision: build the full version with a real backend and DB.

**Why this is the big one**: the site is currently 100% static with no backend. Likes and
comments with authentication require persistent storage and server-side auth — static hosting
alone can't do it. There is already a **read-only Bluesky discussion thread** rendered per
review in `[type]/[slug].astro` (fetches `getPostThread` from the public API). The new feature
is a superset: first-party auth + first-party likes/comments stored in our own DB.

**Proposed architecture** (serverless, keeps the static front-end):
- **Backend**: serverless functions. Cloudflare Pages Functions + **D1** (SQLite) is the
  cheapest fit for a static site and pairs naturally with GitHub deploy; Vercel/Netlify +
  Postgres (Supabase/Neon) are equivalent alternatives. Pick one host and stick to it.
- **DB schema** (minimal):
  - `users(id, provider, provider_user_id, display_name, avatar_url, created_at)`
  - `likes(user_id, review_slug, created_at)` — unique on `(user_id, review_slug)`
  - `comments(id, user_id, review_slug, body, parent_id?, created_at)`
- **Auth**: an auth library that supports all three providers rather than hand-rolling OAuth.
  `better-auth` or `Auth.js` cover Google and Facebook out of the box; **ATProto/Bluesky needs
  its OAuth client flow** (`@atproto/oauth-client-*`) wired as a custom provider. Sessions via
  httpOnly cookie.
- **API endpoints**: `POST/DELETE /api/likes`, `GET /api/likes?slug=`, `GET/POST /api/comments`.
  Identify reviews by `slug` (the `{type}/{slug}` pair).
- **Front-end**: a small client island in the review page (or a framework component if an Astro
  integration is added) that renders the like button + comment form/list, calls the API, and
  shows logged-in state. Keep the existing Bluesky thread or fold it in as one comment source.

**Sequencing** (each is a checkpoint):
1. Choose host + DB (decision needed before building).
2. Stand up DB schema + migrations.
3. Auth with Google first (simplest), then Facebook, then ATProto.
4. Likes endpoint + UI. 5. Comments endpoint + UI (incl. moderation/delete-own).
6. Spam/abuse guards (rate limiting, length caps), then ship.

**Open decisions to resolve before coding**: hosting/DB choice; whether to retain the existing
public Bluesky thread alongside first-party comments; moderation policy.

---

## Suggested order of execution

1. **Task 1 (reclassify)** — small, self-contained, unblocks correct typing. Low risk.
2. **Task 2 (covers)** — mostly existing tooling; high visible payoff.
3. **Task 4 (series)** — schema + data; moderate, clearly scoped via the CSV source.
4. **Task 3 (typos/typology)** — assistive linting; ongoing, no hard dependency.
5. **Task 5 (social)** — largest effort and the only one needing new infra + external decisions.

After each task: `uv run review validate` (in `review-cli/`) and `npm run build` (in `site/site/`).

---

## Runbook — Tasks 1, 2, 4 (scripts written)

All scripts live in `review-cli/tools/` and are run from the `review-cli/` directory with
`uv run python …`. Scripts that modify reviews are **dry-run by default**; pass `--apply` to
write. They resolve the content dir via `Config.load()` (currently
`site/content/reviews/`). After any `--apply`, run `uv run review validate`, then
`cd ../site/site && npm run build`.

### Task 1 — reclassify book ↔ audiobook

```bash
cd review-cli
uv run python tools/reclassify.py            # dry-run: preview moves + unresolved titles
uv run python tools/reclassify.py --apply    # move dirs, rewrite type:, write reclassify_audiobooks.csv
```
- Moves 4 audiobook→book and ~22 book→audiobook; existing slugs kept (dirs may not match the
  canonical audiobook slug — fine).
- 5 todo titles are reported unresolved and intentionally skipped: *City of Last Chances* and
  *Thunder Below* are already audiobooks; *The Indifferent Stars Above*, *Worlds of Exile and
  Illusions*, and *The Hundred Years War on Palestine* are not reviewed yet (create them via
  `review new` when ready). Two title-mismatch cases (*Mastery*, *The Daughter's War*) are
  handled via `OVERRIDE_SLUGS` in the script.
- Then fill the blank `narrator` / `runtime_hours` columns in
  `tools/reclassify_audiobooks.csv` by hand and write them back:
```bash
uv run python tools/apply_audiobook_meta.py            # preview
uv run python tools/apply_audiobook_meta.py --apply    # write narrator/runtime into front matter
```
(`narrator` = free text, split on the last space into first/last; `runtime_hours` = decimal
`9.5` or `9:30`.)

### Task 2 — cover lists (list only, no fetching)

```bash
cd review-cli
uv run python tools/find_missing_covers.py     # -> tools/missing_covers.txt (all types; 166 found)
uv run python tools/cover_contact_sheet.py      # -> tools/cover_contact_sheet.html
```
Open `cover_contact_sheet.html` in a browser to scan for bad/wrong covers. Replace any cover
(missing or bad) by sourcing an image and running:
`uv run review process-cover <slug> <image.jpg>`.

### Task 4 — series & numbering

Schema/template changes are already applied (`series` + `series_number` in
`content.config.ts` and `models.py`; a `Series` row in `[type]/[slug].astro`). Then:
```bash
cd review-cli
uv run python tools/build_series_sheet.py      # -> tools/series_sheet.csv (1816 rows, sorted by author)
# … fill in the `series` and `number` columns by hand …
uv run python tools/apply_series.py            # preview the diff
uv run python tools/apply_series.py --apply    # write series/series_number into front matter
```
`number` accepts decimals (e.g. `2.5`). Rows left blank are skipped. Run Task 1 **before**
Task 4 if you want the reclassified items to carry their new `type` into the sheet.
