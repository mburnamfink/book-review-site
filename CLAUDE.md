# book-review-site

Astro site. Source lives under `site/src/`; content collections (`reviews`, `posts`, `booksOfYear`) are defined in `site/src/content.config.ts`. Build with `npm run build` (from `site/`); output goes to `dist/`.

## Deployment

Production is Cloudflare Pages, connected to this GitHub repo. **Pushing to `main` is the deploy** — it triggers a Cloudflare Pages build that deploys to the live site. The canonical URL is `https://www.burrowedbooks.com` (set as `site` in `site/astro.config.mjs`); the apex `burrowedbooks.com` 301-redirects to `www` at the Cloudflare level. There is no `wrangler`/CI config in the repo — build settings live in the Cloudflare Pages dashboard.

## Conventions

### Blockquotes vs. interview Q&A

Ordinary Markdown blockquotes (`>`) render as standard quotes everywhere. Do **not** style
`.review-body blockquote` globally as an interview Q&A — several posts use plain blockquotes.

The interview Q&A treatment (generated `Q —` / `A —` markers, question in a blockquote, answer in
the following paragraphs) is opt-in per post:

- Set `interview: true` in the post's frontmatter (field defined on the `posts` schema).
- `site/src/pages/posts/[slug].astro` adds an `interview` class to `.review-body` when the flag is set.
- The Q&A CSS is scoped to `.review-body.interview` in `site/src/styles/global.css`.

Currently only `posts/distraction-at-20-an-interview-with-bruce-sterling.md` uses it.
