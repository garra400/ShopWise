// Real OCR is free & on-device: Tesseract.js on web, Google ML Kit on native.
// The engine is selected by Metro via platform-specific files (ocrEngine.web/native).
import { parseReceiptText } from '@/services/ocrParser';
import { recognizeText } from '@/services/ocrEngine';

export interface ReceiptItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export type OcrProgress = (status: string, progress: number) => void;

const ALL_ITEMS: ReceiptItem[] = [
  { name: 'Leite Integral', quantity: 1, unit: 'L', category: 'Laticínios' },
  { name: 'Pão de Forma', quantity: 1, unit: 'un', category: 'Padaria' },
  { name: 'Ovos', quantity: 12, unit: 'un', category: 'Laticínios' },
  { name: 'Tomate', quantity: 1, unit: 'kg', category: 'Hortifruti' },
  { name: 'Frango', quantity: 1, unit: 'kg', category: 'Carnes' },
  { name: 'Arroz', quantity: 5, unit: 'kg', category: 'Mercearia' },
  { name: 'Feijão', quantity: 1, unit: 'kg', category: 'Mercearia' },
  { name: 'Iogurte', quantity: 4, unit: 'un', category: 'Laticínios' },
  { name: 'Queijo Mussarela', quantity: 500, unit: 'g', category: 'Laticínios' },
  { name: 'Banana', quantity: 1, unit: 'kg', category: 'Hortifruti' },
  { name: 'Manteiga', quantity: 200, unit: 'g', category: 'Laticínios' },
  { name: 'Macarrão', quantity: 1, unit: 'un', category: 'Mercearia' },
  { name: 'Alho', quantity: 1, unit: 'un', category: 'Hortifruti' },
  { name: 'Cebola', quantity: 1, unit: 'kg', category: 'Hortifruti' },
  { name: 'Azeite', quantity: 500, unit: 'ml', category: 'Mercearia' },
];

/** Simulate OCR scanning with a ~1500ms delay, returning 4–7 random items */
export async function recognizeReceipt(): Promise<ReceiptItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Shuffle and pick 4–7 items
  const shuffled = [...ALL_ITEMS].sort(() => Math.random() - 0.5);
  const count = 4 + Math.floor(Math.random() * 4); // 4, 5, 6, or 7
  return shuffled.slice(0, count);
}

/**
 * Run real OCR on an image URI using the platform engine (Tesseract on web,
 * ML Kit on native). If the engine errors or the parser finds nothing usable,
 * falls back to the mock recognizeReceipt().
 */
export async function recognizeReceiptFromImage(
  imageUri: string,
  onProgress?: OcrProgress,
): Promise<{ items: ReceiptItem[]; usedFallback: boolean; rawText: string }> {
  try {
    const rawText = await recognizeText(imageUri, onProgress);
    const items = parseReceiptText(rawText);

    if (items.length === 0) {
      // OCR ran but parser found nothing useful — fall back to mock
      const mockItems = await recognizeReceipt();
      return { items: mockItems, usedFallback: true, rawText };
    }

    return { items, usedFallback: false, rawText };
  } catch {
    // Any error (missing native module, network for lang data, etc.) → mock fallback
    const items = await recognizeReceipt();
    return { items, usedFallback: true, rawText: '' };
  }
}
