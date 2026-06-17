import { differenceInCalendarDays, parse, format } from 'date-fns';
import { Product, ProductStatus } from '@/types';

/** Parse ISO date string (yyyy-MM-dd) to Date */
function parseIso(iso: string): Date {
  return parse(iso, 'yyyy-MM-dd', new Date());
}

export function getStatus(product: Product): ProductStatus {
  const expiry = parseIso(product.expiryDate);
  const today = new Date();
  const days = differenceInCalendarDays(expiry, today);

  if (days < 0) return 'expired';
  if (days <= 6) return 'at_risk';
  if (days <= 30) return 'expiring_soon';
  return 'good';
}

export function statusLabel(status: ProductStatus): string {
  switch (status) {
    case 'good': return 'Bom';
    case 'expiring_soon': return 'Para Vencer';
    case 'at_risk': return 'Em Risco';
    case 'expired': return 'Vencido';
  }
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

export function daysLabel(product: Product): string {
  const expiry = parseIso(product.expiryDate);
  const today = new Date();
  const days = differenceInCalendarDays(expiry, today);

  if (days === 0) return 'Vence hoje';
  if (days < 0) return `Vencido há ${Math.abs(days)} dia${Math.abs(days) === 1 ? '' : 's'}`;
  return `Vence em ${days} dia${days === 1 ? '' : 's'}`;
}

export function formatDate(iso: string): string {
  try {
    return format(parseIso(iso), 'dd/MM/yyyy');
  } catch {
    return iso;
  }
}
