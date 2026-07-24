import type { LoadedCharacter } from '../features/deck/deck.types';
import styles from './SecretCharacterReminder.module.css';
export function SecretCharacterReminder({ character }: { character: LoadedCharacter }) {
  return (
    <aside className={styles.reminder}>
      <span>Il tuo personaggio</span>
      <img src={character.imageUrl} alt="Il tuo personaggio segreto" />
    </aside>
  );
}
