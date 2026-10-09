import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { AUTHORS, CATEGORIES } from './consts';

const authorIds = Object.keys(AUTHORS) as [string, ...string[]];
const categoryIds = Object.keys(CATEGORIES) as [string, ...string[]];

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().max(70, 'Keep titles under ~60 characters for search results'),
        description: z.string().min(70).max(170, 'Meta descriptions should be ~120–160 characters'),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        author: z.enum(authorIds),
        reviewedBy: z.enum(authorIds).optional(),
        category: z.enum(categoryIds),
        tags: z.array(z.string()).default([]),
        // Cover photo: put the file in src/content/blog/images/ and write
        //   cover: ./images/my-photo.jpg
        // Any size works; it's resized and converted automatically.
        cover: image().optional(),
        coverAlt: z.string().optional(),
        // Focal point for cropping, e.g. "50% 30%" keeps the top third in view
        coverPosition: z.string().default('50% 50%'),
        // Short summary shown at the top of the article
        keyPoints: z.array(z.string()).default([]),
        // References shown at the end (E-E-A-T). Prefer primary sources.
        sources: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
        draft: z.boolean().default(false),
        // Set false on any post that should never carry ads
        ads: z.boolean().default(true),
      })
      .refine((d) => !d.cover || (d.coverAlt && d.coverAlt.length > 5), {
        message: 'Add a coverAlt describing the photo (needed for accessibility and image SEO)',
        path: ['coverAlt'],
      }),
});

export const collections = { blog };
