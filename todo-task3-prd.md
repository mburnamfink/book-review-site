# PRD — Review Text Cleanup (Task 3): internal links, image localization, title italics

Status: ready-for-agent
Scope: deterministic bulk passes over review bodies. Three scripts. The LLM typo pass is
**out of scope** (see below).

## Problem Statement

As the author of ~1818 hand-written reviews, my review bodies contain three classes of
mechanical inconsistency I want cleaned up without changing my writing or voice:

1. Many reviews link to **my Goodreads pages** (both `/review/show/{id}` and
   `/book/show/{id}-{slug}`) for books that **also live on this site**. Those should point at
   the local review instead of sending readers off-site.
2. A couple of reviews still embed **remotely-hosted images** (`![](https://…)`). If the remote
   host disappears or hotlink-blocks, the image breaks. They should be downloaded into the
   review's own directory and served locally.
3. I mention book titles in prose but don't always **italicize** them. I want the book each
   review is *about* to have its title italicized wherever it appears in that review's body.

These are tedious to do by hand across 1818 files and easy to get subtly wrong, so I want bulk
scripts — but with a strong bias toward **minimizing false positives** and a **durable,
human-readable audit log** of every change.

## Solution

Three focused, single-concern Python scripts in `review_cli/scripts/`, following the existing
repo convention (`reclassify.py`, `apply_series.py`, …): **dry-run by default**, `--apply` to
write, each emitting a durable human-readable change log. Each script is a thin CLI over a deep,
unit-tested core module.

1. `fix_internal_links.py` — rewrite Goodreads links to local reviews when a confident match
   exists; leave + report the rest.
2. `localize_images.py` — download live remote images into the review dir and rewrite to a
   relative path; report failures and pre-existing commented-out image URLs.
3. `italicize_titles.py` — italicize each review's **own** book title in its own body, using
   dictionary + mid-sentence-capitalization signals to keep false positives near zero; report
   the judgment-call residue for manual handling.

## User Stories

1. As the author, I want links to my own Goodreads reviews (`/review/show/{id}`) replaced with
   the corresponding local review URL, so readers stay on my site.
2. As the author, I want Goodreads `/book/show/{id}-{slug}` links also internalized **when** I
   have a local review of that book, so I capture the easy matches the URL slug makes reliable.
3. As the author, I want storygraph/pagebound links handled by the same rules (future-proofing),
   even though there are none today.
4. As the author, I want links matched by multiple strategies — URL slug, normalized title, then
   fuzzy match — so I catch as many as possible.
5. As the author, I want **exact** matches (URL-slug-equals-local-slug, or normalized-anchor-
   equals-normalized-title) auto-applied, because their false-positive risk is near zero.
6. As the author, I want **fuzzy** match candidates written to the log as *proposed but not
   applied*, with their similarity score and target (author + title), so I approve them by hand.
7. As the author, I want anchors that are descriptive phrases or author surnames
   (e.g. "radar-assisted naval gunfire", "Kemper") that match nothing reported as "no local
   match" and left untouched.
8. As the author, when a link is rewritten I want only the **URL** changed, never the anchor
   text (so `[Vol 1](…)` stays "Vol 1", just re-pointed).
9. As the author, I want the link log to record, per change: the review being changed, the
   original link text with a few surrounding sentences, and the new target (author + title).
10. As the author, I want the two live remote `![](https://…)` images downloaded into their
    review directory and the markdown rewritten to the relative path, so images are self-hosted.
11. As the author, I want the original remote URL preserved next to the localized image as an
    HTML comment using the existing `<!-- img: <url> -->` convention, as a fallback record.
12. As the author, I want downloaded image filenames to be sequential (`img-1.jpg`, `img-2.png`)
    with the extension derived from the HTTP `Content-Type` (URL suffix, then `.jpg` as
    fallbacks), since one source URL has no extension.
13. As the author, I want image alt text preserved verbatim.
14. As the author, I want a failed image download (non-200, timeout, non-image content-type) to
    **leave the original link untouched** and be reported, never producing a dead relative link.
