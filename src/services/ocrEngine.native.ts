import { OcrProgress } from '@/services/ocr';

/**
 * Native OCR engine — Google ML Kit text recognition (free, on-device, offline).
 * Dynamically imported so the native module is never pulled into the web bundle.
 */
export async function recognizeText(imageUri: string, onProgress?: OcrProgress): Promise<string> {
  onProgress?.('Reconhecendo texto…', 0.3);
  const TextRecognition = (await import('@react-native-ml-kit/text-recognition')).default;
  const result = await TextRecognition.recognize(imageUri);
  onProgress?.('Concluído', 1);
  return result?.text ?? '';
}

export const OCR_ENGINE = 'mlkit';
