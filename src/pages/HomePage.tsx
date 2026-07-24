import { useRef } from 'react';
import { AppButton } from '../components/AppButton';
import { StatusMessage } from '../components/StatusMessage';
import styles from './HomePage.module.css';
export function HomePage({
  onCreate,
  onImport,
  error,
}: {
  onCreate: () => void;
  onImport: (file: File) => void;
  error: string | null;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <main className={styles.home}>
      <h1>Indovina-Chi-Vuoi-Tu</h1>
      <p>Crea un mazzo con le tue fotografie e gioca in locale con chi vuoi.</p>
      <AppButton onClick={onCreate}>Crea mazzo</AppButton>
      <AppButton onClick={() => ref.current?.click()}>Importa mazzo</AppButton>
      <input
        ref={ref}
        className={styles.input}
        type="file"
        accept=".guess,application/zip,application/octet-stream"
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          if (file) onImport(file);
          e.currentTarget.value = '';
        }}
      />
      {error && <StatusMessage error>{error}</StatusMessage>}
    </main>
  );
}
