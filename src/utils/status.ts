import { differenceInCalendarDays, parse, format } from 'date-fns';
import { Product, ProductStatus } from '@/types';
import type { Lang } from '@/i18n';

/** Parse ISO date string (yyyy-MM-dd) to Date */
function parseIso(iso: string): Date {
  return parse(iso, 'yyyy-MM-dd', new Date());
}

/**
 * Alert windows (days remaining) BY food type. Highly perishable items
 * (meat, produce, bakery) only warn when very close; shelf-stable ones
 * (grocery, drinks) get a wider window. Assumes proper storage.
 */
type StatusWindow = { atRisk: number; expiring: number };
// Windows are small (warn only in the LAST few days) and always smaller than the
// item's default shelf life, so a freshly-bought item starts as "Bom".
const STATUS_WINDOWS: Record<string, StatusWindow> = {
  Carnes: { atRisk: 2, expiring: 3 },
  Hortifruti: { atRisk: 1, expiring: 3 },
  Padaria: { atRisk: 1, expiring: 2 },
  Laticínios: { atRisk: 2, expiring: 4 },
  Bebidas: { atRisk: 2, expiring: 4 },
  Mercearia: { atRisk: 5, expiring: 15 },
  Outros: { atRisk: 2, expiring: 5 },
};

export function getStatus(product: Product): ProductStatus {
  const expiry = parseIso(product.expiryDate);
  const today = new Date();
  const days = differenceInCalendarDays(expiry, today);

  if (days < 0) return 'expired';
  const w = STATUS_WINDOWS[product.category] ?? STATUS_WINDOWS.Outros;
  if (days <= w.atRisk) return 'at_risk';
  if (days <= w.expiring) return 'expiring_soon';
  return 'good';
}

const STATUS_LABELS: Record<Lang, Record<ProductStatus, string>> = {
  pt: { good: 'Bom', expiring_soon: 'Para vencer', at_risk: 'Em risco', expired: 'Vencido' },
  en: { good: 'Good', expiring_soon: 'Expiring', at_risk: 'At risk', expired: 'Expired' },
};

export function statusLabel(status: ProductStatus, lang: Lang = 'pt'): string {
  return STATUS_LABELS[lang][status];
}

export function statusColor(status: ProductStatus): string {
  switch (status) {
    case 'good': return '#2EAD5B';
    case 'expiring_soon': return '#E0A100';
    case 'at_risk': return '#D64545';
    case 'expired': return '#8A8F98';
  }
}

export function statusIcon(status: ProductStatus): string {
  switch (status) {
    case 'good': return 'checkmark-circle';
    case 'expiring_soon': return 'time';
    case 'at_risk': return 'warning';
    case 'expired': return 'close-circle';
  }
}

export function daysLabel(product: Product, lang: Lang = 'pt'): string {
  const expiry = parseIso(product.expiryDate);
  const today = new Date();
  const days = differenceInCalendarDays(expiry, today);
  const n = Math.abs(days);

  if (lang === 'en') {
    if (days === 0) return 'Expires today';
    if (days < 0) return `Expired ${n} day${n === 1 ? '' : 's'} ago`;
    return `Expires in ${days} day${days === 1 ? '' : 's'}`;
  }
  if (days === 0) return 'Vence hoje';
  if (days < 0) return `Vencido há ${n} dia${n === 1 ? '' : 's'}`;
  return `Vence em ${days} dia${days === 1 ? '' : 's'}`;
}

export function formatDate(iso: string): string {
  try {
    return format(parseIso(iso), 'dd/MM/yyyy');
  } catch {
    return iso;
  }
}
