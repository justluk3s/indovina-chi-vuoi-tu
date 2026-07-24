export async function decodeImage(
  blob: Blob,
): Promise<{ width: number; height: number; draw: CanvasImageSource; close: () => void }> {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(blob);
    return {
      width: bitmap.width,
      height: bitmap.height,
      draw: bitmap,
      close: () => bitmap.close(),
    };
  }
  const url = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Immagine non leggibile'));
      el.src = url;
    });
    return { width: image.naturalWidth, height: image.naturalHeight, draw: image, close: () => {} };
  } finally {
    URL.revokeObjectURL(url);
  }
}
