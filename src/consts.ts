// ─────────────────────────────────────────────────────────────
// Site-wide settings. Edit this file first.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'Heva Wellness',
  shortName: 'Heva',
  tagline: 'Thoughtful care for your body',
  description:
    'Evidence-based guides on sleep, nutrition, movement and stress, written and reviewed by qualified clinicians. Practical wellness you can actually keep up.',
  locale: 'en_GB',
  lang: 'en',
  email: 'hello@hevawellness.com',
  phone: '+44 20 7946 0321',
  address: {
    street: '14 Wimpole Street',
    city: 'London',
    postcode: 'W1G 9SX',
    country: 'GB',
  },
  social: {
    instagram: 'https://www.instagram.com/hevawellness',
    youtube: 'https://www.youtube.com/@hevawellness',
    linkedin: 'https://www.linkedin.com/company/hevawellness',
  },
  founded: '2019',
  postsPerPage: 9,
};

// ─────────────────────────────────────────────────────────────
// Google AdSense
// Leave PUBLIC_ADSENSE_CLIENT empty until you are approved.
// While empty, no ad code is loaded and ad slots render nothing.
// Set it in a .env file:  PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
// ─────────────────────────────────────────────────────────────
export const ADSENSE = {
  client: import.meta.env.PUBLIC_ADSENSE_CLIENT ?? '',
  // Ad unit slot IDs from AdSense → Ads → By ad unit
  slots: {
    inArticle: import.meta.env.PUBLIC_ADSENSE_SLOT_IN_ARTICLE ?? '',
    endOfArticle: import.meta.env.PUBLIC_ADSENSE_SLOT_END ?? '',
    sidebar: import.meta.env.PUBLIC_ADSENSE_SLOT_SIDEBAR ?? '',
  },
};

export const ANALYTICS = {
  // Google Analytics 4 measurement ID, e.g. G-XXXXXXXXXX (optional)
  ga4: import.meta.env.PUBLIC_GA4_ID ?? '',
};

// ─────────────────────────────────────────────────────────────
// Authors & reviewers (E-E-A-T). Every post names one author,
// and health posts should name a medical reviewer.
// ─────────────────────────────────────────────────────────────
export type Author = {
  id: string;
  name: string;
  role: string;
  credentials: string;
  bio: string;
  initials: string;
  sameAs?: string[];
};

export const AUTHORS: Record<string, Author> = {
  'adam-jack': {
    id: 'adam-jack',
    name: 'Dr. Adam Jack',
    role: 'Lead Nutrition Specialist',
    credentials: 'RD, MSc Clinical Nutrition',
    initials: 'AJ',
    bio: 'Adam is a registered dietitian with twelve years of experience in metabolic health and weight management. He leads Heva’s nutrition programme and reviews every food and supplement article we publish.',
  },
  'leila-hart': {
    id: 'leila-hart',
    name: 'Leila Hart',
    role: 'Health Writer & Yoga Teacher',
    credentials: 'BSc Psychology, RYT-500',
    initials: 'LH',
    bio: 'Leila writes about sleep, stress and movement. She has taught yoga and breathwork for nine years and runs Heva’s beginner programme at our Ubud studio.',
  },
  'sam-okoro': {
    id: 'sam-okoro',
    name: 'Dr. Sam Okoro',
    role: 'Medical Reviewer',
    credentials: 'MBBS, MRCGP',
    initials: 'SO',
    bio: 'Sam is a UK general practitioner with a special interest in sleep medicine and lifestyle medicine. He medically reviews Heva’s health content for accuracy and safety.',
  },
};

export const CATEGORIES: Record<string, { name: string; description: string }> = {
  sleep: { name: 'Sleep', description: 'Practical, evidence-based ways to fall asleep faster and wake up rested.' },
  nutrition: { name: 'Nutrition', description: 'Clear guidance on eating well, without fad diets or guilt.' },
  movement: { name: 'Movement', description: 'Gentle, sustainable ways to move more, from walking to yoga.' },
  mind: { name: 'Mind & Stress', description: 'Tools for calmer days: breathwork, routines and recovery.' },
};

export const NAV = [
  { href: '/about/', label: 'About' },
  { href: '/treatments/', label: 'Treatments' },
  { href: '/blog/', label: 'Journal' },
  { href: '/faq/', label: 'FAQ' },
];
