"use client";

import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { GYM } from "@/lib/gym";
import { date, money } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface PayPackage {
  id: string;
  name: string;
  days: number;
  price: number;
  audience: string;
  audienceLabel: string;
  requiresProof: boolean;
  firstTimeOnly: boolean;
  /** Урамшуулалтай бол анхны утгууд — зурж харуулахад. */
  basePrice: number | null;
  baseDays: number | null;
  /** Давхарласан бүх урамшуулал — хоосон бол энгийн үнэ. */
  promotions: { name: string }[];
  /** Хэдэн хүний эрх вэ. Хосын багц = 2. */
  seats: number;
  /** Онлайнаар төлж болох уу. `false` бол ресепшн дээр авна. */
  payable: boolean;
}

export interface PendingInvoice {
  id: string;
  packageName: string;
  amount: number;
  payUrl: string | null;
  expiresAt: string;
}

/** Хуудасны толгой — фитнесийн нэр. */
/**
 * Нийтэд харагдах төлбөрийн хуудасны толгой.
 *
 * ЯАГААД ЛОГО ХЭРЭГТЭЙ ВЭ: гишүүн банкны апп руу шилжихийн өмнө «зөв
 * газар байна уу» гэдгээ хормын зуур батлах ёстой. Ерөнхий дүрсээс
 * илүү брэндийн тэмдэг итгэл төрүүлнэ.
 *
 * ⚠ Тэмдгийг ашиглана, БҮТЭН wordmark-ыг биш: фитнесийн нэр нь
 * тохиргооноос ирдэг (`gym_name`) тул зурган дээрх «WIN FIT» бичигтэй
 * зөрөх эрсдэлтэй.
 */
export function PayHeader({ gymName }: { gymName: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {/*
        Тэмдэг нь нүүр рүү ХОЛБООС. Гишүүн Wallet карт дээрх шууд
        холбоосоор энд ирдэг тул «буцах» түүх байхгүй — үнэ, цагийн
        хуваарь харах гарц нь зөвхөн энэ.
      */}
      <Link
        href="/"
        aria-label="Нүүр хуудас"
        className="flex size-14 items-center justify-center rounded-2xl bg-neutral-950 shadow-sm"
      >
        <Image
          src="/brand/mark.png"
          alt=""
          width={56}
          height={56}
          className="size-10"
          priority
        />
      </Link>
      <div>
        <p className="text-xl font-semibold tracking-tight">{gymName}</p>
        <p className="text-muted-foreground text-xs">Гишүүнчлэлийн төлбөр</p>
      </div>
    </div>
  );
}

/**
 * Багц сонгож төлөх.
 *
 * Дүнг клиентээс илгээхгүй — зөвхөн `packageId`. Сервер өөрийн үнээр
 * нэхэмжлэх үүсгэнэ.
 */
/**
 * Багцыг ГУРВАН бүлэгт хуваана.
 *
 * ЯАГААД: 13 багцыг нэг жагсаалтаар харуулбал утас дээр гурван дэлгэц
 * гүйлгэнэ. Ихэнх хүн энгийн багц авдаг тул хөнгөлөлттэйг нь тусад нь
 * нуувал жагсаалт хагасаас илүү богиносно.
 *
 * ⚠ `reception` бүлэг нь СОНГОГДОХГҮЙ: хосын багц хоёр гишүүнийг зэрэг
 * заахыг шаарддаг бөгөөд энэ хуудсанд тэр дэлгэц байхгүй. Гэхдээ
 * НУУХГҮЙ — үйлчилгээ байгааг мэдэхгүй хүн асуух ч үгүй.
 */
function split(packages: PayPackage[]) {
  const payable = packages.filter((p) => p.payable);
  return {
    standard: payable.filter((p) => !p.requiresProof),
    discount: payable.filter((p) => p.requiresProof),
    reception: packages.filter((p) => !p.payable),
  };
}

/**
 * Сарын үнэ ба хэмнэлт.
 *
 * Урт багц нь ямар давуутайг ТООГООР харуулна: «6 сар 1,000,000₮» гэхээс
 * «сард 166,667₮ · 33% хэмнэнэ» нь шийдвэр гаргахад тусална.
 *
 * ⚠ Харьцуулах суурь нь ИЖИЛ бүлгийн 30 хоногийн багц: оюутны 2 сарыг
 * энгийн 1 сартай харьцуулбал утгагүй том хэмнэлт гарна.
 */
function value(p: PayPackage, base: number | null) {
  const perMonth = Math.round((p.price / p.days) * 30);
  const save =
    base && p.days > 30 && base > 0
      ? Math.round((1 - perMonth / base) * 100)
      : 0;
  return { perMonth, save: save >= 5 ? save : 0 };
}

