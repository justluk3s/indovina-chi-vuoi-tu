import { describe, it, expect } from 'vitest';
import { slugify } from './slugify';
describe('slugify', () => {
  it('normalizes accents and fallback', () => {
    expect(slugify('Gli Amici dell’Estate 2026!')).toBe('gli-amici-dell-estate-2026');
    expect(slugify('---')).toBe('mazzo');
  });
  it('limits length', () => expect(slugify('a'.repeat(70))).toHaveLength(60));
});
