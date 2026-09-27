import type { Metadata } from 'next';
import Link from 'next/link';
import { GYM } from '@/lib/gym';

/**
 * Өгөгдөл устгуулах заавар — Meta-гийн «Data Deletion Instructions URL».
 *
 * ★ ЯАГААД CALLBACK БИШ, ЗААВАР ВЭ
 *
 * Meta нь хоёуланг зөвшөөрдөг: автомат `callback` эсвэл энэ мэт
 * зааврын хуудас. Бид ЗААВРЫГ сонгосон, учир нь:
 *
 * Устгах callback нь хүнийг `ASID`-ээр (app-scoped ID) заадаг. Харин
 * Messenger-ийн мессеж нь `PSID`-тэй (page-scoped ID) ирдэг ба бид
 * түүнийг л хадгална. Хоёр дугаар нь НЭГ хүнийх боловч ӨӨР утга —
 * тэднийг холбохын тулд тусдаа Graph дуудлага, нэмэлт эрх шаардана.
 *
 * ⚠ Тиймээс callback бичвэл «устгалаа» гэсэн баталгаажуулалтын код
 * буцаагаад ҮНЭНДЭЭ юу ч устгаагүй байх эрсдэлтэй. Худал баталгаа
 * өгөхөөс зөв заавар өгөх нь дээр.
 *
 * ⚠ ЭНД БИЧСЭН БҮХ АМЛАЛТ БИЕЛЭХ ЁСТОЙ. `DELETE /meta/conversations/:id`
 * (ADMIN, аудиттай) нь бодитоор байгаа тул «устгана» гэж бичиж болно.
 */
export const metadata: Metadata = {
  title: 'Мэдээллээ устгуулах',
  description:
    'WIN FIT дээр хадгалагдсан таны мэдээллийг хэрхэн устгуулах вэ.',
};

export default function DataDeletionPage() {
  return (
    <main className="wf-sec wf-legal">
      <p className="wf-legal-back">
        <Link href="/">← WIN FIT</Link>
      </p>

      <h1 className="wf-h2">Мэдээллээ устгуулах</h1>
      <p className="wf-legal-meta">
        Facebook Messenger-ийн яриа болон гишүүнчлэлийн бүртгэл
      </p>

      <section>
        <h2>Хэрхэн хүсэлт гаргах вэ</h2>
        <p>Дараах хоёр замын аль нэгээр:</p>
        <ol>
          <li>
            <strong>Утсаар:</strong>{' '}
            <a href={`tel:${GYM.phone}`}>{GYM.phoneText}</a> дугаарт залгаж
            «мэдээллээ устгуулах» гэж хэлнэ
          </li>
          <li>
            <strong>Facebook-ээр:</strong>{' '}
            <a href={GYM.facebook} target="_blank" rel="noopener noreferrer">
              манай хуудас
            </a>{' '}
            руу «Мэдээллээ устгуулах хүсэлтэй байна» гэж бичнэ
          </li>
        </ol>
        <p>
          Таны хэн болохыг батлахын тулд нэр, утасны дугаараа хэлэх
          шаардлагатай — өөр хүний мэдээллийг санамсаргүй устгахаас
          сэргийлнэ.
        </p>
      </section>

      <section>
        <h2>Хэр удаан үргэлжлэх вэ</h2>
        <p>
          Хүсэлтийг <strong>ажлын 7 хоногийн дотор</strong> биелүүлж, танд
          мэдэгдэнэ.
        </p>
      </section>

      <section>
        <h2>Юу устах вэ</h2>
        <ul>
          <li>
            <strong>Messenger-ийн яриа</strong> — бүх мессеж, профайлын
            нэр, зургийн холбоос бүхэлдээ устана
          </li>
          <li>
            <strong>Гишүүнчлэлийн бүртгэл</strong> — нэр, утас, холбоо
            барих мэдээлэл
          </li>
          <li>
            <strong>Царайны загвар</strong> — хаалганы төхөөрөмжөөс
            хасагдана
          </li>
        </ul>
      </section>

      <section>
        <h2>⚠ Юу устахгүй вэ</h2>
        <p>
          Шударга байхын тулд эдгээрийг тодорхой хэлье — бид бүгдийг
          устгана гэж амлаж чадахгүй:
        </p>
        <ul>
          <li>
            <strong>Санхүүгийн бүртгэл</strong> (төлбөр, нэхэмжлэх) —
            нягтлан бодох бүртгэлийн хууль шаарддаг тул хадгалагдана.
            Хувь хүнийг заасан талбарууд нь нэргүй болно.
          </li>
          <li>
            <strong>Facebook тал дээрх таны яриа</strong> — бид зөвхөн
            ӨӨРСДИЙН хуулбарыг устгана. Messenger дээрх яриаг та өөрөө
            Facebook-ийн тохиргооноос устгана.
          </li>
          <li>
            <strong>Нөөц хуулбар</strong> — 30 хоногийн дотор автоматаар
            дарагдана.
          </li>
        </ul>
      </section>

      <section>
        <h2>Facebook-ийн талд</h2>
        <p>
          Манай апп руу өгсөн зөвшөөрлийг та өөрөө цуцалж болно:
        </p>
        <p className="wf-legal-path">
          Facebook → Settings &amp; Privacy → Settings → Apps and Websites
        </p>
        <p>
          Зөвшөөрөл цуцлах нь <strong>цаашид</strong> мессеж дамжихыг
          зогсооно. Өмнө нь хадгалагдсан мэдээллийг устгахын тулд дээрх
          хүсэлтийг гаргана уу.
        </p>
      </section>

      <p className="wf-legal-meta">
        Дэлгэрэнгүйг <Link href="/privacy">нууцлалын бодлого</Link>-оос
        уншина уу.
      </p>
    </main>
  );
}
