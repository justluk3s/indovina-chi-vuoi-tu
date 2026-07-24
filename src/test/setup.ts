import '@testing-library/jest-dom/vitest';

Object.defineProperty(URL, 'createObjectURL', {
  configurable: true,
  value: () => 'blob:test',
});
Object.defineProperty(URL, 'revokeObjectURL', {
  configurable: true,
  value: () => undefined,
});
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
}