15. As the author, I want the dozens of pre-existing `<!-- img: <url> -->` comments **left
    alone** but **reported** (count + URLs), so I can decide later whether to revive any.
16. As the author, I want each review's **own** book title italicized wherever it appears in that
    review's body, so titles are styled consistently.
17. As the author, I want the main title (subtitle stripped at the first colon) matched, and if
    the full title-with-subtitle appears, the whole span italicized.
18. As the author, I want matching to be case-sensitive, whole-word/phrase, with punctuation
    normalized (`vs.`↔`vs`, `&`↔`and`, straight/curly quotes, hyphens), and **all** occurrences
    italicized.
19. As the author, I want multi-word titles auto-italicized (minus a small generic-phrase
    denylist), since they rarely collide with ordinary prose.
20. As the author, I want single-word titles auto-italicized **only** when the word is not a
    common English word (so *Dune*/*Nova*/*Reamde* apply; *Breath*/*Pet*/*Think* do not).
21. As the author, I want a common-word single title still auto-applied **when it appears
    capitalized mid-sentence** and matches a known title, because mid-sentence Title Case is a
    strong title signal in my writing.
22. As the author, I want the residue (e.g. a common-word title appearing only at a sentence
    start) reported for manual italicizing, not auto-changed.
23. As the author, I want italicization to **skip** matches already inside emphasis (`*…*` /
    `_…_` / `**…**`), heading lines, link anchor text, inline/fenced code, image alt text, and
    HTML comments, and to never double-wrap.
24. As the author, I want each script to be **dry-run by default** and require `--apply` to
    write, so I always preview first.
25. As the author, I want every script to resolve the content directory via `Config.load()`
    (currently `site/content/reviews/`), consistent with the other tools.
26. As the author, I want to run `uv run review validate` and `npm run build` after any
    `--apply` and have the changes pass both.
27. As the author, I want each script to also produce a durable change log file I can re-read
    later, not just stdout.

## Implementation Decisions

**Three scripts, single concern each, in `review_cli/scripts/`**, matching the existing
dry-run/`--apply`/change-log convention. No new `review` subcommands. Each is a thin CLI over a
deep core module so the logic is testable without touching the filesystem or network.

**Deep modules (testable cores):**

- **`normalise` + title/slug index** — reuse the existing `normalise(title)` helper (currently in
  `review_cli/archive/diff_year.py`; promote/import it into a shared module). Builds an index
  mapping normalized title and slug → `(type, slug, author, title)` from all local reviews.
  Shared by scripts 1 and 3.
- **`markdown_regions`** — given a body, returns the protected spans (emphasis, headings, link
  anchor text, inline/fenced code, image alt, HTML comments). Pure. Used by script 3 and
  reusable elsewhere.
- **`goodreads_link_matcher`** (script 1 core) — given a link (URL + anchor text) and the index,
  returns a match result tagged with a **confidence tier**: `exact` (URL slug == local slug, or
  normalized anchor == normalized title), `fuzzy` (similarity ≥ threshold, carries score), or
  `none`. Pure.
- **`title_italicizer`** (script 3 core) — given a body, the review's own title, a common-word
  dictionary, and the region map, returns the set of edits to auto-apply plus the manual-report
  candidates. Pure.
- **`image_localizer`** (script 2 core) — naming/extension logic (sequential index + extension
  from content-type/URL/fallback) split out as a pure function; the HTTP download is the only
  I/O.
- **`change_log`** — writes the durable per-script human-readable log.

**Script 1 — `fix_internal_links.py`:**
- In scope: Goodreads `/review/show/` and `/book/show/` URLs, plus storygraph/pagebound patterns.
- Match strategies in order: URL slug (for `/book/show/`), normalized anchor → normalized title,
  then fuzzy.
- `--apply` commits **only `exact`-tier** matches. `fuzzy` candidates are logged as
  proposed-not-applied with score + target. `none` is logged as "no local match, left unchanged."
- Only the URL is rewritten (to `/{type}/{slug}/`); anchor text is never modified.
- **Not** in scope: validating/repairing same-site `/{type}/{slug}/` links — all 12 currently
  resolve; keep this script strictly Goodreads.

