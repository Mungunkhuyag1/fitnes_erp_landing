import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

/**
 * ⚠ `/pay` нь хайлтаас ХААЛТТАЙ: тэнд утасны дугаараар гишүүн хайдаг
 * бөгөөд `/pay/:token` холбоос нь ХУВИЙН. Индекслэгдвэл хэн нэгний
 * эрх сунгах хуудас Google дээр гарч ирнэ.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/pay' },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
