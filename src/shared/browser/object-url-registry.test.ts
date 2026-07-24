import { describe, it, expect, vi } from 'vitest';
import { ObjectUrlRegistry } from './object-url-registry';
describe('ObjectUrlRegistry', () => {
  it('revokes once and cleanup is idempotent', () => {
    const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:a');
    const revoke = vi.spyOn(URL, 'revokeObjectURL');
    const r = new ObjectUrlRegistry();
    const u = r.create(new Blob());
    r.revoke(u);
    r.revoke(u);
    r.revokeAll();
    r.revokeAll();
    expect(create).toHaveBeenCalledOnce();
    expect(revoke).toHaveBeenCalledOnce();
  });
});
