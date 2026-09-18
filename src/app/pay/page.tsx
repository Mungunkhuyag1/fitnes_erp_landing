'use client';

import { Loader2, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  PackagePicker,
  PayHeader,
  PayWaiting,
  type PayPackage,
  type PendingInvoice,
} from '@/components/pay-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/hooks/use-api';
import { api } from '@/lib/api';
import { phone as fmtPhone } from '@/lib/format';

interface Lookup {
  found: boolean;
  maskedName?: string;
}

/**
 * 1-Р ТҮВШИН — утасны дугаараар төлөх.
 *
 * Хэн ч дугаар бичиж болох тул энд ЗӨВХӨН далдалсан нэр харагдана
 * («зөв хүн мөн үү» гэдгийг батлахад хангалттай). Эрхийн огноо, ирц, түүхийг
 * харахын тулд Wallet карт дээрх хувийн линкээр орно
 * (docs/01-integration-model.md §6.6).
 */
function PayByPhone() {
  // Нүүр хуудаснаас дугаараа бичээд ирсэн бол `?phone=` дагуулж ирнэ.
  const preset = useSearchParams().get('phone') ?? '';
  const { data: cfg } = useApi<{ gymName: string; packages: PayPackage[] }>(
    '/public/packages',
  );
  const [phone, setPhone] = useState(preset);
  const [name, setName] = useState('');
  const [justRegistered, setJustRegistered] = useState(false);
  const [found, setFound] = useState<Lookup | null>(null);
  const [invoice, setInvoice] = useState<PendingInvoice | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (value: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<Lookup>('/public/lookup', { phone: value });
      setFound(res);
      /*
       * ⚠ Олдоогүй нь АЛДАА БИШ. Урьд нь «Ресепшнд хандана уу» гэж
       * мухардуулдаг байсан: шөнө дунд эрх авах гэж орсон хүн маргааш
       * хүртэл хүлээнэ. Одоо доор нь бүртгэлийн маягт гарна.
       */
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа');
    } finally {
      setBusy(false);
    }
  }, []);

  function lookup(e: React.FormEvent) {
    e.preventDefault();
    void search(phone);
  }

  /*
   * Нүүрэн дээр дугаараа бичсэн хүнд дахин «Үргэлжлүүлэх» даруулах нь
   * утгагүй — шууд хайна.
   *
   * ⚠ `ran` хамгаалалт ЗААВАЛ: React-ийн strict горимд effect хоёр удаа
   * ажилладаг ба түүнгүйгээр хоёр хайлт зэрэг явж, хоёр дахь нь эхнийхийг
   * дарж бичнэ.
   */
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current || preset.replace(/\D/g, '').length < 8) return;
    ran.current = true;
    void search(preset);
  }, [preset, search]);

  /** Онлайнаар өөрөө бүртгүүлэх — нэр, утас хоёроор. */
  async function register(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<Lookup & { created?: boolean }>(
        '/public/register',
        { name: name.trim(), phone },
      );
      setFound(res);
      setJustRegistered(res.created === true);
      if (!res.found) {
        setError('Бүртгэл үүсгэж чадсангүй. Ресепшнд хандана уу.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа');
    } finally {
      setBusy(false);
    }
  }

  async function pay(packageId: string) {
    setBusy(true);
    setError(null);
    try {
      const inv = await api.post<PendingInvoice>('/public/invoices', {
        phone,
        packageId,
      });
      setInvoice(inv);
      // ★ Bonum-ын хуудас руу ШУУД шилжинэ — нэмэлт дарах алхам хэрэггүй.
      // `payUrl` ирээгүй бол хүлээлтийн дэлгэц дээрх товч нөөц болж үлдэнэ.
      if (inv.payUrl) window.location.href = inv.payUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа');
    } finally {
      setBusy(false);
    }
  }

  return (
    /*
     * ⚠ Өргөн дэлгэцэд ч 448px-ийн багана байсан: 13 багц нэг баганаар
     * урсаж, дэлгэцийн 70% нь хоосон байв. Одоо алхам бүр өөрийн
     * өргөнийг авна — дугаар бичих нь нарийхан, багц сонгох нь өргөн.
     */
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <PayHeader gymName={cfg?.gymName ?? 'WinFit'} />

      {invoice ? (
        <div className="mx-auto w-full max-w-md">
          <PayWaiting
            invoice={invoice}
            onPaid={() => undefined}
            firstTime={justRegistered}
          />
        </div>
      ) : found && !found.found ? (
        /*
         * ── Бүртгэлгүй хүн ──
         * Утас нь аль хэдийн бичигдсэн тул зөвхөн нэр асууна. Хүйс,
         * төрсөн огноо зэргийг ресепшн дээр нөхнө — танихгүй хүнээс
         * анхны маягтад бүтэн анкет нэхэх нь бүртгэлийг тасалдаг.
         */
        <Card className="mx-auto w-full max-w-md">
          <CardContent className="py-6">
            <form onSubmit={register} className="space-y-4">
              <div>
                <p className="font-medium">Шинээр бүртгүүлэх</p>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {fmtPhone(phone)} дугаар бүртгэлгүй байна. Нэрээ бичээд
                  үргэлжлүүлнэ үү.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Нэр</Label>
                <Input
                  id="name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Батаа"
                  className="h-12 text-base"
                />
              </div>

              {error && (
                <p className="text-destructive bg-destructive/8 rounded-lg px-3 py-2.5 text-sm">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full text-base"
                disabled={busy || name.trim().length < 2}
              >
                {busy && <Loader2 className="size-4 animate-spin" />}
                Бүртгүүлээд үргэлжлүүлэх
              </Button>

              <button
                type="button"
                onClick={() => {
                  setFound(null);
                  setError(null);
                }}
                className="text-muted-foreground hover:text-foreground w-full text-center text-sm"
              >
                Өөр дугаар оруулах
              </button>

              <p className="text-muted-foreground text-xs">
                Бүртгүүлээд эрхээ онлайнаар авна. Анх удаа ирэхдээ ресепшн
                дээр царайгаа бүртгүүлснээр терминал таныг таних болно.
              </p>
            </form>
          </CardContent>
        </Card>
      ) : !found ? (
        <Card className="mx-auto w-full max-w-md">
          <CardContent className="py-6">
            <form onSubmit={lookup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Утасны дугаар</Label>
                <div className="relative">
                  <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    id="phone"
                    inputMode="tel"
                    autoFocus
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="99112233"
                    className="h-12 pl-9 text-base"
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Фитнест бүртгүүлсэн дугаараа оруулна уу
                </p>
              </div>

              {error && (
                <p className="text-destructive bg-destructive/8 rounded-lg px-3 py-2.5 text-sm">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full text-base"
                disabled={busy || phone.trim().length < 8}
              >
                {busy && <Loader2 className="size-4 animate-spin" />}
                Үргэлжлүүлэх
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        /*
         * Өргөн дэлгэцэд хэн болох нь ЗҮҮН талд тогтоно, багцууд баруун
         * талд урсана — гишүүн гүйлгэх явцад «зөв бүртгэл дээр байна уу»
         * гэдгээ харсаар байна.
         */
        <div className="grid gap-4 lg:grid-cols-[300px_1fr] lg:items-start lg:gap-8">
          <div className="space-y-3 lg:sticky lg:top-10">
            <Card>
              <CardContent className="py-4 text-center lg:text-left">
                <p className="text-muted-foreground text-xs">Бүртгэл олдлоо</p>
                <p className="mt-0.5 text-lg font-semibold">
                  {found.maskedName}
                </p>
              </CardContent>
            </Card>

            <button
              type="button"
              onClick={() => {
                setFound(null);
                setError(null);
              }}
              className="text-muted-foreground hover:text-foreground w-full text-center text-sm lg:text-left"
            >
              Өөр дугаар оруулах
            </button>
          </div>

          <PackagePicker
            packages={cfg?.packages ?? []}
            onPay={pay}
            busy={busy}
            error={error}
          />
        </div>
      )}

      <p className="text-muted-foreground mt-auto text-center text-xs">
        Эрхийн дэлгэрэнгүйг Wallet карт дээрх «Эрх сунгах» холбоосоор харна
      </p>
    </main>
  );
}

/**
 * `useSearchParams` нь Suspense шаарддаг — эс бөгөөс бүх хуудас
 * динамик болно.
 */
export default function PayByPhonePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-svh items-center justify-center">
          <Loader2 className="text-muted-foreground size-5 animate-spin" />
        </main>
      }
    >
      <PayByPhone />
    </Suspense>
  );
}
