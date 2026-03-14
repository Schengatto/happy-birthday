# Happy Birthday Portal

## Descrizione
Portale Nuxt 4 per creare e condividere biglietti di compleanno animati con mini-giochi interattivi.

## Stack
- **Nuxt 4** (Vue 3 Composition API, TypeScript)
- **Neon PostgreSQL** + **Drizzle ORM** per persistenza
- **Web Audio API** per suoni (nessun file audio esterno)
- **CSS puro** in file separati dai componenti
- **Deploy**: Netlify

## File Legacy
I giochi originali (Vue 3 CDN, single-file) sono in `legacy/` come riferimento.

## Struttura
```
app/
  assets/css/         # CSS separato per area (editor, viewer, game-*)
  components/
    editor/           # Wizard creazione biglietto (4 step)
    viewer/           # CardViewer, Envelope, Message, GameCarousel, Finale
    games/            # GameMissione, GameCoppie, GamePalloncini, GameWrapper
    shared/           # ConfettiCanvas, AnimatedButton, OverlayCard
  composables/        # useAudio, useConfetti, useTheme, useGameState
  utils/              # shuffle, emoji-sets
  pages/
    index.vue         # Editor wizard
    card/[id].vue     # Viewer biglietto (layout fullscreen)
server/
  api/cards/          # POST create, GET by id
  database/           # Drizzle schema + migrations
  utils/              # db.ts (Neon client)
types/                # CardConfig, GameSelection, StoredCard
```

## Convenzioni
- Tutto il testo UI in **italiano**
- CSS in file separati (`assets/css/`), mai `<style>` nei componenti
- Classi CSS con prefisso per area: `.missione-*`, `.coppie-*`, `.palloncini-*`
- Mobile-first, `clamp()` per font responsivi, `100dvh` per viewport
- Audio con Web Audio API (composable `useAudio`)
- Nessun build tool CSS, nessuna dipendenza UI esterna

## Comandi
```bash
npm run dev        # dev server
npm run build      # build per Netlify
npx drizzle-kit generate   # genera migration SQL
npx drizzle-kit push       # applica migration a Neon
```

## Environment
Variabile richiesta: `NEON_DATABASE_URL` (vedi `.env.example`)
