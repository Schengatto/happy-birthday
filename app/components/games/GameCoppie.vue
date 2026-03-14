<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useAudio } from '~/composables/useAudio'
import { COPPIE_LEVELS } from '~/utils/emoji-sets'
import { shuffle } from '~/utils/shuffle'
import '~/assets/css/game-coppie.css'

import type { RecipientGender } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

/* ─── Props & Emits ─── */
const props = defineProps<{
  recipientName: string
  recipientGender: RecipientGender
  theme?: 'cuoricini' | 'floreale' | 'festivo' | 'classic-light' | 'classic-dark' | 'modern'
}>()

const emit = defineEmits<{
  complete: [score: number]
  progress: [percent: number]
}>()

/* ─── Audio ─── */
const { playFlip, playMatch, playError } = useAudio()

/* ─── Card type ─── */
interface Card {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
  shake: boolean
}

/* ─── Game state ─── */
const cards = ref<Card[]>([])
const moves = ref(0)
const pairsFound = ref(0)
const isLocked = ref(false)
const showOverlay = ref(false)
const showConfetti = ref(false)

/* Track first and second flipped cards */
let firstCard: Card | null = null
let secondCard: Card | null = null
let flipBackTimer: ReturnType<typeof setTimeout> | null = null
let overlayTimer: ReturnType<typeof setTimeout> | null = null
let confettiTimer: ReturnType<typeof setTimeout> | null = null

/* ─── Confetti pieces (generated on level complete) ─── */
interface ConfettiPiece {
  id: number
  left: number
  color: string
  duration: number
  rotation: number
  delay: number
}

const confettiPieces = ref<ConfettiPiece[]>([])
const CONFETTI_COLORS = ['#ff69b4', '#9b59b6', '#f0e68c', '#87ceeb', '#4ecdc4', '#ff6347', '#ffd700']
let confettiId = 0

/* ─── Computed ─── */
const levelConfig = computed(() => COPPIE_LEVELS[0]!)
const totalPairs = computed(() => levelConfig.value.pairs)
const gridCols = computed(() => levelConfig.value.cols)

/* ─── Build cards for current level ─── */
function buildCards(): Card[] {
  const emojis = levelConfig.value.emojis.slice(0, levelConfig.value.pairs)
  const pairs = [...emojis, ...emojis]
  return shuffle(pairs).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
    shake: false,
  }))
}

/* ─── Start a level ─── */
function startLevel() {
  firstCard = null
  secondCard = null
  isLocked.value = false
  showOverlay.value = false
  moves.value = 0
  pairsFound.value = 0
  cards.value = buildCards()

  emit('progress', 0)
}

/* ─── Card click handler ─── */
function onCardClick(card: Card) {
  // Ignore clicks on already flipped, matched, or when board is locked
  if (card.flipped || card.matched || isLocked.value) return

  card.flipped = true
  playFlip()

  if (!firstCard) {
    // First card of the pair
    firstCard = card
  } else {
    // Second card of the pair
    secondCard = card
    moves.value++
    isLocked.value = true

    if (firstCard.emoji === secondCard.emoji) {
      // Match found
      handleMatch()
    } else {
      // No match
      handleMismatch()
    }
  }
}

/* ─── Match ─── */
function handleMatch() {
  if (!firstCard || !secondCard) return

  const a = firstCard
  const b = secondCard

  // Small delay before showing matched state
  setTimeout(() => {
    a.matched = true
    b.matched = true
    pairsFound.value++
    playMatch()

    firstCard = null
    secondCard = null
    isLocked.value = false

    // Emit progress
    const progress = Math.round((pairsFound.value / totalPairs.value) * 100)
    emit('progress', Math.min(progress, 99))

    // Check if level complete
    if (pairsFound.value >= totalPairs.value) {
      onLevelComplete()
    }
  }, 300)
}

/* ─── Mismatch ─── */
function handleMismatch() {
  if (!firstCard || !secondCard) return

  const a = firstCard
  const b = secondCard

  // Shake, then flip back
  flipBackTimer = setTimeout(() => {
    a.shake = true
    b.shake = true
    playError()

    setTimeout(() => {
      a.flipped = false
      b.flipped = false
      a.shake = false
      b.shake = false
      firstCard = null
      secondCard = null
      isLocked.value = false
    }, 300)
  }, 600)
}