/** Нэг багцын мөр — жагсаалт ба цонхонд ижил харагдана. */
function PackageRow({
  p,
  base,
  selected,
  onSelect,
}: {
  p: PayPackage;
  base: number | null;
  selected: boolean;
  onSelect: () => void;
}) {
  const v = value(p, base);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
        selected ? "border-primary bg-primary/5" : "hover:bg-accent/50",
      )}
    >
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium">{p.name}</span>
          {p.firstTimeOnly && (
            <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
              анх удаа
            </span>
          )}
          {p.promotions.map((promo) => (
            <span
              key={promo.name}
              className="rounded bg-emerald-500/12 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400"
            >
              {promo.name}
            </span>
          ))}
        </span>
        <span className="text-muted-foreground text-sm">
          {p.days} хоног
          {p.baseDays !== null && p.baseDays !== p.days && (
            <span className="text-emerald-600 dark:text-emerald-400">
              {" "}
              (+{p.days - p.baseDays})
            </span>
          )}
          {p.days > 30 && ` · сард ${money(v.perMonth)}`}
        </span>
      </span>
      <span className="shrink-0 text-right">
        {p.basePrice !== null && p.basePrice > p.price && (
          <span className="text-muted-foreground block text-xs tabular-nums line-through">
            {money(p.basePrice)}
          </span>
        )}
        <span className="block text-base font-semibold tabular-nums">
          {money(p.price)}
        </span>
        {v.save > 0 && (
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            {v.save}% хэмнэнэ
          </span>
        )}
      </span>
    </button>
  );
}

/**
 * Багц сонгох.
 *
 * ★ ХОЁР ЗОХИОМЖ, НЭГ ЖАГСААЛТ
 *
 * Өргөн дэлгэц дээр жагсаалт нь ХУУДСАН ДЭЭРЭЭ, хоёр баганаар зэрэгцэнэ
 * — 13 багц нэг баганаар бол хоёр дэлгэц гүйлгэнэ, баруун тал нь
 * хоосон үлдэнэ.
 *
 * Утсан дээр жагсаалт нь ЦОНХОНД ордог: багц бүр хоёр мөр эзэлдэг тул
 * хуудсанд шингээвэл «Төлбөр төлөх» товч хэдэн дэлгэцийн доор үлдэж,
 * сонгосон багцаа алддаг. Цонх нь сонголтыг дуусгаад хаагдана —
 * дараагийн алхам нь нэг товч болж үлдэнэ.
 */
