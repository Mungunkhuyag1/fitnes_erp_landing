import Image from 'next/image';
import Link from 'next/link';
import { OpenNow } from '@/components/open-now';
import { PhoneStart } from '@/components/phone-start';
import { GYM, osmEmbedUrl } from '@/lib/gym';
import { galleryPhotos, heroPhoto } from '@/lib/photos';

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
 *
 * ⚠ Хэсгийн дээр «01 //» гэх дугаарлалт ТАВИХГҮЙ. Дугаарлалт нь
 * дараалал илэрхийлэх ёстой; үнэ, зураг хоёр дараалал биш.
 */

/**
 * `months` нь САРЫН үнэ бодоход л хэрэгтэй.
 *
 * ЯАГААД: «3 сар 600,000₮» гэдэг нь 250,000₮-тэй харьцуулахад хямд
 * гэдгийг хүн толгойдоо бодох ёстой болно. Сарын үнийг нь бичиж
 * өгвөл урт хугацааны багц яагаад ашигтайг ХАРУУЛНА — зарах гол
 * логик нь энэ.
 */
const MEMBERSHIP = [
  { name: '1 өдөр', price: 30_000, note: null, months: 0 },
  { name: '1 сар', price: 188_000, note: 'анх удаа · дараа нь 250,000₮', months: 0 },
  { name: '1 сар', price: 250_000, note: null, months: 0 },
  { name: '3 сар', price: 600_000, note: null, months: 3 },
  { name: '6 сар', price: 1_000_000, note: null, months: 6 },
  { name: '12 сар', price: 1_800_000, note: null, months: 12 },
  { name: 'Уурхайчны эрх', price: 150_000, note: '14 хоног', months: 0 },
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

/** Сарын үнэ — мянга хүртэл нь дугуйруулна («166,666₮» гэж бичихгүй). */
const perMonth = (price: number, months: number) =>
  `сард ${money(Math.round(price / months / 1000) * 1000)}`;

export default function Home() {
  const hero = heroPhoto();
  const photos = galleryPhotos();

  return (
    <div className="wf">
      <header className="wf-bar">
        <Link href="/" className="wf-brand">
          <Image src="/brand/mark.png" alt="" width={28} height={28} priority />
          <span>WIN FIT</span>
        </Link>
        <nav className="wf-nav">
          {photos.length > 0 && <a href="#zaal">Заал</a>}
          <a href="#une">Үнэ</a>
          <a href="#haana">Байршил</a>
        </nav>
        <Link href="/pay" className="wf-btn wf-btn--sm">
          Эрх сунгах
        </Link>
      </header>

      <main>
        {/*
          ── Гарчиг ──
          Зураг ирсэн бол бүтэн дэлгэцээр, текстийг доод зүүн буланд
          давхарлана. Зураггүй үед хоёр баганат типографийн зохиомж руу
          уначихна — цоорхой үлдээхгүй.
        */}
        <section className={hero ? 'wf-hero wf-hero--photo' : 'wf-hero'}>
          {hero && (
            <Image
              src={hero}
              alt="WIN FIT-ийн заал"
              fill
              priority
              sizes="100vw"
              className="wf-hero-img"
            />
          )}

          <div className="wf-hero-body">
            <div>
              <h1 className="wf-title">
                Train.
                <br />
                Focus.
                <br />
                Become.
              </h1>
              <p className="wf-lede">
                {GYM.city} хотын фитнес клуб. Эрхээ онлайнаар сунгаад,
                Apple эсвэл Google Wallet картаараа хаалганд царайгаа
                уншуулж орно.
              </p>
            </div>

            {/*
              Гарчгийн хажууд ЯГ ОДОО хэрэгтэй гурван зүйл: нээлттэй
              эсэх, үнэ хаанаас эхэлдэг, хаанаас эхлэх. Урьд нь энд
              зөвхөн хоёр товч байсан тул баруун тал хоосон харагдаж,
              гарчиг нь агаарт өлгөөтэй мэт байв.
            */}
            <aside className="wf-panel">
              <OpenNow />

              <div className="wf-offer">
                <p className="wf-offer-lead">Анх удаа ирж байна уу?</p>
                <p className="wf-offer-price">188,000₮</p>
                <p className="wf-offer-note">
                  эхний сар · дараа нь 250,000₮
                </p>
              </div>

              <PhoneStart />

              <a href="#une" className="wf-panel-link">
                Бүх үнэ харах
              </a>
            </aside>
          </div>
        </section>

        {/* ── Багтсан зүйлс: тасралтгүй туузан мөр ── */}
        <div className="wf-strip" aria-label="Гишүүнчлэлд багтсан">
          {INCLUDED.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>

        {/* ── Заал: зураг ирсэн үед л гарна ── */}
        {photos.length > 0 && (
          <section id="zaal" className="wf-sec">
            <h2 className="wf-h2">Заал</h2>
            <div className="wf-grid">
              {photos.map((p) => (
                <figure key={p.src} className="wf-shot">
                  <Image
                    src={p.src}
                    alt={p.caption}
                    width={1400}
                    height={933}
                    sizes="(min-width: 900px) 33vw, 100vw"
                  />
                  <figcaption>{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ── Үнэ: хананы самбар шиг ── */}
        <section id="une" className="wf-sec">
          <h2 className="wf-h2">Үнэ</h2>
          <div className="wf-board">
            <div className="wf-col">
              <h3>Гишүүнчлэл</h3>
              <dl>
                {MEMBERSHIP.map((p, i) => (
                  <div key={`${p.name}-${i}`} className="wf-row">
                    <dt>
                      {p.name}
                      {p.note && <small>{p.note}</small>}
                      {p.months > 0 && <small>{perMonth(p.price, p.months)}</small>}
                    </dt>
                    <dd>{money(p.price)}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="wf-col">
              <h3>Хөнгөлөлт</h3>
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
          </div>
        </section>

        {/* ── Байршил ── */}
        <section id="haana" className="wf-sec">
          <h2 className="wf-h2">Хаана</h2>
          <div className="wf-where">
            <div className="wf-map">
              <iframe
                src={osmEmbedUrl()}
                title={`${GYM.name}-ийн байршил газрын зураг дээр`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="wf-where-body">
              <dl className="wf-facts">
                {GYM.hours.map((h) => (
                  <div key={h.days}>
                    <dt>{h.days}</dt>
                    <dd>{h.time}</dd>
                  </div>
                ))}
              </dl>

              <div className="wf-links">
                <a href={`tel:${GYM.phone}`}>{GYM.phoneText}</a>
                <a href={`mailto:${GYM.email}`}>{GYM.email}</a>
                <a href={GYM.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a href={GYM.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </div>

              <a
                href={GYM.mapsPlaceUrl}
                target="_blank"
                rel="noreferrer"
                className="wf-btn wf-btn--ghost"
              >
                Google Maps дээр нээх
              </a>
            </div>
          </div>
        </section>

        {/* ── Сунгах урилга: дугаарыг ЭНДЭЭС авна ── */}
        {/*
          ⚠ ЦОРЫН ГАНЦ гэрэлтсэн блок. Хуудас бүхэлдээ хар тул энэ нь
          гүйлгэлтийн төгсгөлд анхаарал татах цэг болно. Хоёр дахь
          ногоон блок нэмбэл энэ нь давамгайлахаа болино.
        */}
        <section className="wf-act">
          <h2>Эрхээ сунгах уу?</h2>
          <p>
            Утасны дугаараа оруулаад багцаа сонгоно. Төлбөр хийсний дараа
            эрх тэр дороо нээгдэнэ.
          </p>
          <PhoneStart tone="dark" />
        </section>
      </main>

      <footer className="wf-foot">
        <div>
          <h3>Цагийн хуваарь</h3>
          <p>
            {GYM.hours.map((h) => (
              <span key={h.days}>
                {h.days} <b>{h.time}</b>
                <br />
              </span>
            ))}
          </p>
        </div>
        <div>
          <h3>Холбоо барих</h3>
          <p>
            <a href={`tel:${GYM.phone}`}>{GYM.phoneText}</a>
            <br />
            <a href={`mailto:${GYM.email}`}>{GYM.email}</a>
            <br />
            <a href={GYM.instagram} target="_blank" rel="noreferrer">
              {GYM.instagramHandle}
            </a>
          </p>
        </div>
        <div>
          <h3>Данс</h3>
          <p>
            {GYM.bank.name}
            <br />
            <b>{GYM.bank.account}</b>
          </p>
        </div>
        <p className="wf-copy">
          {GYM.name} · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
