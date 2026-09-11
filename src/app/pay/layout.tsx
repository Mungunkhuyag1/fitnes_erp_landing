import type { Metadata } from 'next';

/**
 * Төлбөрийн бүх хуудас хайлтаас ХААЛТТАЙ.
 *
 * ⚠ `robots.ts`-ийн `disallow` нь зөвхөн ГҮЙЛГЭХИЙГ зогсооно; хэрэв хэн
 * нэг нь `/pay/:token` холбоосыг өөр сайт дээр тавибал Google түүнийг
 * үзэлгүйгээр индекслэж болно. `noindex` толгой нь түүнийг ч хаана.
 *
 * Эдгээр хуудсууд бүгд client component тул `metadata` экспортлож
 * чадахгүй — тиймээс энэ layout хэрэгтэй.
 */
export const metadata: Metadata = {
  title: 'Эрх сунгах',
  robots: { index: false, follow: false },
};

export default function PayLayout({ children }: LayoutProps<'/pay'>) {
  return children;
}
