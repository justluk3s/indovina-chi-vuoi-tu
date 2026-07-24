export function canShareFile(file: File) {
  return typeof navigator.share === 'function' && navigator.canShare?.({ files: [file] }) === true;
}
export async function shareDeck(file: File, name: string) {
  try {
    await navigator.share?.({ title: name, text: 'Mazzo di Indovina-Chi-Vuoi-Tu', files: [file] });
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return false;
    throw error;
  }
}
