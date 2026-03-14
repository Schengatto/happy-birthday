/* Centralized emoji definitions for all games
   Tutti i giochi sono missioni per preparare la festa di compleanno! */

// ═══ MISSIONE 1: Prepara la Festa ═══

// Level 1 — Trova le cose per la festa
export const MISSIONE_L1_CORRECT = ['🎂', '🎈', '🎁', '🍬']
export const MISSIONE_L1_WRONG = ['🧦', '🧹', '⛈️']

// Level 2 — Raccogli regali e decorazioni
export const MISSIONE_L2_GOOD = ['🎁', '🎀', '🎊', '🧁', '🌸']
export const MISSIONE_L2_BAD = ['🕷️', '💩', '🦠']

// Level 3 — Prepara la torta
export const MISSIONE_L3_INGREDIENTS = [
  { name: 'farina', emoji: '🌾' },
  { name: 'zucchero', emoji: '🍬' },
  { name: 'uova', emoji: '🥚' },
  { name: 'cioccolato', emoji: '🍫' },
  { name: 'candeline', emoji: '🕯️' },
]

// ═══ MISSIONE 2: Apparecchia i Tavoli ═══

// Abbina le cose per la tavola della festa
export const COPPIE_LEVELS = [
  { pairs: 3, cols: 3, label: 'Piatti e Bicchieri', emojis: ['🍽️', '🥤', '🎈'] },
  { pairs: 5, cols: 5, label: 'Le Decorazioni', emojis: ['🎀', '🕯️', '🎵', '🎁', '🧁'] },
  { pairs: 8, cols: 4, label: 'La Festa Completa!', emojis: ['🍽️', '🥤', '🎈', '🎀', '🕯️', '🎵', '🎁', '🧁'] },
]

// ═══ MISSIONE 3: Decora la Sala ═══

// Cattura le decorazioni per abbellire la sala
export const PALLONCINI_GOOD = ['🎈', '🎀', '🌸', '⭐', '🎊']
export const PALLONCINI_BAD = ['🌧️', '⛈️', '🐛', '🪲', '🐜']

export const PALLONCINI_LEVELS = [
  { badge: 'Decorazioni Base 🌸', spawnInterval: 1300, baseDur: 5500, goodRatio: 0.72, time: 30 },
  { badge: 'Stelle Filanti 🌟', spawnInterval: 850, baseDur: 4200, goodRatio: 0.62, time: 30 },
  { badge: 'Gran Finale 🔥', spawnInterval: 620, baseDur: 3100, goodRatio: 0.55, time: 35 },
]

// Balloons overlay emojis
export const BALLOON_EMOJIS = ['🎈', '🎉', '🎊', '💖', '⭐', '🌟', '🥳', '💜']

// ═══ MISSIONE 4: Ricorda la Sequenza ═══

// Emoji pool for the Simon Says sequence game
export const SEQUENZA_EMOJIS = ['🎂', '🎈', '🎁', '🎀', '🧁', '🌟', '🎵', '🍬']

export const SEQUENZA_LEVELS = [
  { length: 3, label: 'Facile 🌸', showTime: 800 },
  { length: 5, label: 'Medio 🌟', showTime: 650 },
  { length: 7, label: 'Difficile 🔥', showTime: 500 },
]

// ═══ MISSIONE 5: Scarta i Regali ═══

// Gift wrapping emojis (shown when wrapped)
export const REGALO_WRAPS = ['🎁', '🎁', '🎁', '🎁']

// Surprise emojis revealed inside gifts
export const REGALO_SURPRISES = ['🧸', '🎮', '📱', '💎', '🎨', '🍫', '🧁', '👑', '🌺', '💝', '🎵', '⭐']

export const REGALO_LEVELS = [
  { gifts: 4, tapsToOpen: 5, timeLimit: 20, label: 'Primi Regali 🎀' },
  { gifts: 6, tapsToOpen: 7, timeLimit: 25, label: 'Tanti Regali 🎊' },
  { gifts: 8, tapsToOpen: 8, timeLimit: 30, label: 'La Montagna di Regali! 🏔️' },
]
