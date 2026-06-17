import { ReceiptItem } from '@/services/ocr';

/**
 * Tiny handoff buffer so the QR-scan screen can pass recognized items to the
 * review screen (add/scan) without serializing arrays through route params.
 */
let pending: ReceiptItem[] | null = null;

export function setPendingScan(items: ReceiptItem[]): void {
  pending = items;
}

export function takePendingScan(): ReceiptItem[] | null {
  const p = pending;
  pending = null;
  return p;
}
