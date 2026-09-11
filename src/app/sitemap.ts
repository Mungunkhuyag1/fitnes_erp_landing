import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

// Нэг л нийтийн хуудастай — төлбөрийн хэсэг нь хувийн тул орохгүй.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl(),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
