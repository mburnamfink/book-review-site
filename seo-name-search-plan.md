# Plan: Rank burrowedbooks.com for "Michael Burnam-Fink"

**Goal:** When someone searches *Michael Burnam-Fink*, get burrowedbooks.com onto page 1 (ideally
top 3) and, longer term, tied to a Google entity/knowledge panel — displacing decade-old academic
affiliations (Academia.edu/ASU, ResearchGate, CSPO, Breakthrough Institute) from the top.

This is a legitimate own-your-name request: the subject is the only person with this exact
hyphenated, non-standard-spelling name and owns the site.

## Current state (verified Aug 2026)

- Site is **live and indexed** at `https://www.burrowedbooks.com/` (title: "Book Reviews — Burrowed Books", ~1,838 reviews).
- **Apex `burrowedbooks.com` does not resolve** (DNS `ENOTFOUND`). Only `www` works. This splits/loses link equity and risks the wrong host being canonical.
- **Page 1 for the bare name** is dominated by: Academia.edu (ASU), LinkedIn, Breakthrough Institute, Medium, Goodreads, X/Twitter, ResearchGate, CSPO, and **mburnamfink.com** (a second site the subject owns). Burrowed Books is **not** on page 1 for the name alone.
- The name "Michael Burnam-Fink" appears as crawlable text on the site essentially **only in the footer copyright**. The About page never states the name.

### Technical-SEO defects in the codebase (Astro project at `site/site/`)

1. `astro.config.mjs` → `site: 'https://burrowedbooks.example'` — a **placeholder**. Breaks absolute canonical/OG URLs and any sitemap. Must be the real production origin.
2. **No sitemap** (`@astrojs/sitemap` not installed).
3. **No `robots.txt`**.
4. **No canonical link tag** in `src/layouts/Base.astro`.
5. **No structured data** (JSON-LD) anywhere — no `Person`, no `WebSite`, no author markup. This is the single biggest missed lever for a name query.
6. Thin `<head>`: has `og:title/description/image` but **no** `og:url`, `og:type`, `og:site_name`, Twitter card, or `<meta name="author">`.
7. About page (`src/pages/about.md`) does not contain the subject's name or a real bio linking out to their other profiles.

## Strategy

Ranking for a personal name is **entity/reputation SEO**, not keyword volume. Three levers, in order of leverage:

1. **Establish the site as *the* home of the named person** (on-page): a real bio/author page with the name in `<title>`/`<h1>`/body, plus `Person` + `WebSite` JSON-LD carrying `sameAs` links to every profile that already ranks. This tells Google "this domain = this person."
2. **Fix crawlability** so Google can see and trust all of the above (canonical domain, sitemap, robots, correct `site:`).
3. **Reciprocal links (`sameAs` both directions)**: point the already-ranking profiles *back* at burrowedbooks.com, and resolve the mburnamfink.com split. Google merges the entity from consistent bidirectional links; these off-site edits often move the needle more than on-page work.

Then register with Google Search Console and let indexing + authority accrue. Realistic timeline: indexing/rich results in days–weeks; page-1 movement for the exact name over 1–3 months; a knowledge panel is possible but not guaranteed.

---

## Phase 1 — Technical foundation (code) — ✅ DONE (deploy pending)

All paths under `site/site/`. Verified in the build output; ships on next Cloudflare Pages deploy.

- **1.1 ✅ Canonical origin** — `astro.config.mjs` → `site: 'https://www.burrowedbooks.com'`.
- **1.2 ✅ Sitemap** — installed `@astrojs/sitemap`, added to `integrations`. Emits `dist/sitemap-index.xml` → `sitemap-0.xml` with absolute www URLs.
- **1.3 ✅ robots.txt** — `src/pages/robots.txt.ts` emits `Allow: /` + `Sitemap:` line.
- **1.4 ✅ `<head>`** (`src/layouts/Base.astro`, wraps every route via `Page.astro`) — added `canonical`, `og:url`, `og:type`, `og:site_name`, `twitter:card`, `<meta name="author">`, and made `og:image` absolute against `Astro.site`.

### 1.5 — Fix the apex domain — ✅ DONE (via Pages custom domain)
`burrowedbooks.com` (apex) previously did not resolve (no DNS record), returning a broken/522 state. Resolved by adding **`burrowedbooks.com` as a custom domain on the Cloudflare Pages project**, so the apex now resolves and serves the site (HTTP 200). Verified live.

- The apex serves the same site as www; SEO consolidation onto www is handled by the `rel=canonical` / `og:url` tags (every page, including apex-served ones, points at `https://www.burrowedbooks.com/…`). Google treats canonical as a valid substitute for a 301.
- A hard apex→www **301 Redirect Rule was attempted but never deployed successfully** (stuck as draft / not in the live ruleset — Cloudflare Trace showed no redirect-rule match). It is **not needed**; canonical tags cover it. Only revisit if a literal 301 is later desired.

---

## Phase 2 — Make the site *about the person* (code + content)

**Status:** 2.1 ✅ done · 2.2 ✅ done · 2.3 optional/pending. Verified in build output (About `<title>`/`<h1>` = "About Michael Burnam-Fink"; valid `WebSite`+`Person` JSON-LD with 9 `sameAs` entries emitted site-wide via `Base.astro`). Ships on next deploy.

