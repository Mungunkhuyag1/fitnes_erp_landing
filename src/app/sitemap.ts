import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

/*
 * Нийтийн хуудсууд. Төлбөрийн хэсэг (`/pay`) нь хувийн тул орохгүй.
 *
 * ⚠ Хууль зүйн хоёр хуудсыг ЗААВАЛ оруулна: Meta-гийн App Review
 * шалгагч тэднийг олох ёстой бөгөөд хайлтын систем индексэлсэн
 * байх нь «энэ хаяг үнэхээр ажилладаг» гэдгийн нэмэлт баталгаа.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: siteUrl(),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteUrl()}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl()}/data-deletion`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
