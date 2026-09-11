import Image from 'next/image';
import Link from 'next/link';

/**
 * WIN FIT-ийн нүүр хуудас.
 *
 * ★ ДИЗАЙНЫ ЧИГЛЭЛ
 *
 * Заалны ЖИНХЭНЭ самбараас авсан: хар суурь, хүчил ногоон (#C9F31D),
 * «TRAIN. FOCUS. BECOME.» гурван цохилт. Үнийн хэсгийг SaaS карт болгох
 * биш, ХАНАН ДЭЭРХ САМБАР шиг зурсан — гишүүд түүнийг таних ёстой.
 *
 * ⚠ Ногоон өнгийг ЧИМЭГЛЭЛД биш, БҮТЭЦЭД ашиглана (шугам, хүрээ,
 * тэмдэг). Гарчгийн нэг үгийг өнгөөр ялгахгүй.
 */

const MEMBERSHIP = [
  { name: '1 өдөр', price: 30_000, note: null },
  { name: '1 сар', price: 188_000, note: 'анх удаа · дараа нь 250,000₮' },
  { name: '1 сар', price: 250_000, note: null },
  { name: '3 сар', price: 600_000, note: null },
  { name: '6 сар', price: 1_000_000, note: null },
  { name: '12 сар', price: 1_800_000, note: null },
  { name: 'Уурхайчны эрх', price: 150_000, note: '14 хоног' },
];

const PRIVILEGE = [
  { name: 'Оюутан, сурагч', price: 160_000, note: '1 сар · 2 сар 300,000₮ · 3 сар 420,000₮' },
  { name: 'Ахмад настан', price: 150_000, note: '1 сар' },
  { name: 'Хотхоны оршин суугч', price: 200_000, note: '1 сар' },
  { name: 'Хосын багц', price: 1_100_000, note: '2 хүн · 3 сар · 6 сар 1,800,000₮' },
  { name: 'Шүүгээ', price: 40_000, note: '1 сар' },
];

const INCLUDED = ['Premium тоног төхөөрөмж', 'Сауна', 'Шүршүүр', 'Үнэгүй зогсоол'];

const money = (n: number) => `${n.toLocaleString('en-US')}₮`;

export default function Home() {
  return (
    <div className="wf">
      <header className="wf-bar">
        <Link href="/" className="wf-brand">
          <Image src="/brand/mark.png" alt="" width={28} height={28} priority />
          <span>WIN FIT</span>
        </Link>
        <Link href="/pay" className="wf-btn wf-btn--sm">
          Эрх сунгах
        </Link>
      </header>

      <main>
        {/* ── Гарчиг: гурван цохилт, гурван мөр ── */}
        <section className="wf-hero">
          <h1 className="wf-title">
            Train.
            <br />
            Focus.
            <br />
            Become.
          </h1>

          <div className="wf-hero-side">
            <p className="wf-lede">
              Улаанбаатар хотын фитнес клуб. Эрхээ онлайнаар сунгаад,
              Apple эсвэл Google Wallet картаараа хаалганд царайгаа
              уншуулж орно.
            </p>
            <div className="wf-cta">
              <Link href="/pay" className="wf-btn">
                Эрх сунгах
              </Link>
              <a href="#une" className="wf-btn wf-btn--ghost">
                Үнэ харах
              </a>
            </div>
          </div>
        </section>

        {/* ── Багтсан зүйлс: тасралтгүй туузан мөр ── */}
        <div className="wf-strip" aria-label="Гишүүнчлэлд багтсан">
          {INCLUDED.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>

        {/* ── Үнэ: хананы самбар шиг ── */}
        <section id="une" className="wf-board">
          <div className="wf-col">
            <h2>Гишүүнчлэл</h2>
            <dl>
              {MEMBERSHIP.map((p, i) => (
                <div key={`${p.name}-${i}`} className="wf-row">
                  <dt>
                    {p.name}
                    {p.note && <small>{p.note}</small>}
                  </dt>
                  <dd>{money(p.price)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="wf-col wf-col--alt">
            <h2>Хөнгөлөлт</h2>
            <dl>
              {PRIVILEGE.map((p) => (
                <div key={p.name} className="wf-row">
                  <dt>
                    {p.name}
                    {p.note && <small>{p.note}</small>}
                  </dt>
                  <dd>{money(p.price)}</dd>
                </div>
              ))}
            </dl>
            <p className="wf-fine">
              Хөнгөлөлттэй эрхийг ресепшн дээр үнэмлэх үзүүлж нээлгэнэ.
            </p>
          </div>
        </section>

        {/* ── Сунгах урилга ── */}
        <section className="wf-act">
          <h2>Эрхээ сунгах уу?</h2>
          <p>
            Утасны дугаараа оруулаад багцаа сонгоно. Төлбөр хийсний дараа
            эрх тэр дороо нээгдэнэ.
          </p>
          <Link href="/pay" className="wf-btn wf-btn--lg">
            Эрх сунгах
          </Link>
        </section>
      </main>

      <footer className="wf-foot">
        <div>
          <h3>Цагийн хуваарь</h3>
          <p>
            Даваа – Баасан <b>06:00 – 22:00</b>
            <br />
            Бямба, Ням <b>08:00 – 21:00</b>
          </p>
        </div>
        <div>
          <h3>Холбоо барих</h3>
          <p>
            <a href="tel:+97688000500">8800 0500</a>
            <br />
            <a
              href="https://instagram.com/win.fit.fitness"
              target="_blank"
              rel="noreferrer"
            >
              win.fit.fitness
            </a>
          </p>
        </div>
        <div>
          <h3>Данс</h3>
          <p>
            Хаан банк
            <br />
            <b>5312696597</b>
          </p>
        </div>
        <p className="wf-copy">WIN FIT · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
