import { useEffect, useState } from 'react';
import type { AppScreen } from './app.types';
import type { LoadedDeck } from '../features/deck/deck.types';
import { HomePage } from '../pages/HomePage';
import { CreateDeckPage } from '../pages/CreateDeckPage';
import { GamePage } from '../pages/GamePage';
import { importDeck } from '../features/deck/deck.import';
import styles from './App.module.css';
export function App() {
  const [screen, setScreen] = useState<AppScreen>('home'),
    [deck, setDeck] = useState<LoadedDeck | null>(null),
    [error, setError] = useState<string | null>(null);
  const home = () => {
    deck?.dispose();
    setDeck(null);
    setScreen('home');
  };
  useEffect(() => () => deck?.dispose(), [deck]);
  const imported = async (file: File) => {
    setError(null);
    try {
      const loaded = await importDeck(file);
      setDeck(loaded);
      setScreen('game');
    } catch (e) {
      if (import.meta.env.DEV) console.error(e);
      setError(e instanceof Error ? e.message : 'Impossibile importare il mazzo.');
    }
  };
  return (
    <div className={styles.app}>
      {screen === 'home' && (
        <HomePage onCreate={() => setScreen('create-deck')} onImport={imported} error={error} />
      )}{' '}
      {screen === 'create-deck' && <CreateDeckPage onBack={() => setScreen('home')} />}{' '}
      {screen === 'game' && deck && <GamePage deck={deck} onHome={home} />}
    </div>
  );
}
