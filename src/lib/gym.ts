/**
 * Заалны бодит мэдээлэл — НЭГ эх сурвалж.
 *
 * ⚠ Утас, хаяг нь нүүр хуудас, хөл, байршил, бүтцэлсэн өгөгдөл (JSON-LD)
 * гэсэн дөрвөн газар харагдана. Тус бүрд нь бичвэл нэгийг нь солиход
 * үлдсэн гурав нь хуучин дугаарыг үзүүлсээр байна.
 */
export const GYM = {
  name: 'WIN FIT',
  legalName: 'Win Fit Fitness',
  city: 'Улаанбаатар',

  /** Google Maps дээрх байршлаас авсан. */
  lat: 47.8703125,
  lon: 106.8483125,
  mapsPlaceUrl: 'https://maps.app.goo.gl/zMCU6YAdfinznJiD9',

  /** Дуудлагын холбоос ба хүнд харагдах хэлбэр тусдаа. */
  phone: '+97688303969',
  phoneText: '8830 3969',

  facebook: 'https://www.facebook.com/people/Win-Fit-Fitness',
  instagram: 'https://www.instagram.com/win.fit.fitness',
  instagramHandle: 'win.fit.fitness',

  hours: [
    { days: 'Даваа – Баасан', time: '06:00 – 22:00' },
    { days: 'Бямба, Ням', time: '08:00 – 21:00' },
  ],
} as const;

/**
 * OpenStreetMap-ийн суулгац.
 *
 * ЯАГААД Google БИШ ВЭ: Google Maps-ийн `embed` нь API түлхүүр эсвэл
 * гараар үүсгэсэн `pb=` мөр шаарддаг — хоёул хэврэг. OSM нь түлхүүргүй,
 * үнэгүй, мөрдөх cookie тавьдаггүй. Google руу орох холбоосыг нь
 * зэрэгцүүлж өгсөн тул чиглүүлэг хэрэгтэй хүн тэндээс явна.
 */
export function osmEmbedUrl(): string {
  const { lat, lon } = GYM;
  const d = 0.006;
  const bbox = [lon - d, lat - d / 2, lon + d, lat + d / 2]
    .map((n) => n.toFixed(5))
    .join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
}
