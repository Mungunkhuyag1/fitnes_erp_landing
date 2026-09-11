/**
 * Сошиалын тэмдгүүд.
 *
 * ⚠ lucide-react@1-ээс брэндийн icon-ууд ХАСАГДСАН (Instagram,
 * Facebook). Тиймээс энд гараар зурав. Зузаан, хэмжээ нь бусад
 * lucide icon-той таарна: 24×24 хүрээ, 2px зураас, currentColor.
 */
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function InstagramMark({ className }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookMark({ className }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
