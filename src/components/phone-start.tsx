'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Нүүр хуудсан дээрх «дугаараа оруул» талбар.
 *
 * ЯАГААД ЭНД БАЙНА ВЭ: гишүүдийн дийлэнх нь эрхээ сунгахаар ирдэг.
 * Урьд нь [Эрх сунгах] → /pay → дугаар бичих гэсэн ГУРВАН алхам байсан.
 * Дугаарыг нүүрэн дээр авчихвал нэг алхам хасагдана.
 *
 * ⚠ Энд ямар ч шалгалт хийхгүй — дугаар байгаа эсэхийг зөвхөн сервер
 * мэднэ. Хариуг нь `/pay` хуудас харуулна. «Олдсонгүй» гэдгийг энд
 * үзүүлэхийн тулд хайлтыг давхардуулах шаардлагагүй.
 */
export function PhoneStart({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const ok = phone.replace(/\D/g, '').length >= 8;

  return (
    <form
      className={`wf-start${size === 'sm' ? ' wf-start--sm' : ''}`}
      onSubmit={(e) => {
        e.preventDefault();
        if (ok) router.push(`/pay?phone=${encodeURIComponent(phone.trim())}`);
      }}
    >
      <span className="wf-start-cc">+976</span>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        aria-label="Утасны дугаар"
        placeholder="Утасны дугаар"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button type="submit" className="wf-btn" disabled={!ok}>
        Эрх сунгах
        <ArrowRight className="wf-start-arrow" aria-hidden />
      </button>
    </form>
  );
}
