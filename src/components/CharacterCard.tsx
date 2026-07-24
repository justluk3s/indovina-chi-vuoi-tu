import styles from './CharacterCard.module.css';
type Props = {
  imageUrl: string;
  index: number;
  hidden?: boolean;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
};
export function CharacterCard({
  imageUrl,
  index,
  hidden = false,
  selected = false,
  onClick,
  disabled,
}: Props) {
  return (
    <button
      type="button"
      className={`${styles.card} ${hidden ? styles.hidden : ''} ${selected ? styles.selected : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={hidden}
      aria-label={`Persona ${index + 1}${hidden ? ', nascosta' : ''}`}
    >
      <img src={imageUrl} alt={`Persona ${index + 1}`} />
      {hidden && (
        <span aria-hidden="true" className={styles.x}>
          ×
        </span>
      )}
    </button>
  );
}
