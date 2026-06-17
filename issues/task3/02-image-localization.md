# Slice 2 — Remote image localization (localize_images.py)

Type: AFK
Ready for agent.

## Parent

`site/todo-task3-prd.md` — Review Text Cleanup (Task 3).

## What to build

A script `review_cli/scripts/localize_images.py` (dry-run by default, `--apply` to write) that
downloads live remotely-hosted markdown images into their review's directory and rewrites the
markdown to a relative path. Built over a pure `image_localizer` naming core (filename/extension
logic split from the HTTP I/O).

In scope: live remote markdown images `![alt](http(s)://…)` (currently 2).

Behavior:
- Download into the review dir as `img-N.<ext>`; extension from HTTP `Content-Type`, falling back
  to URL suffix, then `.jpg` (one source URL has no extension).
- Rewrite markdown to the relative path; preserve alt text verbatim.
- Insert `<!-- img: <original-url> -->` adjacent to the localized image (existing convention) as a
  fallback record.
- Use a real User-Agent and a timeout. On failure (non-200, timeout, non-image content-type),
  leave the original remote link untouched and report it — never produce a dead relative link.
- Pre-existing `<!-- img: … -->` comments: **report only** (count + URLs); never acted upon.

After `--apply`: `uv run review validate`, then `cd site/site && npm run build`.

## Acceptance criteria

- [ ] Live `![](http(s)://…)` images downloaded into the review dir as sequential `img-N.<ext>`.
- [ ] Extension derived from `Content-Type`, then URL suffix, then `.jpg`.
- [ ] Markdown rewritten to relative path; alt text preserved; `<!-- img: <url> -->` fallback added.
- [ ] Failed downloads leave the original link and are reported; no dead relative links.
- [ ] Pre-existing `<!-- img: -->` comments reported (count + URLs), not modified.
- [ ] Dry-run by default; `--apply` required; content dir via `Config.load()`; durable change log.
- [ ] Unit tests on `image_localizer` naming: content-type extension when URL has none, URL-suffix and `.jpg` fallbacks, sequential `img-N` numbering.
- [ ] `uv run review validate` and `npm run build` pass after `--apply`.

## Blocked by

- Slice 0 — Shared foundation (`00-shared-foundation.md`), for the shared change log.
