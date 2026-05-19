import { defineConfig } from 'astro/config';

export default defineConfig({
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
