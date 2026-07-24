import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import styles from './AppButton.module.css';
export function AppButton({
  children,
  className = '',
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button className={`${styles.button} ${className}`} {...props}>
      {children}
    </button>
  );
}
