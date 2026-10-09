# Heva Wellness

A fast, SEO-ready wellness website with a Markdown blog, built with [Astro](https://astro.build).
Every page is static HTML, so it loads quickly, scores well on Core Web Vitals and can be hosted almost anywhere for free.

## Quick start

```bash
npm install
cp .env.example .env      # then fill in SITE_URL at minimum
npm run dev               # http://localhost:4321
npm run build             # outputs the finished site to dist/
npm run preview           # preview the production build
```

Requires Node.js 18.20+ (Node 20 or 22 recommended).

## Where things live

| What | File |
| --- | --- |
| Site name, contact details, authors, categories, nav | `src/consts.ts` |
| Stats, testimonials, treatments, FAQs | `src/data/site.ts` |
| Blog posts | `src/content/blog/*.md` |
| Post fields and validation | `src/content.config.ts` |
| Colours, fonts, all styling | `src/styles/global.css` |
| Page `<head>`, SEO tags | `src/components/SEO.astro` |
| Structured data (JSON-LD) | `src/lib/schema.ts` |
| Ad units | `src/components/AdSlot.astro` |
| Cookie consent | `src/components/ConsentBanner.astro` |
| Site photos (hero, panels) | `src/assets/images/` |
| Blog cover photos | `src/content/blog/images/` |
| Favicon, default share image | `public/` |

## Adding a blog post

1. Copy `docs/post-template.md` into `src/content/blog/` and rename it, e.g. `vitamin-d-in-winter.md`. The file name becomes the URL.
2. Fill in the frontmatter. The build fails with a clear message if a title is too long or a description is the wrong length.
3. Write in Markdown using `##` and `###` headings. The table of contents, reading time, author box, related posts, breadcrumbs, sitemap entry, RSS item and structured data are all generated for you.
4. Cover photo: drop any JPG or PNG into `src/content/blog/images/`, then set `cover: ./images/your-photo.jpg` and a descriptive `coverAlt`. Use `coverPosition: "50% 30%"` to choose which part stays in view when it's cropped. Images are resized and converted to AVIF/WebP automatically at build time, so large files are fine.
5. Set `draft: false` (or remove it) to publish.

To add a category or author, edit `CATEGORIES` or `AUTHORS` in `src/consts.ts`. Pages for them are created automatically.

## SEO already built in

Following Google Search Central guidelines:

- Unique `<title>` and meta description on every page, self-referencing canonical URLs, one `<h1>` per page
- XML sitemap (`/sitemap-index.xml`), `robots.txt`, RSS feed (`/rss.xml`)
- JSON-LD structured data: Organization (MedicalBusiness), WebSite, BlogPosting with author and medical reviewer, BreadcrumbList, FAQPage, ProfilePage, Service list
- Open Graph and Twitter cards for social sharing
- E-E-A-T signals for health content (YMYL): named authors with credentials, medical reviewers, author pages, published and updated dates, cited sources, editorial policy, medical disclaimer
- Clean, descriptive URLs with trailing slashes; breadcrumbs; internal linking via categories, tags and related posts
- Thin pages are kept out of the index: tag pages with fewer than 3 posts are `noindex`, the thank-you and 404 pages are `noindex`, and none of these are in the sitemap
- Optimised responsive images (AVIF/WebP, multiple sizes, lazy loading, explicit dimensions), descriptive alt text, and a 1200×630 share image generated for every post
- Self-hosted fonts (no Google Fonts request), minimal JavaScript, semantic HTML, skip link, keyboard focus styles, reduced-motion support

After launch: add the site to [Google Search Console](https://search.google.com/search-console), verify ownership, and submit `https://yourdomain.com/sitemap-index.xml`.

## Google AdSense: getting approved

The site already includes every page reviewers look for: About, Contact, Privacy Policy (with the required Google advertising disclosures), Terms, Cookie Policy, Medical Disclaimer and Editorial Policy, plus clear navigation and no broken links.

### Before you apply

1. **Use your own domain** and deploy the site (see Deploying below). Fill in `SITE_URL`.
2. **Replace all sample content.** `src/data/site.ts` holds placeholder stats, ratings and testimonials. Publishing invented reviews or figures breaks consumer law and Google's policies. Replace the addresses, phone number, email and author bios in `src/consts.ts` with real ones. Have the legal pages reviewed for your business.
3. **Publish more original articles.** Six starter posts are included. Aim for **20–30 genuinely useful, original articles** of 800+ words before applying, published over several weeks. Health is a "Your Money or Your Life" topic, so real expertise, sources and reviewers matter.
4. **Verify the sources** listed in each starter article still resolve, and edit the articles to match your own expertise and voice.
5. **Check image rights.** Only use photos you took, licensed, or got from free-to-use libraries (Unsplash, Pexels). Images copied from Pinterest or Instagram can count as copyright infringement, which is an AdSense policy violation. To swap a photo, replace the file in `src/assets/images/` or `src/content/blog/images/` keeping the same name.
6. Wait until Google Search Console shows your pages being indexed.

### Applying

1. Sign up at [adsense.google.com](https://adsense.google.com) and add your site.
2. Put your publisher ID in `.env`: `PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX`, rebuild and redeploy. This adds the AdSense verification meta tag and code to every page, and generates `/ads.txt` automatically.
3. Request review in AdSense. Approval usually takes a few days to a few weeks.

### After approval

1. In AdSense → Ads → By ad unit, create a **Display** unit, copy its slot ID into `PUBLIC_ADSENSE_SLOT_END`, rebuild and redeploy. Ads appear at the end of each article, clearly labelled "Advertisement".
2. Optional: turn on **Auto ads** in AdSense for in-article placements. Keep the density moderate; heavy ads hurt both readers and rankings.
3. Ads are deliberately not loaded on the home, treatments, FAQ, contact, legal, author, thank-you or 404 pages. Set `ads: false` in a post's frontmatter to keep a single article ad-free.

### Consent (UK, EEA, Switzerland)

Google requires a **Google-certified consent platform** to serve ads to visitors in the UK, EEA and Switzerland. The easiest option is free:

1. In AdSense → Privacy & messaging → European regulations, create and publish a consent message.
2. Set `PUBLIC_USE_GOOGLE_CMP=true` so the built-in banner hides and Google's message takes over. The footer's "Cookie settings" link then reopens Google's message.

Google Consent Mode v2 defaults (everything denied until the visitor chooses) are already set in `src/layouts/BaseLayout.astro`.

## Forms

The contact form and newsletter are static by default (they go to `/thank-you/` without storing anything). To receive messages, create a form at a service like Formspree or Basin, or use your email provider's signup endpoint, and set `PUBLIC_CONTACT_ENDPOINT` and `PUBLIC_NEWSLETTER_ENDPOINT`.

## Deploying

Any static host works. Build command `npm run build`, output folder `dist`.

- **Netlify / Vercel / Cloudflare Pages:** connect the Git repository, set the environment variables from `.env.example` in the dashboard, and deploy.
- **Any other host:** run `npm run build` and upload the contents of `dist/`.

Use HTTPS, and pick one version of your domain (with or without `www`) and redirect the other to it.
