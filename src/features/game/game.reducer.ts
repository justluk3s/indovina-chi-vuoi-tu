import type { GameAction, GameState } from './game.types';
export const initialGameState: GameState = {
  phase: 'selecting-secret',
  pendingSecretCharacterId: null,
  secretCharacterId: null,
  hiddenCharacterIds: new Set(),
};
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PREVIEW_SECRET':
      return state.phase === 'selecting-secret'
        ? { ...state, pendingSecretCharacterId: action.characterId }
        : state;
    case 'CANCEL_SECRET':
      return state.phase === 'selecting-secret'
        ? { ...state, pendingSecretCharacterId: null }
        : state;
    case 'CONFIRM_SECRET':
      return state.phase === 'selecting-secret' && state.pendingSecretCharacterId
        ? {
            ...state,
            phase: 'playing',
            secretCharacterId: state.pendingSecretCharacterId,
            pendingSecretCharacterId: null,
          }
        : state;
    case 'TOGGLE_CHARACTER':
      if (state.phase !== 'playing') return state;
      {
        const hidden = new Set(state.hiddenCharacterIds);
        if (hidden.has(action.characterId)) hidden.delete(action.characterId);
        else hidden.add(action.characterId);
        return { ...state, hiddenCharacterIds: hidden };
      }
    case 'RESET_GAME':
      return { ...initialGameState, hiddenCharacterIds: new Set() };
  }
}
