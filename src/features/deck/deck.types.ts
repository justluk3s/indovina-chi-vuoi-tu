export type DeckImageMimeType = 'image/webp' | 'image/jpeg';
export type CharacterManifest = {
  id: string;
  imagePath: string;
  mimeType: DeckImageMimeType;
  byteSize: number;
};
export type DeckManifestV1 = {
  version: 1;
  id: string;
  name: string;
  createdAt: string;
  characters: CharacterManifest[];
};
export type DeckManifest = DeckManifestV1;
export type LoadedCharacter = { id: string; imageUrl: string; mimeType: DeckImageMimeType };
export type LoadedDeck = {
  id: string;
  name: string;
  characters: LoadedCharacter[];
  dispose: () => void;
};
export type SelectedImage = { localId: string; sourceFile: File; previewUrl: string };
export type ProcessedImage = {
  characterId: string;
  fileName: string;
  mimeType: DeckImageMimeType;
  blob: Blob;
};