**Script 2 — `localize_images.py`:**
- In scope: the live remote markdown images (`![alt](http(s)://…)`) — currently 2.
- Download into the review dir as `img-N.<ext>`, ext from `Content-Type` → URL suffix → `.jpg`.
- Rewrite markdown to the relative path; insert `<!-- img: <original-url> -->` adjacent (existing
  convention).
- Use a real User-Agent + timeout. On failure (non-200/timeout/non-image), leave original link,
  report it.
- Pre-existing `<!-- img: … -->` comments: **report only** (count + URLs), never acted upon.

**Script 3 — `italicize_titles.py`:**
- Scope: the review's **own** title only (auto-apply). Other-book mentions: report-only
  candidates, never auto-italicized.
- Main title = front-matter title truncated at first colon; italicize full title-with-subtitle
  if present, else main title.
- Matching: case-sensitive, whole-word/phrase, punctuation-normalized, all occurrences.
- Auto-apply when: multi-word (minus generic-phrase denylist) **OR** single non-dictionary word
  **OR** appears capitalized mid-sentence. Otherwise → manual-report tier.
- Skip protected regions (via `markdown_regions`); never double-wrap.

**Cross-cutting:**
- All scripts: dry-run default, `--apply` to write, `Config.load()` for the content dir, durable
  change log per script. After `--apply`: `uv run review validate`, then `cd site/site &&
  npm run build`.
- Run order recommendation: script 1 (links) before script 3 (italics), so titles used as link
  anchor text are already settled and skipped by the region guard.

## Testing Decisions

Good tests assert **external behavior** of the pure core modules on representative real inputs
drawn from the corpus — not implementation details. Follow the existing pytest style in
`review_cli/tests/` (e.g. `test_covermatch.py`, `test_staging.py`) and the `normalise` usage
patterns already exercised by the archived `diff_year.py`.

Modules to test (all four chosen):

- **`goodreads_link_matcher`** — exact slug match, exact normalized-title match, fuzzy candidate
  with score, common-word anchors that must NOT match (e.g. "Distraction", "Firefly"), and
  descriptive/author-surname anchors that resolve to `none`. Both `/review/show/` and
  `/book/show/` URL shapes.
- **`title_italicizer` + `markdown_regions`** — multi-word auto-apply; single non-dictionary word
  (Dune) applies; common-word title (Breath/Pet) suppressed at sentence start but applied
  mid-sentence; partial-title trap (Baa Baa Black Sheep vs. "Black Sheep" squadron) not matched;
  skipping of emphasis/heading/anchor/code/alt/comment regions; no double-wrap; punctuation
  normalization (`vs.`/`vs`, `&`/`and`).
- **`normalise` + title index** — normalization equivalences and title/slug lookup hits/misses.
- **`image_localizer` naming** — extension from content-type when URL has none; URL-suffix and
  `.jpg` fallbacks; sequential `img-N` numbering.

## Out of Scope

- **Typo / grammar / missing-word correction (original Task-3 item #4).** Deferred entirely — it
  is the LLM-driven, judgment-heavy, assistive piece and is being left out of this PRD.
- Reviving pre-existing `<!-- img: … -->` commented-out images (report only).
- Repairing/validating same-site `/{type}/{slug}/` internal links (none broken today).
- Italicizing **other** books' titles automatically (report-only candidates at most).
- Rewriting link anchor text.
- Any schema, template, or `review` subcommand changes.

## Further Notes

- Publishing: written to this local markdown file; no GitHub tracker is configured (`gh` not
  installed, triage vocabulary not set up). Run `/setup-matt-pocock-skills` + install/auth `gh`
  later if you want this as a tracked issue with the `ready-for-agent` label.
- Corpus facts observed while scoping: ~64 Goodreads links across ~50 reviews; 2 live remote
  images; dozens of `<!-- img: -->` comments (mostly dead/ephemeral hosts); 267 single-word and
  412 two-word main titles, single-word set heavy with common English words.
- Existing convention reference: `review_cli/scripts/` tools are run from `review_cli/` with
  `uv run python scripts/<name>.py [--apply]`.
