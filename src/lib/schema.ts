import { SITE, AUTHORS } from '@/consts';
import type { Post } from './posts';

const abs = (path: string, site: URL) => new URL(path, site).href;

export function organizationSchema(site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': abs('/#organization', site),
    name: SITE.name,
    url: site.href,
    logo: abs('/favicon.svg', site),
    email: SITE.email,
    telephone: SITE.phone,
    foundingDate: SITE.founded,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      postalCode: SITE.address.postcode,
      addressCountry: SITE.address.country,
    },
    sameAs: Object.values(SITE.social),
  };
}

export function websiteSchema(site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs('/#website', site),
    url: site.href,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { '@id': abs('/#organization', site) },
  };
}

export function personSchema(id: string, site: URL) {
  const a = AUTHORS[id];
  return {
    '@type': 'Person',
    '@id': abs(`/authors/${a.id}/#person`, site),
    name: a.name,
    jobTitle: a.role,
    description: a.bio,
    url: abs(`/authors/${a.id}/`, site),
    worksFor: { '@id': abs('/#organization', site) },
    ...(a.sameAs ? { sameAs: a.sameAs } : {}),
  };
}

export function articleSchema(post: Post, site: URL, imageUrl?: string) {
  const url = abs(`/blog/${post.id}/`, site);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    headline: post.data.title,
    description: post.data.description,
    image: abs(imageUrl ?? '/og-default.jpg', site),
    datePublished: post.data.pubDate.toISOString(),
    dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
    author: personSchema(post.data.author, site),
    ...(post.data.reviewedBy ? { reviewedBy: personSchema(post.data.reviewedBy, site) } : {}),
    publisher: { '@id': abs('/#organization', site) },
    articleSection: post.data.category,
    keywords: post.data.tags.join(', '),
    inLanguage: SITE.lang,
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[], site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.href, site),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
