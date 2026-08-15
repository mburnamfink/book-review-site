import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Canonical origin. Drives canonical/og:url tags, absolute og:image URLs
  // (see posts/[slug].astro), and the generated sitemap. The apex domain
  // 301-redirects to www at the Cloudflare level.
  site: 'https://www.burrowedbooks.com',
  integrations: [mdx(), sitemap()],
  // Serve content/reviews/ as static files so cover.jpg paths like
  // /book/going-after-cacciato-obrien/cover.jpg resolve correctly.
  publicDir: '../content/reviews',
  vite: {
    server: {
      fs: {
        // Allow Astro's content layer to read files above the project root.
        allow: ['..'],
      },
    },
  },
});
