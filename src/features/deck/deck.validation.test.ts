import { describe, it, expect } from 'vitest';
import { validateManifest } from './deck.validation';
import { DeckImportError } from './deck.errors';
const manifest = () => ({
  version: 1,
  id: 'deck',
  name: 'Mazzo',
  createdAt: '2026-01-01T00:00:00.000Z',
  characters: Array.from({ length: 4 }, (_, i) => ({
    id: `id-${i}`,
    imagePath: `images/${i}.webp`,
    mimeType: 'image/webp',
    byteSize: 10,
  })),
});
describe('validateManifest', () => {
  it('accepts valid manifest', () => expect(validateManifest(manifest()).name).toBe('Mazzo'));
  it.each([
    [{}, 'INVALID_MANIFEST'],
    [{ ...manifest(), version: 2 }, 'UNSUPPORTED_VERSION'],
    [{ ...manifest(), characters: [] }, 'INVALID_CHARACTER_COUNT'],
    [
      {
        ...manifest(),
        characters: Array.from({ length: 101 }, (_, i) => ({
          id: String(i),
          imagePath: `images/${i}.webp`,
          mimeType: 'image/webp',
          byteSize: 1,
        })),
      },
      'INVALID_CHARACTER_COUNT',
    ],
    [
      { ...manifest(), characters: [...manifest().characters, { ...manifest().characters[0] }] },
      'DUPLICATE_CHARACTER_ID',
    ],
    [
      {
        ...manifest(),
        characters: [
          ...manifest().characters.slice(0, 3),
          { ...manifest().characters[3], imagePath: 'images/0.webp' },
        ],
      },
      'DUPLICATE_IMAGE_PATH',
    ],
    [
      {
        ...manifest(),
        characters: manifest().characters.map((c, i) =>
          i ? c : { ...c, imagePath: 'images/../x.webp' },
        ),
      },
      'INVALID_PATH',
    ],
    [
      {
        ...manifest(),
        characters: manifest().characters.map((c, i) => (i ? c : { ...c, mimeType: 'image/png' })),
      },
      'INVALID_MANIFEST',
    ],
    [
      {
        ...manifest(),
        characters: manifest().characters.map((c, i) => (i ? c : { ...c, byteSize: 0 })),
      },
      'INVALID_MANIFEST',
    ],
  ])('rejects invalid data', (input, code) => {
    try {
      validateManifest(input);
      throw new Error('expected');
    } catch (e) {
      expect(e).toBeInstanceOf(DeckImportError);
      expect((e as DeckImportError).code).toBe(code);
    }
  });
});
