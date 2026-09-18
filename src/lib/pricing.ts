/**
 * Нүүр хуудасны үнийн самбар.
 *
 * ★ ҮНЭ НЬ БАЙГУУЛЛАГЫН ӨГӨГДӨЛ, КОД БИШ
 *
 * Өмнө нь энэ самбар кодод бичигдсэн байсан тул үнэ солиход deploy
 * шаардаж, урамшуулал нүүр хуудсанд огт харагддаггүй байв. Одоо
 * `/public/packages`-аас ирнэ — дашбоардаас багц засахад шууд тусна.
 *
 * ⚠ БАГЦ БИШ ХОЁР МӨР: «1 өдөр» ба «Шүүгээ» нь `packages` хүснэгтэд
 * байхгүй (шүүгээ нь тусдаа модуль). Тэднийг ЭНД гараар барина —
 * үнэ нь өөрчлөгдвөл энэ файлыг засна.
 */

const BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
  'http://localhost:3100/api';

/** `/public/packages`-ийн мөр — зөвхөн самбарт хэрэгтэй талбарууд. */
interface ApiPackage {
  id: string;
  name: string;
  days: number;
  price: number;
  audience: string;
  requiresProof: boolean;
  firstTimeOnly: boolean;
  seats: number;
  payable: boolean;
  basePrice: number | null;
  promotions: ApiPromotion[];
}

interface ApiPromotion {
  name: string;
  kind: 'percent' | 'amount' | 'fixed_price' | 'bonus_days';
  /** Хэдэн төгрөг хөнгөлсөн, эсвэл хэдэн хоног нэмсэн. */
  valueApplied: number;
}

export interface BoardRow {
  key: string;
  name: string;
  price: number;
  /** Урамшууллын ӨМНӨХ үнэ — зураастай харуулна. Хямдраагүй бол `null`. */
  basePrice: number | null;
  /** Жижиг тэмдэглэлүүд: «анх удаа», «2 хүн», «сард 200,000₮». */
  notes: string[];
  /**
   * Урамшуулал бүр ЯАЖ нөлөөлснөөр нь: «Намрын 15% · −37,500₮».
   *
   * Зөвхөн нэр харуулбал давхарласан үед аль нь хэдийг хямдруулсныг
   * хэлж чадахгүй.
   */
  promotions: string[];
}

export interface Board {
  membership: BoardRow[];
  privilege: BoardRow[];
  /**
   * API-гаас ирсэн эсэх.
   *
   * `false` бол доорх нөөц жагсаалт харагдаж байна — хуучирсан байж
   * болзошгүй. Зочинд хоосон самбар үзүүлэхээс дээр.
   */
  live: boolean;
}

const money = (n: number) => `${n.toLocaleString('en-US')}₮`;

/** Сарын үнэ — мянга хүртэл нь дугуйруулна («166,666₮» гэж бичихгүй). */
const perMonth = (price: number, days: number) =>
  `сард ${money(Math.round(price / (days / 30) / 1000) * 1000)}`;

/** Багц биш мөрүүд — `packages` хүснэгтэд байхгүй тул гараар. */
const DAY_PASS: BoardRow = {
  key: 'static-day',
  name: '1 өдөр',
  price: 30_000,
  basePrice: null,
  notes: [],
  promotions: [],
};

const LOCKER: BoardRow = {
  key: 'static-locker',
  name: 'Шүүгээ',
  price: 40_000,
  basePrice: null,
  notes: ['1 сар'],
  promotions: [],
};

/** «Намрын 15% · −37,500₮» эсвэл «Зуны бэлэг · +15 хоног». */
function promoLabel(x: ApiPromotion): string {
  return x.kind === 'bonus_days'
    ? `${x.name} · +${x.valueApplied} хоног`
    : `${x.name} · −${money(x.valueApplied)}`;
}

function toRow(p: ApiPackage): BoardRow {
  const notes: string[] = [];
  if (p.firstTimeOnly) notes.push('анх удаа');
  if (p.seats > 1) notes.push(`${p.seats} хүн`);
  // Урт багцын давуу талыг ТООГООР харуулна: «3 сар 600,000₮» гэхээс
  // «сард 200,000₮» нь 250,000₮-тэй харьцуулахад ойлгомжтой.
  //
  // ⚠ «үнэмлэхээр», «ресепшн дээр» гэсэн тэмдэглэл ЭНД БАЙХГҮЙ: баганын
  // доорх тайлбар хоёуланг нь нэг л удаа хэлдэг. Мөр бүрд давтвал
  // самбар дүүрч, үнэ нь харагдахаа больдог.
  if (p.days >= 60) notes.push(perMonth(p.price, p.days));

  return {
    key: p.id,
    name: p.name,
    price: p.price,
    // Хямдраагүй үед `basePrice` нь `null` ирдэг ч давхар шалгана.
    basePrice: p.basePrice !== null && p.basePrice > p.price ? p.basePrice : null,
    notes,
    promotions: p.promotions.map(promoLabel),
  };
}

