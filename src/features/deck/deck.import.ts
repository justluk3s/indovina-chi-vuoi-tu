import JSZip from 'jszip';
import {
  MAX_COMPRESSED_BYTES,
  MAX_ENTRIES,
  MAX_IMAGE_BYTES,
  MAX_MANIFEST_BYTES,
  MAX_TOTAL_BYTES,
} from './deck.constants';
import { DeckImportError } from './deck.errors';
import type { LoadedDeck } from './deck.types';
import { validateManifest } from './deck.validation';
import { ObjectUrlRegistry } from '../../shared/browser/object-url-registry';
import { decodeImage } from '../images/image.decode';
export async function importDeck(file: File): Promise<LoadedDeck> {
  if (file.size > MAX_COMPRESSED_BYTES) throw new DeckImportError('FILE_TOO_LARGE');
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(await file.arrayBuffer());
  } catch {
    throw new DeckImportError('INVALID_ARCHIVE');
  }
  const entries = Object.values(zip.files);
  if (entries.length > MAX_ENTRIES) throw new DeckImportError('TOO_MANY_ENTRIES');
  const manifestEntry = zip.file('deck.json');
  if (!manifestEntry) throw new DeckImportError('MANIFEST_MISSING');
  let raw: unknown;
  try {
    const content = await manifestEntry.async('string');
    if (new Blob([content]).size > MAX_MANIFEST_BYTES)
      throw new DeckImportError('MANIFEST_TOO_LARGE');
    raw = JSON.parse(content) as unknown;
  } catch (error) {
    if (error instanceof DeckImportError) throw error;
    throw new DeckImportError('INVALID_JSON');
  }
  const manifest = validateManifest(raw);
  if (manifest.characters.reduce((total, c) => total + c.byteSize, 0) > MAX_TOTAL_BYTES)
    throw new DeckImportError('TOTAL_UNCOMPRESSED_SIZE_EXCEEDED');
  const registry = new ObjectUrlRegistry();
  let extracted = 0;
  try {
    const characters = [];
    for (const character of manifest.characters) {
      const entry = zip.file(character.imagePath);
      if (!entry) throw new DeckImportError('IMAGE_MISSING');
      const blob = await entry.async('blob');
      extracted += blob.size;
      if (blob.size > MAX_IMAGE_BYTES) throw new DeckImportError('IMAGE_TOO_LARGE');
      if (extracted > MAX_TOTAL_BYTES)
        throw new DeckImportError('TOTAL_UNCOMPRESSED_SIZE_EXCEEDED');
      if (blob.size !== character.byteSize) throw new DeckImportError('IMAGE_SIZE_MISMATCH');
      if (blob.type && blob.type !== character.mimeType)
        throw new DeckImportError('UNSUPPORTED_IMAGE_TYPE');
      try {
        const decoded = await decodeImage(blob);
        decoded.close();
      } catch {
        throw new DeckImportError('IMAGE_DECODE_FAILED');
      }
      characters.push({
        id: character.id,
        imageUrl: registry.create(new Blob([blob], { type: character.mimeType })),
        mimeType: character.mimeType,
      });
    }
    let disposed = false;
    return {
      id: manifest.id,
      name: manifest.name,
      characters,
      dispose: () => {
        if (!disposed) {
          disposed = true;
          registry.revokeAll();
        }
      },
    };
  } catch (error) {
    registry.revokeAll();
    throw error;
  }
}
