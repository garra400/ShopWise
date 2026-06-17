import { OcrProgress } from '@/services/ocr';

/**
 * Base OCR engine declaration. The real implementations are platform-specific:
 *   - ocrEngine.web.ts    → Tesseract.js
 *   - ocrEngine.native.ts → Google ML Kit
 * Metro resolves the platform file at bundle time; this base only satisfies the
 * type checker and acts as a safe fallback.
 */
export async function recognizeText(_imageUri: string, _onProgress?: OcrProgress): Promise<string> {
  throw new Error('OCR engine not available on this platform');
}

export const OCR_ENGINE = 'none';