/**
 * Хоёр баганад хуваана.
 *
 * Зүүн тал = хүн бүрд нээлттэй, баруун тал = баримт шаардах эсвэл
 * тусгай бүлэг. Заалны хананы самбар яг ийм хуваарьтай.
 */
function toBoard(rows: ApiPackage[]): Board {
  const standard = rows.filter((p) => p.audience === 'standard');
  const special = rows.filter((p) => p.audience !== 'standard');
  return {
    membership: [DAY_PASS, ...standard.map(toRow)],
    privilege: [...special.map(toRow), LOCKER],
    live: true,
  };
}

/**
 * Нөөц жагсаалт — API хариу өгөөгүй үед.
 *
 * ⚠ Зочин хоосон самбар харах нь хамгийн муу төгсгөл: үнэ хаана байгааг
 * олохгүй хүн залгахын оронд буцаад явна. Хуучирсан байж болзошгүй ч
 * ойролцоо үнэ нь юу ч үгүйгээс дээр.
 *
 * ⚠ Багц дашбоардаас өөрчлөгдөхөд ЭНЭ ЖАГСААЛТ ДАГАЖ ШИНЭЧЛЭГДЭХГҮЙ.
 * Зөвхөн API унасан үед харагдана.
 */
const FALLBACK: Board = {
  membership: [
    DAY_PASS,
    { key: 'f1', name: '1 сар (анх удаа)', price: 188_000, basePrice: null, notes: ['анх удаа'], promotions: [] },
    { key: 'f2', name: '1 сар', price: 250_000, basePrice: null, notes: [], promotions: [] },
    { key: 'f3', name: '3 сар', price: 600_000, basePrice: null, notes: ['сард 200,000₮'], promotions: [] },
    { key: 'f4', name: '6 сар', price: 1_000_000, basePrice: null, notes: ['сард 167,000₮'], promotions: [] },
    { key: 'f5', name: '12 сар', price: 1_800_000, basePrice: null, notes: ['сард 148,000₮'], promotions: [] },
    { key: 'f6', name: 'Уурхайчны эрх 14 хоног', price: 150_000, basePrice: null, notes: [], promotions: [] },
  ],
  privilege: [
    { key: 'f7', name: 'Хотхоны оршин суугч 1 сар', price: 200_000, basePrice: null, notes: [], promotions: [] },
    { key: 'f8', name: 'Ахмад настан 1 сар', price: 150_000, basePrice: null, notes: [], promotions: [] },
    { key: 'f9', name: 'Оюутан, сурагч 1 сар', price: 160_000, basePrice: null, notes: [], promotions: [] },
    { key: 'f10', name: 'Оюутан, сурагч 2 сар', price: 300_000, basePrice: null, notes: [], promotions: [] },
    { key: 'f11', name: 'Оюутан, сурагч 3 сар', price: 420_000, basePrice: null, notes: [], promotions: [] },
    { key: 'f12', name: 'Хосын багц 3 сар', price: 1_100_000, basePrice: null, notes: ['2 хүн'], promotions: [] },
    { key: 'f13', name: 'Хосын багц 6 сар', price: 1_800_000, basePrice: null, notes: ['2 хүн'], promotions: [] },
    LOCKER,
  ],
  live: false,
};

/**
 * Үнийн самбарыг татна.
 *
 * ⚠ 5 минут тутам шинэчилнэ (`revalidate`). Зочин бүрд backend рүү
 * хандвал үнийн самбар нь заалны API-гаас хамаарч удаашрах бөгөөд
 * API унахад нүүр хуудас ч унана.
 */
export async function fetchBoard(): Promise<Board> {
  try {
    const res = await fetch(`${BASE}/public/packages`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { packages?: ApiPackage[] };
    if (!data.packages?.length) throw new Error('багц хоосон');
    return toBoard(data.packages);
  } catch {
    // Нам гүм унана — зочинд алдаа биш, үнэ л хэрэгтэй.
    return FALLBACK;
  }
}