export function PackagePicker({
  packages,
  onPay,
  busy,
  error,
}: {
  packages: PayPackage[];
  onPay: (packageId: string) => void;
  busy: boolean;
  error: string | null;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<"standard" | "discount">("standard");
  const [open, setOpen] = useState(false);
  const groups = split(packages);
  const rows = groups[tab];
  const chosen = packages.find((p) => p.id === selected) ?? null;

  /** Бүлэг бүрийн 30 хоногийн суурь үнэ — хэмнэлт тооцоход. */
  const baseOf = (p: PayPackage): number | null => {
    const same = packages.find(
      (x) => x.audience === p.audience && x.days === 30 && !x.firstTimeOnly,
    );
    return same ? same.price : null;
  };

  /**
   * Жагсаалт — хуудсан дээр ч, цонхонд ч ижил.
   *
   * ⚠ `wide` нь ЦОНХОНД `false`: `lg:` нь ДЭЛГЭЦийн өргөнөөр ажилладаг
   * тул цонх 448px байхад ч хоёр багана болж, мөр бүр гурав дөрвөн эгнээ
   * болж эвдэрнэ.
   */
  const list = (onPick: (id: string) => void, wide: boolean) => (
    <div className="space-y-4">
      {groups.discount.length > 0 && (
        <div className="bg-muted/60 grid grid-cols-2 gap-1 rounded-xl p-1">
          {(
            [
              ["standard", "Энгийн"],
              ["discount", "Хөнгөлөлттэй"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                tab === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {tab === "discount" && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/8 px-3 py-2.5 text-sm text-amber-800 dark:text-amber-300">
          Эдгээр багцыг төлсний дараа <strong>эрх шууд нээгдэхгүй</strong>.
          Ресепшн дээр ирж үнэмлэхээ үзүүлснээр ажилтан эрхийг тань нээнэ.
        </p>
      )}

      {/* Өргөн дэлгэцэд хоёр багана — жагсаалт хоёр дахин богиносно. */}
      <div className={cn('grid gap-1.5', wide && 'lg:grid-cols-2')}>
        {rows.map((p) => (
          <PackageRow
            key={p.id}
            p={p}
            base={baseOf(p)}
            selected={selected === p.id}
            onSelect={() => onPick(p.id)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* ── Өргөн дэлгэц: жагсаалт хуудсан дээрээ ── */}
      <div className="hidden lg:block">{list(setSelected, true)}</div>

      {/* ── Утас: цонхоор сонгоно ── */}
      <div className="space-y-3 lg:hidden">
        {chosen ? (
          <div className="border-primary bg-primary/5 flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
            <span className="min-w-0">
              <span className="block font-medium">{chosen.name}</span>
              <span className="text-muted-foreground text-sm">
                {chosen.days} хоног
              </span>
            </span>
            <span className="shrink-0 text-right">
              {chosen.basePrice !== null && chosen.basePrice > chosen.price && (
                <span className="text-muted-foreground block text-xs tabular-nums line-through">
                  {money(chosen.basePrice)}
                </span>
              )}
              <span className="block text-base font-semibold tabular-nums">
                {money(chosen.price)}
              </span>
            </span>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Сунгах хугацаагаа сонгоно уу.
          </p>
        )}

        <Button
          type="button"
          variant={chosen ? "outline" : "default"}
          size="lg"
          className="h-12 w-full text-base"
          onClick={() => setOpen(true)}
        >
          {chosen ? "Багц солих" : "Багц сонгох"}
        </Button>
      </div>

      {error && (
        <p className="text-destructive bg-destructive/8 rounded-lg px-3 py-2.5 text-sm">
          {error}
        </p>
      )}

      <Button
        size="lg"
        className="h-12 w-full text-base"
        disabled={!selected || busy}
        onClick={() => selected && onPay(selected)}
      >
        {busy && <Loader2 className="size-4 animate-spin" />}
        Төлбөр төлөх
      </Button>

      {/* ── Онлайнаар зарагддаггүй багцууд ── */}
      {groups.reception.length > 0 && (
        <div className="space-y-1.5 border-t pt-4">
          <p className="text-muted-foreground text-sm">
            Эдгээр багцыг <strong>ресепшн дээр</strong> авна — хоёулаа
            бүртгүүлэх шаардлагатай тул онлайнаар зарагддаггүй.
          </p>
          <div className="grid gap-1.5 lg:grid-cols-2">
            {groups.reception.map((p) => (
              <div
                key={p.id}
                className="bg-muted/40 flex items-center justify-between gap-3 rounded-xl border border-dashed px-4 py-3"
              >
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="font-medium">{p.name}</span>
                    {/* Урамшууллыг ЭНД ч харуулна: нүүр хуудсан дээрх
                        үнэтэй зөрвөл аль нь үнэн болох нь мэдэгдэхгүй. */}
                    {p.promotions.map((promo) => (
                      <span
                        key={promo.name}
                        className="rounded bg-emerald-500/12 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400"
                      >
                        {promo.name}
                      </span>
                    ))}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {p.days} хоног
                    {p.seats > 1 && ` · ${p.seats} хүн`}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  {p.basePrice !== null && p.basePrice > p.price && (
                    <span className="text-muted-foreground block text-xs tabular-nums line-through">
                      {money(p.basePrice)}
                    </span>
                  )}
                  <span className="block text-base font-semibold tabular-nums">
                    {money(p.price)}
                  </span>
                  <a
                    href={`tel:${GYM.phone}`}
                    className="text-muted-foreground text-[11px] underline underline-offset-2"
                  >
                    {GYM.phoneText}
                  </a>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Утсан дээрх сонгох цонх. Сонгомогц хаагдана — «Болих» дарах
          алхам нэмэх нь хоёр дахин дарах шаардлага үүсгэнэ. */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Багц сонгох</DialogTitle>
          </DialogHeader>
          {list((id) => {
            setSelected(id);
            setOpen(false);
          }, false)}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Төлбөрийн хүлээлт.
 *
 * Банкны апп руу шилжсэний дараа энэ хуудас нээлттэй үлдэнэ — 3 секунд тутам
 * төлөв шалгаж, төлөгдмөгц баталгааг харуулна. Төлөгдсөн эсэхийг ЗӨВХӨН
 * webhook шийддэг тул энэ нь зөвхөн дэлгэц шинэчлэх зорилготой.
 */
export function PayWaiting({
  invoice,
  onPaid,
}: {
  invoice: PendingInvoice;
  onPaid: () => void;
}) {
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (paid) return;
    const id = setInterval(() => {
      api
        .get<{ status: string }>(`/public/invoices/${invoice.id}`)
        .then((r) => {
          if (r.status === "paid") {
            setPaid(true);
            onPaid();
          }
        })
        .catch(() => undefined);
    }, 3000);
    return () => clearInterval(id);
  }, [invoice.id, paid, onPaid]);

  if (paid) {
    return (
      <Card className="border-emerald-500/40">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <CheckCircle2 className="size-10 text-emerald-500" />
          <div>
            <p className="text-lg font-semibold">Төлбөр амжилттай</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Таны эрх сунгагдлаа. Терминал дээр шууд нэвтэрч болно.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">{invoice.packageName}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {money(invoice.amount)}
          </p>
        </div>

        {invoice.payUrl && (
          <Button
            size="lg"
            className="h-12 w-full text-base"
            nativeButton={false}
            render={
              <a
                href={invoice.payUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Банкны аппаар төлөх
            <ExternalLink className="size-4" />
          </Button>
        )}

        <div className="flex items-center justify-center gap-2">
          <Loader2 className="text-muted-foreground size-3.5 animate-spin" />
          <p className="text-muted-foreground text-xs">
            Төлбөр хийгдмэгц энэ хуудас өөрөө шинэчлэгдэнэ
          </p>
        </div>

        <p className="text-muted-foreground text-center text-xs">
          Нэхэмжлэх {date(invoice.expiresAt)}-ны дотор хүчинтэй
        </p>
      </CardContent>
    </Card>
  );
}
