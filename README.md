# Indovina-Chi-Vuoi-Tu

PWA frontend-only per giocare a Indovina Chi con fotografie personali. Le fotografie vengono elaborate esclusivamente nel browser: non esistono account, backend, analytics, cloud o comunicazione tra dispositivi.

## Funzionalità

- Creazione di mazzi da 4 a 100 foto JPEG, PNG o WebP; ogni immagine viene centrata e convertita in WebP/JPEG 512×512.
- Esportazione/importazione di archivi `.guess`, download e condivisione nativa quando supportata.
- Gioco locale: scelta bloccata del personaggio segreto, carte nascondibili e nuova partita senza perdere il mazzo.
- PWA installabile e offline dopo la prima visita; i dati personali non sono precached né persistiti.

## Architettura e stack

SPA React + TypeScript strict, Vite, CSS Modules, JSZip e API browser. Lo stato è locale (`useState` e `useReducer`), senza router, database o IndexedDB. `vite-plugin-pwa` genera il service worker; gli aggiornamenti non forzano un reload durante la partita.

Struttura principale: `src/app` contiene il coordinamento, `pages` le schermate, `features/deck` il formato/import/export, `features/images` la pipeline Canvas, `features/game` il reducer e `shared` le utility browser.

## Avvio

```sh
npm install
npm run dev
npm run lint
npm run format:check
npm run typecheck
npm run test
npm run build
```

## Formato e limiti

Un `.guess` è uno ZIP con `deck.json` e immagini `images/0001.webp` o `.jpg`. L’import limita ZIP compressi a 100 MB, 110 entry, manifest a 256 KB, 4–100 personaggi, 2 MB per immagine e 150 MB estratti. I path vengono validati strettamente. Il nome è lungo 1–80 caratteri; le sorgenti massimo 25 MB.

HEIC può essere selezionato solo se il browser riesce a decodificarlo; altrimenti la creazione mostra un errore. Se Share non è disponibile o viene annullato, il download resta sempre disponibile.

## Privacy, compatibilità e PWA

Le foto non vengono mai inviate online: restano in memoria fino a esportazione/importazione e i Blob URL vengono revocati quando il mazzo viene chiuso. Servono browser moderni con Canvas e File API; WebP usa automaticamente JPEG come fallback. Installa la PWA dal menu del browser. Offline funziona dopo la prima visita completa.

## Deployment

GitHub Pages: il workflow costruisce con `--mode github-pages`, usando `/indovina-chi-vuoi-tu/`. Per Cloudflare Pages, Netlify o Vercel usa `npm run build` e pubblica `dist`. Se una foto non viene elaborata, prova JPEG/PNG/WebP più piccoli o un browser aggiornato; se un `.guess` non importa, ricrealo nell’app e verifica i limiti indicati.
