/**
 * Нийтийн API клиент.
 *
 * ⚠ Dashboard-ынхаас ЯЛГААТАЙ: энд нэвтрэлт БАЙХГҮЙ. Landing нь зөвхөн
 * `/public/*` замуудыг дууддаг тул токен, refresh, 401-ийн логик
 * хэрэггүй. Тэдгээрийг хуулж авбал хэрэглэгдэхгүй код хуримтлагдана.
 */
const BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
  'http://localhost:3100/api';

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

async function request<T>(
  path: string,
  opts: { method?: string; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? 'GET',
    headers: opts.body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    signal: opts.signal,
  });

  const text = await res.text();
  const data: unknown = text ? JSON.parse(text) : null;

  if (!res.ok) {
    // Серверийн мессежийг ил гаргана — «алдаа гарлаа» гэхээс илүү
    // «Энэ дугаар бүртгэлгүй байна» гэдэг нь хэрэглэгчид тустай.
    const msg =
      (data as { message?: string | string[] } | null)?.message ??
      `Алдаа гарлаа (${res.status})`;
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body }),
};
