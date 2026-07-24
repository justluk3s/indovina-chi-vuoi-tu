import type { DeckImageMimeType, DeckManifest } from './deck.types';
import { DeckImportError } from './deck.errors';
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const validPath = (path: string) =>
  /^images\/[a-zA-Z0-9_-]+\.(webp|jpg)$/.test(path) && !path.includes('..') && !path.includes('\\');
export function validateManifest(value: unknown): DeckManifest {
  if (!isObject(value)) throw new DeckImportError('INVALID_MANIFEST');
  if (value.version !== 1)
    throw new DeckImportError(
      typeof value.version === 'number' ? 'UNSUPPORTED_VERSION' : 'INVALID_MANIFEST',
    );
  if (
    typeof value.id !== 'string' ||
    !value.id ||
    value.id.length > 100 ||
    typeof value.name !== 'string' ||
    value.name.trim().length < 1 ||
    value.name.length > 80 ||
    typeof value.createdAt !== 'string' ||
    Number.isNaN(Date.parse(value.createdAt)) ||
    !Array.isArray(value.characters)
  )
    throw new DeckImportError('INVALID_MANIFEST');
  if (value.characters.length < 4 || value.characters.length > 100)
    throw new DeckImportError('INVALID_CHARACTER_COUNT');
  const ids = new Set<string>(),
    paths = new Set<string>();
  const characters = value.characters.map((raw) => {
    if (
      !isObject(raw) ||
      typeof raw.id !== 'string' ||
      !raw.id ||
      raw.id.length > 100 ||
      typeof raw.imagePath !== 'string' ||
      !validPath(raw.imagePath) ||
      (raw.mimeType !== 'image/webp' && raw.mimeType !== 'image/jpeg') ||
      typeof raw.byteSize !== 'number' ||
      !Number.isInteger(raw.byteSize) ||
      raw.byteSize <= 0 ||
      raw.byteSize > 2 * 1024 * 1024
    )
      throw new DeckImportError(
        !isObject(raw) || typeof raw.imagePath !== 'string' || !validPath(raw.imagePath)
          ? 'INVALID_PATH'
          : 'INVALID_MANIFEST',
      );
    if (ids.has(raw.id)) throw new DeckImportError('DUPLICATE_CHARACTER_ID');
    if (paths.has(raw.imagePath)) throw new DeckImportError('DUPLICATE_IMAGE_PATH');
    ids.add(raw.id);
    paths.add(raw.imagePath);
    return {
      id: raw.id,
      imagePath: raw.imagePath,
      mimeType: raw.mimeType as DeckImageMimeType,
      byteSize: raw.byteSize,
    };
  });
  return {
    version: 1,
    id: value.id,
    name: value.name.trim(),
    createdAt: value.createdAt,
    characters,
  };
}
