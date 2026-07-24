import { useMemo, useReducer, useState } from 'react';
import type { LoadedDeck } from '../features/deck/deck.types';
import { gameReducer, initialGameState } from '../features/game/game.reducer';
import { CharacterGrid } from '../components/CharacterGrid';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SecretCharacterReminder } from '../components/SecretCharacterReminder';
import { AppButton } from '../components/AppButton';
export function GamePage({ deck, onHome }: { deck: LoadedDeck; onHome: () => void }) {
  const [game, dispatch] = useReducer(gameReducer, initialGameState);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmHome, setConfirmHome] = useState(false);
  const secret = useMemo(
    () => deck.characters.find((c) => c.id === game.secretCharacterId),
    [deck.characters, game.secretCharacterId],
  );
  return (
    <main>
      <header>
        <h1>{deck.name}</h1>
        <AppButton onClick={() => setConfirmReset(true)}>Nuova partita</AppButton>
        <AppButton onClick={() => (game.phase === 'playing' ? setConfirmHome(true) : onHome())}>
          Torna alla Home
        </AppButton>
      </header>
      {game.phase === 'selecting-secret' ? (
        <>
          <h2>Scegli la persona che il tuo avversario deve indovinare</h2>
          <CharacterGrid
            characters={deck.characters}
            pendingId={game.pendingSecretCharacterId}
            onSelect={(id) => dispatch({ type: 'PREVIEW_SECRET', characterId: id })}
          />
          <ConfirmDialog
            open={game.pendingSecretCharacterId !== null}
            title="Confermi questo personaggio?"
            description="Non potrai cambiarlo durante la partita."
            onCancel={() => dispatch({ type: 'CANCEL_SECRET' })}
            onConfirm={() => dispatch({ type: 'CONFIRM_SECRET' })}
          />
        </>
      ) : (
        <>
          {secret && <SecretCharacterReminder character={secret} />}
          <CharacterGrid
            characters={deck.characters}
            hiddenIds={game.hiddenCharacterIds}
            onSelect={(id) => dispatch({ type: 'TOGGLE_CHARACTER', characterId: id })}
          />
        </>
      )}
      <ConfirmDialog
        open={confirmReset}
        title="Iniziare una nuova partita?"
        description="Il personaggio segreto e le carte nascoste saranno azzerati."
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          dispatch({ type: 'RESET_GAME' });
          setConfirmReset(false);
        }}
      />
      <ConfirmDialog
        open={confirmHome}
        title="Tornare alla Home?"
        description="Il mazzo verrà rimosso da questo dispositivo."
        onCancel={() => setConfirmHome(false)}
        onConfirm={onHome}
      />
    </main>
  );
}
