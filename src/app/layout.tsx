import type { Metadata } from 'next';
import { Oswald, Rubik, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
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
const DESCRIPTION =
  'Улаанбаатарын фитнес клуб. Premium тоног төхөөрөмж, сауна, шүүгээ, ' +
  'үнэгүй зогсоол. Гишүүнчлэлээ онлайнаар сунгаж, Apple/Google Wallet ' +
  'картаараа нэвтэрнэ.';

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
