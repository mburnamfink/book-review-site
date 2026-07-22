import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // TODO: set to the real production URL. Used to build absolute og:image
  // URLs for social sharing (see posts/[slug].astro).
  site: 'https://burrowedbooks.example',
  integrations: [mdx()],
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
