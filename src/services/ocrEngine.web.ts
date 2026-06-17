import { OcrProgress } from '@/services/ocr';

/**
 * Web OCR engine — Tesseract.js (free, on-device in the browser).
 * Dynamically imported so it is code-split and only loaded when used.
 */
export async function recognizeText(imageUri: string, onProgress?: OcrProgress): Promise<string> {
  const Tesseract = (await import('tesseract.js')).default;
  const { data } = await Tesseract.recognize(imageUri, 'por', {
    logger: (m: { status: string; progress?: number }) => onProgress?.(m.status, m.progress ?? 0),
  });
  return data.text ?? '';
}

export const OCR_ENGINE = 'tesseract';
