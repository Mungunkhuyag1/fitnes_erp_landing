'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GymClip } from '@/lib/clips';

/**
 * Заалны бичлэгүүд — нэг нэгээр нь гүйлгэж үзнэ.
 *
 * ★ ЯАГААД ЗЭРЭГЦҮҮЛЭХГҮЙ ВЭ
 *
 * Босоо бичлэгийг хажуу хажууд нь тавихад хоёулаа нарийсч, аль нь ч
 * уншигдахаа болино. Нэг нэгээр нь бүтэн өргөнөөр үзүүлж, гүйлгэж
 * солих нь утасны зуршилтай ч таарна.
 *
 * ★ ЯАГААД ДУУГҮЙ, УДИРДЛАГАГҮЙ ВЭ
 *
 * Энэ нь кино биш, ОРЧНЫ зураглал. Дуу нь зочны хөгжмийг таслана,
 * товчлуурууд нь хүрээг эвдэнэ. Дууны зам нь файлаас хасагдсан тул
 * «чимээгүй болгох» товч ч хэрэггүй.
 *
 * ★ ХАРАГДАХ ХҮРТЭЛ ТАТАХГҮЙ
 *
 * Бичлэгүүд ~2МБ. Хуудас нээнгүүт татвал гарчиг харахаас өмнө гар
 * утасны багц үрэгдэнэ. Дэлгэцэд ойртохоор нь `src` тавина; тэр хүртэл
 * зөвхөн хөдөлгөөнгүй кадр (~60КБ) харагдана.
 *
 * ⚠ ХӨДӨЛГӨӨН БАГАСГАХ тохиргоо. Вестибуляр эмгэгтэй хүнд автоматаар
 * эргэлдэх зураг эвгүй байдал үүсгэдэг. Тэр тохиолдолд зогсоож,
 * удирдлагыг нь гаргана — хүн өөрөө шийднэ.
 */
export function GymReel({ clips }: { clips: GymClip[] }) {
  const box = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLElement | null)[]>([]);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [still, setStill] = useState(false);
  const [near, setNear] = useState(false);
  const [seen, setSeen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setStill(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Хэсэг дэлгэцэд ойртоход л файлуудыг татаж эхэлнэ.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setNear(true);
        io.disconnect(); // нэг л удаа — буцаж гүйлгэхэд дахин татахгүй
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /**
   * Дэлгэцээс гарвал ЗОГСООНО.
   *
   * ⚠ Хэн ч харахгүй байхад тоглуулах нь батарей, өгөгдөл дэмий иднэ.
   * Түүнээс гадна харагдахгүй байхад бичлэг дуусаад дараагийнх руу
   * үсрэх нь утгагүй — зочин буцаж ирэхэд өөр бичлэг дээр байна.
   */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setSeen(e.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /**
   * Аль бичлэг дэлгэцэн дээр байгааг мөрнөөс нь хэмжинэ.
   *
   * ⚠ `scroll` эвентээр гараар тоолохгүй: momentum гүйлтийн үед олон
   * зуун удаа дуудагдаж, заримдаа дунд хавьцаа зогсдог. Ажиглагч нь
   * зөвхөн солигдох агшинд ажиллана.
   */
  useEffect(() => {
    const root = rail.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = slides.current.indexOf(e.target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      { root, threshold: 0.6 },
    );
    for (const el of slides.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, [clips.length]);

  /** Зөвхөн ХАРАГДАЖ БУЙ бичлэг тоглоно — бусад нь хүчийг дэмий иднэ. */
  useEffect(() => {
    if (!near) return;
    refs.current.forEach((v, i) => {
      if (!v) return;
      if (still || !seen || i !== active) {
        v.pause();
      } else {
        // Солигдох бүрд ЭХНЭЭС нь: өмнө нь дуустлаа тоглосон бичлэг
        // эргэж ирэхэд төгсгөл дээрээ зогссон хэвээр байна.
        if (v.currentTime > 0 && v.paused) v.currentTime = 0;
        // Autoplay-г браузер татгалзаж болно (батарей хэмнэх горим).
        // Кадр нь үлдэх тул хайрцаг хоосрохгүй.
        void v.play().catch(() => {});
      }
    });
  }, [near, still, seen, active]);

  /**
   * Мөрийг ДОТОР нь гүйлгэнэ.
   *
   * ⚠ `scrollIntoView` хэрэглэж БОЛОХГҮЙ: `block: 'nearest'` байсан ч
   * бичлэг дэлгэцэд бүтэн багтаагүй бол браузер ХУУДСЫГ өөрийг нь
   * босоогоор чирнэ. Бичлэг солигдох бүрд зочны харж байсан газраас
   * нь буцаагаад заалны хэсэг рүү үсэргэнэ — хамгийн эвгүй зан.
   */
  const goTo = useCallback((i: number) => {
    const r = rail.current;
    const el = slides.current[i];
    if (!r || !el) return;
    const left =
      el.getBoundingClientRect().left -
      r.getBoundingClientRect().left +
      r.scrollLeft;
    r.scrollTo({ left, behavior: 'smooth' });
  }, []);

  /**
   * Бичлэг дуусмагц дараагийнх руу — сүүлчийнхээс эхнийх рүү эргэнэ.
   *
   * ⚠ Тиймээс `loop` тавихгүй: давтагдвал `ended` хэзээ ч ажиллахгүй
   * бөгөөд зочин эхний бичлэг дээр мөнхөд үлдэнэ.
   *
   * ⚠ Хөдөлгөөн багасгах тохиргоотой үед үсрэхгүй: хүн өөрөө удирдана.
   */
  const onEnded = useCallback(
    (i: number) => {
      if (still || clips.length < 2) return;
      goTo((i + 1) % clips.length);
    },
    [still, clips.length, goTo],
  );

  return (
    <div className="wf-reel" ref={box}>
      <div className="wf-rail" ref={rail}>
        {clips.map((c, i) => (
          <figure
            key={c.src}
            className="wf-clip"
            ref={(el) => {
              slides.current[i] = el;
            }}
          >
            <video
              ref={(el) => {
                refs.current[i] = el;
              }}
              // ⚠ `near` болтол `src` ОГТ байхгүй: хоосон мөр өгвөл
              // браузер одоогийн хуудсыг видео гэж татаж эхэлнэ.
              {...(near ? { src: c.src } : {})}
              poster={c.poster ?? undefined}
              aria-label={`Заалны танхим — дуугүй бичлэг ${i + 1}`}
              onEnded={() => onEnded(i)}
              controls={still}
              muted
              playsInline
              preload="none"
            />
          </figure>
        ))}
      </div>

      {clips.length > 1 && (
        <div className="wf-dots">
          {clips.map((c, i) => (
            <button
              key={c.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${i + 1}-р бичлэг`}
              aria-current={i === active}
              className={i === active ? 'on' : undefined}
            />
          ))}
        </div>
      )}

      <p className="wf-reel-cap">Заалны танхим</p>
    </div>
  );
}
