/* Centralized emoji definitions for all games
   Tutti i giochi sono missioni per preparare la festa di compleanno! */

// ═══ MISSIONE 1: Prepara la Festa ═══

// Phase 1 — Decora la sala (drag & drop decorations)
export const MISSIONE_DECORAZIONI = [
  { name: 'palloncino', emoji: '🎈' },
  { name: 'fiocco', emoji: '🎀' },
  { name: 'stella', emoji: '⭐' },
  { name: 'coriandoli', emoji: '🎊' },
  { name: 'fiore', emoji: '🌸' },
]

// Phase 2 — Prepara il tavolo per la torta
export const MISSIONE_TAVOLO = [
  { name: 'torta', emoji: '🎂' },
  { name: 'piatto', emoji: '🍽️' },
  { name: 'bibita', emoji: '🥤' },
  { name: 'candeline', emoji: '🕯️' },
  { name: 'regalo', emoji: '🎁' },
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

// ═══ MISSIONE 6: Scoppia le Bolle ═══

// Emoji pool for bubble types
export const BOLLE_EMOJIS = ['🎂', '🎈', '🎁', '🧁', '⭐', '🎀']

export const BOLLE_LEVELS = [
  { rows: 4, emojiCount: 4, label: 'Bolle Facili 🫧' },
  { rows: 6, emojiCount: 5, label: 'Bolle Pazze! 🌊' },
]

// ═══ MISSIONE 7: Prepara la Torta ═══

// Ingredients needed for the recipe
export const TORTA_INGREDIENTS = [
  { name: 'farina', emoji: '🌾' },
  { name: 'uova', emoji: '🥚' },
  { name: 'zucchero', emoji: '🍬' },
  { name: 'burro', emoji: '🧈' },
  { name: 'cioccolato', emoji: '🍫' },
  { name: 'latte', emoji: '🥛' },
]

// Distractors (wrong items in the grid)
export const TORTA_DISTRACTORS = [
  { name: 'pesce', emoji: '🐟' },
  { name: 'peperoncino', emoji: '🌶️' },
  { name: 'broccoli', emoji: '🥦' },
  { name: 'cipolla', emoji: '🧅' },
  { name: 'aglio', emoji: '🧄' },
  { name: 'carne', emoji: '🥩' },
]

// Candle emojis for decoration phase
export const TORTA_CANDLES = ['🕯️']

// ═══ MISSIONE 7: Acchiappa i Dolcetti ═══

// Sweets/cakes the claw can grab
export const ARTIGLIO_DOLCETTI = ['🎂', '🧁', '🍰', '🍩', '🍪', '🍬', '🍭', '🍫']

// Bad items — catching these costs a life
export const ARTIGLIO_BAD = ['🧅', '🌶️']

// Claw speed increases per round (px per frame, grab count needed)
export const ARTIGLIO_ROUNDS = [
  { speed: 0.6, catchTarget: 1, label: 'Riscaldamento 🌸' },
  { speed: 0.9, catchTarget: 1, label: 'Velocità! 🌟' },
  { speed: 1.2, catchTarget: 1, label: 'Gran Finale! 🔥' },
]

// ═══ MISSIONE 9: Alchimia della Torta ═══

// Sequential recipe steps — each step: the correct ingredient + 3 distractors
// The "bowl" emoji shows what you're building so far
export interface AlchimiaStep {
  id: string
  correctId: string
  correctEmoji: string
  distractors: { id: string; emoji: string }[]
  resultEmoji: string
  resultId: string
}

export const ALCHIMIA_STEPS: AlchimiaStep[] = [
  {
    id: 'step1',
    correctId: 'farina', correctEmoji: '🌾',
    distractors: [{ id: 'pesce', emoji: '🐟' }, { id: 'carne', emoji: '🥩' }, { id: 'aglio', emoji: '🧄' }],
    resultEmoji: '🥣', resultId: 'farina',
  },
  {
    id: 'step2',
    correctId: 'uova', correctEmoji: '🥚',
    distractors: [{ id: 'cipolla', emoji: '🧅' }, { id: 'peperoncino', emoji: '🌶️' }, { id: 'broccoli', emoji: '🥦' }],
    resultEmoji: '🥞', resultId: 'impasto',
  },
  {
    id: 'step3',
    correctId: 'zucchero', correctEmoji: '🍬',
    distractors: [{ id: 'miele', emoji: '🍯' }, { id: 'aceto', emoji: '🍶' }, { id: 'limone', emoji: '🍋' }],
    resultEmoji: '🍪', resultId: 'impasto_dolce',
  },
  {
    id: 'step4',
    correctId: 'burro', correctEmoji: '🧈',
    distractors: [{ id: 'olio', emoji: '🫒' }, { id: 'ketchup', emoji: '🍅' }, { id: 'senape', emoji: '🌭' }],
    resultEmoji: '🧁', resultId: 'pasta_base',
  },
  {
    id: 'step5',
    correctId: 'cioccolato', correctEmoji: '🍫',
    distractors: [{ id: 'wasabi', emoji: '🟢' }, { id: 'pepe', emoji: '🫑' }, { id: 'mais', emoji: '🌽' }],
    resultEmoji: '🍰', resultId: 'torta_cruda',
  },
  {
    id: 'step6',
    correctId: 'fuoco', correctEmoji: '🔥',
    distractors: [{ id: 'ghiaccio', emoji: '🧊' }, { id: 'acqua', emoji: '💧' }, { id: 'neve', emoji: '❄️' }],
    resultEmoji: '🎂', resultId: 'torta',
  },
  {
    id: 'step7',
    correctId: 'candeline', correctEmoji: '🕯️',
    distractors: [{ id: 'chiodo', emoji: '🔩' }, { id: 'matita', emoji: '✏️' }, { id: 'forchetta', emoji: '🍴' }],
    resultEmoji: '🥳', resultId: 'torta_compleanno',
  },
]

// ═══ MISSIONE 10: Raccogli i Dolcetti ═══

// Sweets that fall from the sky — catch them!
export const DOLCETTI_GOOD = ['🧁', '🍰', '🍩', '🍪', '🍬', '🍭', '🍫', '🎂']

// Bad items — avoid these!
export const DOLCETTI_BAD = ['🧅', '🌶️', '🥦', '🐛']

// Levels: spawnInterval (ms), fallDuration (ms), goodRatio, time (s), target score
export const DOLCETTI_LEVELS = [
  { spawnInterval: 1100, fallDuration: 3200, goodRatio: 0.75, time: 30, label: 'Raccogli i Dolcetti 🍬' },
]
