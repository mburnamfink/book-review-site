import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const contributor = z.object({
  first: z.string().optional(),
  last: z.string(),
  role: z.enum(['author', 'editor', 'contributor', 'narrator']).default('author'),
});

const readRecord = z.object({
  year: z.number(),
  date_started: z.coerce.date().optional(),
  date_finished: z.coerce.date().optional(),
  dnf: z.boolean().default(false),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/index.md', base: '../../book-review-content/reviews' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(contributor),
    type: z.enum(['book', 'audiobook', 'rpg', 'other']),
    isbn: z.preprocess(v => v ?? undefined, z.coerce.string().optional()),
    publication_year: z.preprocess(v => v ?? undefined, z.number().optional()),
    publisher: z.preprocess(v => v ?? undefined, z.string().optional()),
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
    system: z.string().optional(),
    format: z.string().optional(),
    // other
    medium: z.string().optional(),
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

export const collections = { reviews, booksOfYear };
