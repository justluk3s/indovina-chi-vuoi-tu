import JSZip from 'jszip';
import type { DeckManifest, ProcessedImage } from './deck.types';
import { DECK_MIME } from './deck.constants';
import { generateId } from '../../shared/utils/generate-id';
import { slugify } from '../../shared/utils/slugify';
export async function exportDeck(name: string, images: ProcessedImage[]): Promise<File> {
  const id = generateId(),
    zip = new JSZip();
  const manifest: DeckManifest = {
    version: 1,
    id,
    name: name.trim(),
    createdAt: new Date().toISOString(),
    characters: images.map((image) => ({
      id: image.characterId,
      imagePath: `images/${image.fileName}`,
      mimeType: image.mimeType,
      byteSize: image.blob.size,
    })),
  };
  zip.file('deck.json', JSON.stringify(manifest));
  for (const image of images) zip.file(`images/${image.fileName}`, image.blob);
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  return new File([blob], `${slugify(name)}.guess`, { type: DECK_MIME });
}
