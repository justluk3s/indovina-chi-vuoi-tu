import type { LoadedCharacter } from '../features/deck/deck.types';
import { CharacterCard } from './CharacterCard';
import styles from './CharacterGrid.module.css';
export function CharacterGrid({
  characters,
  hiddenIds = new Set(),
  pendingId,
  onSelect,
  disabled = false,
}: {
  characters: LoadedCharacter[];
  hiddenIds?: ReadonlySet<string>;
  pendingId?: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className={styles.grid}>
      {characters.map((character, index) => (
        <CharacterCard
          key={character.id}
          imageUrl={character.imageUrl}
          index={index}
          hidden={hiddenIds.has(character.id)}
          selected={pendingId === character.id}
          onClick={() => onSelect(character.id)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
