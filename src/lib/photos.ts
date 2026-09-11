import fs from 'node:fs';
import path from 'node:path';

/**
 * Заалны зургууд — BUILD ҮЕД файлын системээс уншина.
 *
 * ЯАГААД ИНГЭВ: зургууд хараахан ирээгүй. Байхгүй файл руу заасан
 * `<Image>` нь 404 болж, зохиомжид цоорхой үлдээнэ. Энд байгааг нь л
 * үлдээх тул зураг нэмэх нь ФАЙЛ ХУУЛАХ үйлдэл болно — код засахгүй.
 *
 * ⚠ Энэ нь build-ийн үеийн шалгалт. Зураг нэмсэн бол дахин deploy
 * хийх шаардлагатай (Vercel дээр push хийхэд өөрөө болно).
 */
export interface GymPhoto {
  src: string;
  caption: string;
  /** Өргөн хэлбэрийн зураг эгнээнд хоёр нүд эзэлнэ. */
  wide?: boolean;
}

const WANTED: GymPhoto[] = [
  { src: '/gym/hall-01.jpg', caption: 'Заал', wide: true },
  { src: '/gym/gear-01.jpg', caption: 'Хүчний бүс' },
  { src: '/gym/cardio.jpg', caption: 'Кардио' },
  { src: '/gym/sauna.jpg', caption: 'Сауна' },
  { src: '/gym/shower.jpg', caption: 'Шүршүүр' },
  { src: '/gym/locker.jpg', caption: 'Шүүгээ' },
];

function exists(src: string): boolean {
  try {
    return fs.statSync(path.join(process.cwd(), 'public', src)).isFile();
  } catch {
    return false;
  }
}

/** Эгнээнд харуулах зургууд (нүүрний гол зургийг ОРУУЛАХГҮЙ). */
export function galleryPhotos(): GymPhoto[] {
  return WANTED.filter((p) => !p.wide && exists(p.src));
}

/** Нүүрний бүтэн дэлгэцийн зураг — байхгүй бол `null`. */
export function heroPhoto(): string | null {
  const hero = WANTED.find((p) => p.wide);
  return hero && exists(hero.src) ? hero.src : null;
}
