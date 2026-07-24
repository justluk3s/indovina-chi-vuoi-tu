export function StatusMessage({ children, error = false }: { children: string; error?: boolean }) {
  return (
    <p role={error ? 'alert' : 'status'} aria-live="polite">
      {children}
    </p>
  );
}