### 2.1 About page (`src/pages/about.md`) — name in metadata, original prose preserved
Owner wants the visible About prose kept in its original human voice — **no** name-forward lede and **no** visible "Find me elsewhere" list. So the name/entity signal lives in machine-facing surfaces only (all legitimate — NOT cloaking):
- `title: About Michael Burnam-Fink` → drives the `<title>` and the Google result headline.
- `heading: About` → `Page.astro` uses `frontmatter.heading ?? frontmatter.title` for the visible `<h1>`, so the heading stays plain "About" while the `<title>` carries the name.
- `description:` names Michael Burnam-Fink (meta description / SERP snippet).
- Profile links are carried by the JSON-LD `sameAs` (§2.2), which is invisible to readers — no visible link list needed. Do **not** add hidden/visually-suppressed text for crawlers (cloaking; against Google guidelines).
- The site footer already prints "Michael Burnam-Fink" as visible crawlable text on every page, covering the on-page visible-name signal.

### 2.2 Add `Person` + `WebSite` JSON-LD (highest-leverage on-page change)
Emit once site-wide (e.g. in `Base.astro`, or a dedicated `<SiteSchema>` component). `sameAs` is the critical field — it lists every profile that currently outranks the site, telling Google they're the same entity:
```html
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.burrowedbooks.com/#website",
      "url": "https://www.burrowedbooks.com/",
      "name": "Burrowed Books",
      "author": { "@id": "https://www.burrowedbooks.com/#person" }
    },
    {
      "@type": "Person",
      "@id": "https://www.burrowedbooks.com/#person",
      "name": "Michael Burnam-Fink",
      "url": "https://www.burrowedbooks.com/about/",
      "jobTitle": "Machine Learning Engineer",
      "sameAs": [
        "https://www.linkedin.com/in/mburnamfink/",
        "https://www.goodreads.com/user/show/4828849-michael-burnam-fink",
        "https://medium.com/@mburnamfink",
        "https://bsky.app/profile/mburnamfink.bsky.social",
        "https://github.com/mburnamfink",
        "https://x.com/mburnamfink",
        "https://asu.academia.edu/MichaelBurnamFink",
        "https://www.researchgate.net/profile/Michael-Burnam-Fink",
        "https://www.facebook.com/mburnamfink/"
      ]
    }
  ]
})} />
```
Validate with Google Rich Results Test after deploy.

### 2.3 (Optional, strong) Byline the review/post pages
The content model already has structured authors (`src/content.config.ts`). Reviews are *by* Michael Burnam-Fink; making that explicit adds many name-bearing pages:
- Show a small "Reviewed by Michael Burnam-Fink" byline on review/post templates, and/or
- Add per-page `Review`/`BlogPosting` JSON-LD whose `author` references `#person`.
This multiplies the on-site occurrences of the name from ~0 to hundreds.

---

## Phase 3 — Off-site entity consolidation (no code; the other half of the win) — ✅ DONE

Owner reports all profile back-links updated to point at burrowedbooks.com. Google connects the entity from **bidirectional** links; these now reciprocate the `sameAs` list. Reference of what was covered:

- **LinkedIn** → add burrowedbooks.com to Contact Info / Featured / a post. (Highest authority of the group.)
- **Goodreads** profile → website field = burrowedbooks.com (natural: it's a book-review site).
- **Medium** bio, **Bluesky** profile, **X** bio, **GitHub** profile → website = burrowedbooks.com.
- **mburnamfink.com:** domain expired years ago; it no longer resolves. Nothing to do beyond keeping it out of the `sameAs` list. (If reacquiring is ever cheap, a 301 → burrowedbooks.com would recover any residual authority — but not worth pursuing.)
- Academic profiles (Academia.edu, ResearchGate) usually allow a personal-website field — add burrowedbooks.com where possible. These are the incumbents you're trying to outrank; a link from them helps merge the entity.

## Phase 4 — Google Search Console + indexing

1. Verify `https://www.burrowedbooks.com` (and the apex property) in Google Search Console.
2. Submit the sitemap.
3. Use **URL Inspection → Request indexing** for the homepage and the About page after Phase 1–2 ship.
4. Watch the **Performance** report for impressions on the query "michael burnam-fink" to measure progress.
5. Optionally add Bing Webmaster Tools (cheap, covers Bing/DuckDuckGo/ChatGPT search).

---

## Decisions (resolved)

- **D1 — Canonical host:** `www` (already indexed). Apex 301-redirects to www.
- **D2 — Hosting/DNS:** Cloudflare Pages, DNS on Cloudflare. Apex redirect and GSC verification both done in the Cloudflare dashboard (see Phase 1.5).
- **D3 — mburnamfink.com:** domain expired; dead. Dropped from all `sameAs` lists.

## Suggested order of execution

Phase 1 (config/head/sitemap/robots) → Phase 2.1–2.2 (bio + JSON-LD) → deploy → Phase 4 (GSC + request indexing) → Phase 3 (off-site links, can start in parallel) → Phase 2.3 (bylines) as a follow-up. Phases 1–2 are ~1 focused coding session; Phase 3 is manual profile edits; then it's measurement over weeks.
