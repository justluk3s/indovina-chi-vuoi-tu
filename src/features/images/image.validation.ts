import { MAX_SOURCE_IMAGE_BYTES } from './image.constants';
export function validateSourceImage(file: File) {
  if (file.size > MAX_SOURCE_IMAGE_BYTES)
    throw new Error('Ogni fotografia deve pesare al massimo 25 MB.');
  if (
    file.type &&
    !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) &&
    !file.type.startsWith('image/')
  )
    throw new Error('Formato immagine non supportato.');
}
