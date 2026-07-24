import { useEffect, useRef } from 'react';
import { AppButton } from './AppButton';
import styles from './ConfirmDialog.module.css';
export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <h2 id="dialog-title">{title}</h2>
      <p id="dialog-description">{description}</p>
      <div className={styles.actions}>
        <AppButton onClick={onCancel}>Annulla</AppButton>
        <AppButton onClick={onConfirm}>Conferma</AppButton>
      </div>
    </dialog>
  );
}
