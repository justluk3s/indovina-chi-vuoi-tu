import { useEffect, useRef, useState } from 'react';
import type { SelectedImage } from '../features/deck/deck.types';
import { generateId } from '../shared/utils/generate-id';
import { processImage } from '../features/images/image.process';
import { exportDeck } from '../features/deck/deck.export';
import { AppButton } from '../components/AppButton';
import { StatusMessage } from '../components/StatusMessage';
import { downloadFile } from '../shared/browser/download';
import { canShareFile, shareDeck } from '../shared/browser/share';
import styles from './CreateDeckPage.module.css';
export function CreateDeckPage({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('');
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deckFile, setDeckFile] = useState<File | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const busy = Boolean(progress);
  useEffect(
    () => () => {
      images.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    },
    [images],
  );
  const add = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    if (images.length + incoming.length > 100) {
      setError('Puoi scegliere al massimo 100 fotografie.');
      return;
    }
    setImages((old) => [
      ...old,
      ...incoming.map((sourceFile) => ({
        localId: generateId(),
        sourceFile,
        previewUrl: URL.createObjectURL(sourceFile),
      })),
    ]);
  };
  const remove = (id: string) =>
    setImages((old) => {
      const found = old.find((i) => i.localId === id);
      if (found) URL.revokeObjectURL(found.previewUrl);
      return old.filter((i) => i.localId !== id);
    });
  const generate = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 80) {
      setError('Inserisci un nome tra 1 e 80 caratteri.');
      return;
    }
    if (images.length < 4) {
      setError('Scegli almeno 4 fotografie.');
      return;
    }
    setError(null);
    try {
      const processed = [];
      for (let i = 0; i < images.length; i++) {
        setProgress(`Elaborazione immagini ${i + 1} di ${images.length}…`);
        processed.push(await processImage(images[i].sourceFile, generateId(), i));
        await new Promise<void>((r) => setTimeout(r, 0));
      }
      setProgress('Creazione del mazzo…');
      setDeckFile(await exportDeck(trimmed, processed));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossibile creare il mazzo.');
    } finally {
      setProgress('');
    }
  };
  return (
    <main>
      <h1>Crea mazzo</h1>
      <label>
        Nome del mazzo
        <input
          value={name}
          maxLength={80}
          disabled={busy}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <p>{images.length} / 100 fotografie</p>
      <AppButton disabled={busy} onClick={() => ref.current?.click()}>
        Aggiungi fotografie
      </AppButton>
      <input
        ref={ref}
        className={styles.input}
        type="file"
        multiple
        accept="image/*"
        disabled={busy}
        onChange={(e) => {
          add(e.currentTarget.files);
          e.currentTarget.value = '';
        }}
      />
      <div className={styles.previews}>
        {images.map((image, index) => (
          <figure key={image.localId}>
            <img src={image.previewUrl} alt={`Anteprima persona ${index + 1}`} />
            <button
              type="button"
              aria-label={`Rimuovi persona ${index + 1}`}
              disabled={busy}
              onClick={() => remove(image.localId)}
            >
              Rimuovi
            </button>
          </figure>
        ))}
      </div>
      {progress && <StatusMessage>{progress}</StatusMessage>}
      {error && <StatusMessage error>{error}</StatusMessage>}
      {!deckFile ? (
        <AppButton disabled={busy} onClick={generate}>
          Genera mazzo
        </AppButton>
      ) : (
        <section>
          <h2>Mazzo pronto</h2>
          {canShareFile(deckFile) && (
            <AppButton
              onClick={async () => {
                try {
                  await shareDeck(deckFile, name.trim());
                } catch {
                  setError('Non è stato possibile condividere il mazzo.');
                }
              }}
            >
              Condividi mazzo
            </AppButton>
          )}
          <AppButton onClick={() => downloadFile(deckFile)}>Scarica mazzo</AppButton>
        </section>
      )}
      <AppButton disabled={busy} onClick={onBack}>
        Torna alla Home
      </AppButton>
    </main>
  );
}