/* ─── Game complete ─── */
function onLevelComplete() {
  // Spawn confetti
  spawnConfetti()

  // Show overlay after brief delay
  overlayTimer = setTimeout(() => {
    showOverlay.value = true
  }, 500)
}

/* ─── Confetti ─── */
function spawnConfetti() {
  showConfetti.value = true
  const pieces: ConfettiPiece[] = []
  for (let i = 0; i < 40; i++) {
    pieces.push({
      id: confettiId++,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
      duration: 1.8 + Math.random() * 1.5,
      rotation: 360 + Math.random() * 720,
      delay: Math.random() * 0.6,
    })
  }
  confettiPieces.value = pieces

  confettiTimer = setTimeout(() => {
    showConfetti.value = false
    confettiPieces.value = []
  }, 3500)
}

/* ─── Complete ─── */
function nextLevel() {
  showOverlay.value = false
  emit('progress', 100)
  emit('complete', moves.value)
}

/* ─── Cleanup ─── */
onUnmounted(() => {
  if (flipBackTimer) clearTimeout(flipBackTimer)
  if (overlayTimer) clearTimeout(overlayTimer)
  if (confettiTimer) clearTimeout(confettiTimer)
  firstCard = null
  secondCard = null
})

/* ─── Init first level ─── */
startLevel()
</script>

<template>
  <div class="coppie-wrapper">
    <h2 class="coppie-title">{{ $t('coppie.title') }}</h2>
    <p class="coppie-subtitle">
      {{ $t('coppie.subtitle', { name: props.recipientName }) }}
    </p>

    <!-- Stats -->
    <div class="coppie-stats">
      <div class="coppie-stats-item">
        {{ $t('coppie.moves') }} <span class="coppie-stats-value">{{ moves }}</span>
      </div>
      <div class="coppie-stats-item">
        {{ $t('coppie.matched') }} <span class="coppie-stats-value">{{ pairsFound }} / {{ totalPairs }}</span>
      </div>
    </div>

    <!-- Card grid -->
    <div
      class="coppie-grid"
      :class="{ 'is-locked': isLocked }"
      :style="{ '--cols': gridCols }"
    >
      <div
        v-for="card in cards"
        :key="card.id"
        class="coppie-card"
        :class="{
          'is-flipped': card.flipped || card.matched,
          'is-matched': card.matched,
          'is-shaking': card.shake,
        }"
        :style="{ animationDelay: card.id * 0.04 + 's' }"
        @click="onCardClick(card)"
      >
        <div class="coppie-card-inner">
          <!-- Front (face-down) -->
          <div class="coppie-card-front">?</div>
          <!-- Back (face-up, shows emoji) -->
          <div class="coppie-card-back">
            {{ card.emoji }}
            <span v-if="card.matched" class="coppie-card-check">&#10003;</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Complete overlay -->
    <div v-if="showOverlay" class="coppie-overlay">
      <div class="coppie-overlay-card">
        <div class="coppie-overlay-emoji">🏆</div>
        <div class="coppie-overlay-title">
          {{ $t('coppie.allDone.' + props.recipientGender, { name: props.recipientName }) }}
        </div>
        <div class="coppie-overlay-sub">
          {{ $t('coppie.allDoneSub') }}
        </div>
        <div class="coppie-overlay-stats">
          <div>
            <span class="coppie-overlay-stat-value">{{ moves }}</span>
            {{ $t('coppie.overlayMoves') }}
          </div>
          <div>
            <span class="coppie-overlay-stat-value">{{ totalPairs }}</span>
            {{ $t('coppie.overlayMatched') }}
          </div>
        </div>
        <button class="coppie-btn" @click="nextLevel">
          {{ $t('coppie.continue') }}
        </button>
      </div>
    </div>

    <!-- Confetti -->
    <div v-if="showConfetti" class="coppie-confetti">
      <div
        v-for="piece in confettiPieces"
        :key="piece.id"
        class="coppie-confetti-piece"
        :style="{
          left: piece.left + '%',
          backgroundColor: piece.color,
          '--dur': piece.duration + 's',
          '--rot': piece.rotation + 'deg',
          animationDelay: piece.delay + 's',
        }"
      />
    </div>
  </div>
</template>
