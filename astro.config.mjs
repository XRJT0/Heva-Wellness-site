// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANT: set SITE_URL to your real domain before deploying.
// It powers canonical URLs, the sitemap, RSS and Open Graph tags.
const SITE_URL = process.env.SITE_URL || 'https://www.hevawellness.com';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      // Keep thin/utility pages out of the sitemap.
      // Tag pages can be thin (noindexed under 3 posts), so they stay out too.
      filter: (page) => !/\/(404|thank-you)\/?$/.test(page) && !page.includes('/blog/tag/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
