'use client';

import { useEffect, useState } from 'react';
import { GYM } from '@/lib/gym';

/**
 * «Одоо нээлттэй / хаалттай» гэсэн амьд төлөв.
 *
 * ЯАГААД ХЭРЭГТЭЙ ВЭ: заалны сайтад хамгийн их асуудаг хоёр асуултын
 * нэг нь «одоо нээлттэй юу?». Цагийн хуваарийг хөл хэсэгт бичээд
 * орхивол хүн өөрөө тооцоолох ёстой болно.
 *
 * ⚠ СЕРВЕР ДЭЭР БОДОЖ БОЛОХГҮЙ: хуудас статикаар урьдчилан зурагддаг
 * тул build хийсэн агшны цаг хөлдөж үлдэнэ. Тиймээс зөвхөн хөтөч дээр,
 * mount хийсний дараа бодно — эс бөгөөс hydration зөрөх болно.
 *
 * ⚠ Цагийн бүсийг ЗААВАЛ заана. Гадаадад байгаа хүн (эсвэл өөр бүсэд
 * тохируулсан утас) нээлттэй эсэхийг өөрийн цагаар тооцвол буруу
 * хариу харна.
 */
const TZ = 'Asia/Ulaanbaatar';

/** Ажлын цаг «HH:MM – HH:MM» мөрөөс минут болгон задална. */
function minutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function scheduleFor(weekday: number): { open: number; close: number } {
  // 0 = Ням, 6 = Бямба
  const weekend = weekday === 0 || weekday === 6;
  const row = GYM.hours[weekend ? 1 : 0];
  const [from, to] = row.time.split('–').map((s) => s.trim());
  return { open: minutes(from), close: minutes(to) };
}

function nowInUb(): { weekday: number; minute: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return {
    weekday: days.indexOf(get('weekday')),
    // 24 цагийн хэлбэрт шөнө дунд «24» гэж ирдэг тохиолдол бий.
    minute: (Number(get('hour')) % 24) * 60 + Number(get('minute')),
  };
}

const hhmm = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export function OpenNow() {
  const [state, setState] = useState<{ open: boolean; text: string } | null>(null);

  useEffect(() => {
    function tick() {
      const { weekday, minute } = nowInUb();
      const today = scheduleFor(weekday);
      if (minute >= today.open && minute < today.close) {
        setState({ open: true, text: `${hhmm(today.close)} хүртэл` });
        return;
      }
      // Хаалттай бол ДАРААГИЙН нээх цагийг хэлнэ — «хаалттай» гэдэг
      // ганцаараа хүнийг явуулна, «08:00-д нээнэ» гэдэг эргүүлж авчирна.
      const next =
        minute < today.open ? today : scheduleFor((weekday + 1) % 7);
      setState({ open: false, text: `${hhmm(next.open)}-д нээнэ` });
    }
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Тооцоологдох хүртэл өндрийг нь эзэлж байна — агуулга үсрэхээс сэргийлнэ.
  if (!state) return <p className="wf-open" aria-hidden>&nbsp;</p>;

  return (
    <p className={`wf-open${state.open ? ' wf-open--yes' : ''}`}>
      <span className="wf-dot" aria-hidden />
      {state.open ? 'Нээлттэй' : 'Хаалттай'} · {state.text}
    </p>
  );
}
