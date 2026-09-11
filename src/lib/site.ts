/**
 * Сайтын БҮТЭН хаяг.
 *
 * ⚠ Харьцангуй зам ҮЛДЭЭЖ БОЛОХГҮЙ: OG зураг, robots, sitemap бүгд
 * бүтэн http хаяг шаарддаг. Vercel дээр домэйн холбохоос ӨМНӨ ч
 * ажиллуулахын тулд `VERCEL_PROJECT_PRODUCTION_URL` рүү уначихна.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3102';
}
