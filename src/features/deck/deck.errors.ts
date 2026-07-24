export type DeckImportErrorCode =
  | 'FILE_TOO_LARGE'
  | 'INVALID_ARCHIVE'
  | 'TOO_MANY_ENTRIES'
  | 'MANIFEST_MISSING'
  | 'MANIFEST_TOO_LARGE'
  | 'INVALID_JSON'
  | 'INVALID_MANIFEST'
  | 'UNSUPPORTED_VERSION'
  | 'INVALID_CHARACTER_COUNT'
  | 'INVALID_PATH'
  | 'DUPLICATE_CHARACTER_ID'
  | 'DUPLICATE_IMAGE_PATH'
  | 'IMAGE_MISSING'
  | 'IMAGE_TOO_LARGE'
  | 'TOTAL_UNCOMPRESSED_SIZE_EXCEEDED'
  | 'UNSUPPORTED_IMAGE_TYPE'
  | 'IMAGE_SIZE_MISMATCH'
  | 'IMAGE_DECODE_FAILED';
const messages: Record<DeckImportErrorCode, string> = {
  FILE_TOO_LARGE: 'Il file è troppo grande.',
  INVALID_ARCHIVE: 'L’archivio non è valido.',
  TOO_MANY_ENTRIES: 'L’archivio contiene troppi file.',
  MANIFEST_MISSING: 'Manca il manifest del mazzo.',
  MANIFEST_TOO_LARGE: 'Il manifest è troppo grande.',
  INVALID_JSON: 'Il manifest non contiene JSON valido.',
  INVALID_MANIFEST: 'Il manifest del mazzo non è valido.',
  UNSUPPORTED_VERSION: 'Questa versione del mazzo non è supportata.',
  INVALID_CHARACTER_COUNT: 'Il mazzo deve contenere da 4 a 100 persone.',
  INVALID_PATH: 'Un percorso immagine non è sicuro.',
  DUPLICATE_CHARACTER_ID: 'Il mazzo contiene identificativi duplicati.',
  DUPLICATE_IMAGE_PATH: 'Il mazzo contiene immagini duplicate.',
  IMAGE_MISSING: 'Manca un’immagine del mazzo.',
  IMAGE_TOO_LARGE: 'Un’immagine è troppo grande.',
  TOTAL_UNCOMPRESSED_SIZE_EXCEEDED: 'Le immagini estratte sono troppo grandi.',
  UNSUPPORTED_IMAGE_TYPE: 'Il tipo di un’immagine non è supportato.',
  IMAGE_SIZE_MISMATCH: 'La dimensione di un’immagine non corrisponde al manifest.',
  IMAGE_DECODE_FAILED: 'Non è possibile leggere una delle immagini.',
};
export class DeckImportError extends Error {
  constructor(public readonly code: DeckImportErrorCode) {
    super(messages[code]);
    this.name = 'DeckImportError';
  }
}
