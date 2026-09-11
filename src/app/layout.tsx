import type { Metadata } from 'next';
import { Oswald, Rubik, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { GYM } from '@/lib/gym';
import { siteUrl } from '@/lib/site';

/**
 * ⚠ КИРИЛЛ ҮСЭГ ЗААВАЛ. Anton, Barlow зэрэг «постерын» фонтууд нь
 * латин л дэмждэг тул монгол текст бүхэлдээ fallback руу унаж,
 * дизайн нь эвдэрдэг. Oswald (нарийвчилсан, спортын самбарын аяс) ба
 * Rubik (бага зэрэг дөрвөлжин гротеск) хоёул кириллтэй.
 *
 * Geist нь төлбөрийн хуудсуудад (shadcn токен) үлдэнэ — нүүр нь
 * дэлгүүрийн шил, төлбөр нь касс.
 */
const display = Oswald({
  variable: '--font-display',
  weight: ['500', '700'],
  subsets: ['latin', 'cyrillic'],
});
const body = Rubik({
  variable: '--font-body',
  weight: ['400', '500', '600'],
  subsets: ['latin', 'cyrillic'],
});
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const TITLE = 'WIN FIT — Train. Focus. Become.';
/**
 * Хайлтын үр дүн ба холбоосын урьдчилан харагдацад ЭНЭ гарна.
 *
 * ⚠ Хаягийг заавал оруулна: «Яармаг фитнес» гэж хайж буй хүнд
 * газар зүйн үг байхгүй бол энэ хуудас тохирохгүй. Нүүрэн дээр
 * хаяг байх нь хангалтгүй — Google эхлээд тайлбарыг харуулна.
 */
const DESCRIPTION =
  `${GYM.address} дахь фитнес клуб. Тохилог тухтай орчин, ` +
  'бүрэн тоноглогдсон заал, сауна, шүршүүр, шүүгээ, үнэгүй зогсоол.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: TITLE, template: '%s · WIN FIT' },
  description: DESCRIPTION,
  applicationName: 'WIN FIT',
  openGraph: {
    type: 'website',
    siteName: 'WIN FIT',
    locale: 'mn_MN',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
  /**
   * ⚠ Dashboard-ынхаас ЯЛГААТАЙ: landing нь хайлтад ГАРАХ ЁСТОЙ.
   * Тэнд `robots: { index: false }` байсан нь ажилтны хэсэг учраас.
   */
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="mn"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
