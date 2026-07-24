export type GamePhase = 'selecting-secret' | 'playing';
export type GameState = {
  phase: GamePhase;
  pendingSecretCharacterId: string | null;
  secretCharacterId: string | null;
  hiddenCharacterIds: ReadonlySet<string>;
};
export type GameAction =
  | { type: 'PREVIEW_SECRET'; characterId: string }
  | { type: 'CANCEL_SECRET' }
  | { type: 'CONFIRM_SECRET' }
  | { type: 'TOGGLE_CHARACTER'; characterId: string }
  | { type: 'RESET_GAME' };
