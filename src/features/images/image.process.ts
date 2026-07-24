import type { ProcessedImage } from '../deck/deck.types';
import { decodeImage } from './image.decode';
import { validateSourceImage } from './image.validation';
const blobFrom = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Impossibile elaborare la foto'))),
      type,
      quality,
    ),
  );
export async function processImage(
  file: File,
  characterId: string,
  index: number,
): Promise<ProcessedImage> {
  validateSourceImage(file);
  const decoded = await decodeImage(file);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas non disponibile');
    const side = Math.min(decoded.width, decoded.height),
      sx = (decoded.width - side) / 2,
      sy = (decoded.height - side) / 2;
    ctx.drawImage(decoded.draw, sx, sy, side, side, 0, 0, 512, 512);
    let blob = await blobFrom(canvas, 'image/webp', 0.8);
    const mimeType: ProcessedImage['mimeType'] =
      blob.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
    if (mimeType === 'image/jpeg') blob = await blobFrom(canvas, 'image/jpeg', 0.85);
    return {
      characterId,
      fileName: `${String(index + 1).padStart(4, '0')}.${mimeType === 'image/webp' ? 'webp' : 'jpg'}`,
      mimeType,
      blob,
    };
  } finally {
    decoded.close();
  }
}
