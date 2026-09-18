import fs from 'node:fs';
import path from 'node:path';

/**
 * Заалны богино бичлэгүүд — BUILD ҮЕД файлын системээс уншина.
 *
 * `photos.ts`-тэй ижил зарчим: байхгүй файл руу заасан `<video>` нь хар
 * хайрцаг үлдээх тул байгааг нь л харуулна. Бичлэг солих нь ФАЙЛ
 * СОЛИХ үйлдэл болно — код засахгүй.
 *
 * ⚠ Босоо (9:16) бичлэгт зориулсан. Хэвтээ бичлэг тавибал хажуу талаас
 * нь огтолж харуулна (`object-fit: cover`) — өөр хэсэг зохиох хэрэгтэй.
 */
export interface GymClip {
  src: string;
  /** Ачаалахаас өмнөх хөдөлгөөнгүй кадр. Байхгүй бол хоосон дэвсгэр. */
  poster: string | null;
}

const WANTED: Array<{ src: string; poster: string }> = [
  { src: '/gym/reel-01.mp4', poster: '/gym/reel-01.jpg' },
  { src: '/gym/reel-02.mp4', poster: '/gym/reel-02.jpg' },
];

function exists(src: string): boolean {
  try {
    return fs.statSync(path.join(process.cwd(), 'public', src)).isFile();
  } catch {
    return false;
  }
}

/** Байгаа бичлэгүүд. Хоосон бол хэсэг бүхэлдээ гарахгүй. */
export function gymClips(): GymClip[] {
  return WANTED.filter((c) => exists(c.src)).map((c) => ({
    ...c,
    poster: exists(c.poster) ? c.poster : null,
  }));
}
