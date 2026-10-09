import rss from '@astrojs/rss';
import { SITE, AUTHORS } from '@/consts';
import { getPosts } from '@/lib/posts';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: `${SITE.name} Journal`,
    description: SITE.description,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`,
      author: `${SITE.email} (${AUTHORS[p.data.author].name})`,
      categories: [p.data.category, ...p.data.tags],
    })),
    customData: `<language>${SITE.lang}</language>`,
  });
}
