import type { APIRoute } from 'astro';
import { ADSENSE } from '@/consts';

// Generates /ads.txt from PUBLIC_ADSENSE_CLIENT.
// "ca-pub-123…" becomes "google.com, pub-123…, DIRECT, f08c47fec0942fa0"
export const GET: APIRoute = () => {
  const pub = ADSENSE.client.replace(/^ca-/, '');
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : '# Add PUBLIC_ADSENSE_CLIENT to your environment to generate this file.\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
