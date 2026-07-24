import { describe, it, expect } from 'vitest';
import { gameReducer, initialGameState } from './game.reducer';
describe('game reducer', () => {
  it('handles select, confirm and locks secret', () => {
    let s = gameReducer(initialGameState, { type: 'PREVIEW_SECRET', characterId: 'a' });
    s = gameReducer(s, { type: 'CONFIRM_SECRET' });
    expect(s.secretCharacterId).toBe('a');
    expect(gameReducer(s, { type: 'PREVIEW_SECRET', characterId: 'b' })).toBe(s);
  });
  it('cancels, toggles only while playing and resets', () => {
    expect(gameReducer(initialGameState, { type: 'TOGGLE_CHARACTER', characterId: 'a' })).toBe(
      initialGameState,
    );
    let s = gameReducer(initialGameState, { type: 'PREVIEW_SECRET', characterId: 'a' });
    expect(gameReducer(s, { type: 'CANCEL_SECRET' }).pendingSecretCharacterId).toBeNull();
    s = gameReducer(s, { type: 'CONFIRM_SECRET' });
    s = gameReducer(s, { type: 'TOGGLE_CHARACTER', characterId: 'a' });
    expect(s.hiddenCharacterIds.has('a')).toBe(true);
    s = gameReducer(s, { type: 'TOGGLE_CHARACTER', characterId: 'a' });
    expect(s.hiddenCharacterIds.has('a')).toBe(false);
    expect(gameReducer(s, { type: 'RESET_GAME' })).toEqual(initialGameState);
  });
});
