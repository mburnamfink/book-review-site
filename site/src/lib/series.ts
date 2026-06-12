import type { CollectionEntry } from 'astro:content';

export function seriesSlug(name: string): string {
  return name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export interface SeriesEntry {
  type: string;
  slug: string;
  title: string;
  authors: string[];
  rating: number | null;
  hasCover: boolean;
  seriesNumber: number | null;
}

export interface Series {
  name: string;
  slug: string;
  entries: SeriesEntry[];
}

export function buildSeries(reviews: CollectionEntry<'reviews'>[]): Series[] {
  const map = new Map<string, Series>();
  for (const r of reviews) {
    const name = r.data.series;
    if (!name) continue;
    const slug = seriesSlug(name);
    let s = map.get(slug);
    if (!s) {
      s = { name, slug, entries: [] };
      map.set(slug, s);
    }
    const parts = r.id.split('/');
    s.entries.push({
      type: parts[0],
      slug: parts[1],
      title: r.data.title,
      authors: r.data.authors
        .filter(a => a.role === 'author' || a.role === 'editor')
        .map(a => [a.first, a.last].filter(Boolean).join(' ')),
      rating: r.data.rating ?? null,
      hasCover: !!r.data.cover,
      seriesNumber: r.data.series_number ?? null,
    });
  }

  for (const s of map.values()) {
    // Order by series number; unnumbered entries fall to the end, by title.
    s.entries.sort((a, b) => {
      if (a.seriesNumber != null && b.seriesNumber != null) return a.seriesNumber - b.seriesNumber;
      if (a.seriesNumber != null) return -1;
      if (b.seriesNumber != null) return 1;
      return a.title.localeCompare(b.title);
    });
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}
