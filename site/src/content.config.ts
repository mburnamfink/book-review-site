import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const contributor = z.object({
  first: z.string().optional(),
  last: z.string(),
  role: z.enum(['author', 'editor', 'contributor', 'narrator', 'illustrator', 'translator']).default('author'),
});

const readRecord = z.object({
  year: z.number(),
  date_started: z.coerce.date().optional(),
  date_finished: z.coerce.date().optional(),
  dnf: z.boolean().default(false),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/index.md', base: '../content/reviews' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(contributor),
    type: z.enum(['book', 'audiobook', 'rpg', 'other']),
    isbn: z.preprocess(v => v ?? undefined, z.coerce.string().optional()),
    publication_year: z.preprocess(v => v ?? undefined, z.number().optional()),
    publisher: z.preprocess(v => v ?? undefined, z.string().optional()),
    series: z.preprocess(v => v ?? undefined, z.string().optional()),
    series_number: z.preprocess(v => v ?? undefined, z.number().optional()),
    rating: z.preprocess(v => v ?? undefined, z.number().min(1).max(5).optional()),
    date_reviewed: z.coerce.date(),
    reads: z.array(readRecord).min(1),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    og_cover: z.string().optional(),
    // book
    page_count: z.number().optional(),
    // audiobook
    narrator: contributor.optional(),
    runtime_hours: z.number().optional(),
    abridged: z.boolean().default(false),
    // rpg
    system: z.preprocess(v => v ?? undefined, z.string().optional()),
    format: z.preprocess(v => v ?? undefined, z.string().optional()),
    // other
    medium: z.preprocess(v => v ?? undefined, z.string().optional()),
    // bluesky
    bsky_post: z.preprocess(v => v ?? undefined, z.string().optional()),
  }),
});

const booksOfYear = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/books-of-year' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    description: z.string().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    // Optional social-share image. Root-relative path (e.g. /posts/foo.png)
    // or absolute URL; resolved against `site` in posts/[slug].astro.
    image: z.string().optional(),
    // Renders top-level blockquotes as interview questions with generated Q/A markers.
    interview: z.boolean().default(false),
  }),
});

export const collections = { reviews, booksOfYear, posts };
