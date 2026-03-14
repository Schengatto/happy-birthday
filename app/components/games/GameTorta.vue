<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudio } from '~/composables/useAudio'
import { TORTA_INGREDIENTS, TORTA_DISTRACTORS, TORTA_CANDLES } from '~/utils/emoji-sets'
import { shuffle } from '~/utils/shuffle'
import '~/assets/css/game-torta.css'

import type { RecipientGender } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

const props = defineProps<{
  recipientName: string
  recipientGender: RecipientGender
  theme?: 'cuoricini' | 'floreale' | 'festivo' | 'classic-light' | 'classic-dark' | 'modern'
}>()

const emit = defineEmits<{
  complete: [score: number]
  progress: [percent: number]
}>()

const { playFlip, playSuccess, playError, playLevelUp, playVictory } = useAudio()

type Phase = 'ingredienti' | 'mescola' | 'inforna' | 'candeline' | 'win'

const phase = ref<Phase>('ingredienti')
const score = ref(0)

// ── Phase 1: Ingredienti ──
interface GridItem {
  id: number
  emoji: string
  name: string
  correct: boolean
  collected: boolean
  wrong: boolean
}

const recipe = ref<typeof TORTA_INGREDIENTS>([])
const grid = ref<GridItem[]>([])
const collectedCount = ref(0)
const recipeFeedback = ref('')
const recipeFeedbackType = ref<'success' | 'error'>('success')

let feedbackTimeout: ReturnType<typeof setTimeout> | null = null
let nextGridId = 0

function initIngredients() {
  recipe.value = [...TORTA_INGREDIENTS]
  const correct = TORTA_INGREDIENTS.map(ing => ({
    id: nextGridId++,
    emoji: ing.emoji,
    name: ing.name,
    correct: true,
    collected: false,
    wrong: false,
  }))
  const distractors = shuffle([...TORTA_DISTRACTORS]).slice(0, 4).map(d => ({
    id: nextGridId++,
    emoji: d.emoji,
    name: d.name,
    correct: false,
    collected: false,
    wrong: false,
  }))
  grid.value = shuffle([...correct, ...distractors])
  collectedCount.value = 0
}

function handleIngredientTap(index: number) {
  const item = grid.value[index]
  if (!item || item.collected || item.wrong || phase.value !== 'ingredienti') return

  if (item.correct) {
    grid.value[index] = { ...item, collected: true }
    collectedCount.value++
    score.value += 15
    playSuccess()
    showFeedback($t('torta.ingredientOk', { name: item.name }), 'success')

    if (collectedCount.value >= TORTA_INGREDIENTS.length) {
      emit('progress', 25)
      setTimeout(() => {
        phase.value = 'mescola'
        playLevelUp()
        initMix()
      }, 800)
    }
  } else {
    grid.value[index] = { ...item, wrong: true }
    playError()
    showFeedback($t('torta.ingredientWrong'), 'error')
    setTimeout(() => {
      const current = grid.value[index]
      if (current) grid.value[index] = { ...current, wrong: false }
    }, 600)
  }
}

function showFeedback(msg: string, type: 'success' | 'error') {
  recipeFeedback.value = msg
  recipeFeedbackType.value = type
  if (feedbackTimeout) clearTimeout(feedbackTimeout)
  feedbackTimeout = setTimeout(() => { recipeFeedback.value = '' }, 1200)
}

// ── Phase 2: Mescola ──
const mixTaps = ref(0)
const mixTarget = 20
const mixBowlShaking = ref(false)
const mixProgress = computed(() => Math.round((mixTaps.value / mixTarget) * 100))

function initMix() {
  mixTaps.value = 0
}

function handleMixTap() {
  if (phase.value !== 'mescola') return
  mixTaps.value++
  mixBowlShaking.value = true
  playFlip()
  setTimeout(() => { mixBowlShaking.value = false }, 120)

  if (mixTaps.value >= mixTarget) {
    score.value += 30
    emit('progress', 50)
    setTimeout(() => {
      phase.value = 'inforna'
      playLevelUp()
      initBake()
    }, 600)
  }
}

// ── Phase 3: Inforna ──
const bakeProgress = ref(0)
const bakeStarted = ref(false)
const ovenGlowing = ref(false)
let bakeTimer: ReturnType<typeof setInterval> | null = null

function initBake() {
  bakeProgress.value = 0
  bakeStarted.value = false
  ovenGlowing.value = false
}

function handleOvenTap() {
  if (phase.value !== 'inforna' || bakeStarted.value) return
  bakeStarted.value = true
  ovenGlowing.value = true
  playFlip()

  bakeTimer = setInterval(() => {
    bakeProgress.value += 2
    if (bakeProgress.value >= 100) {
      if (bakeTimer) { clearInterval(bakeTimer); bakeTimer = null }
      score.value += 30
      emit('progress', 75)
      playLevelUp()
      setTimeout(() => {
        phase.value = 'candeline'
        initCandles()
      }, 800)
    }
  }, 80)
}

// ── Phase 4: Candeline ──
interface Candle {
  id: number
  placed: boolean
  lit: boolean
  emoji: string
}

const candles = ref<Candle[]>([])
const candlesPlaced = ref(0)
const totalCandles = 5

function initCandles() {
  candles.value = Array.from({ length: totalCandles }, (_, i) => ({
    id: i,
    placed: false,
    lit: false,
    emoji: TORTA_CANDLES[i % TORTA_CANDLES.length]!,
  }))
  candlesPlaced.value = 0
}

function handleCandleTap(index: number) {
  const candle = candles.value[index]
  if (!candle || candle.placed || phase.value !== 'candeline') return

  // Replace object to guarantee reactivity
  candles.value[index] = { ...candle, placed: true }
  playFlip()

  setTimeout(() => {
    candles.value[index] = { ...candles.value[index]!, lit: true }
    candlesPlaced.value++
    score.value += 10
    playSuccess()

    if (candlesPlaced.value >= totalCandles) {
      emit('progress', 100)
      setTimeout(() => {
        phase.value = 'win'
        playVictory()
        setTimeout(() => {
          emit('complete', score.value)
        }, 3000)
      }, 800)
    }
  }, 300)
}

// ── Lifecycle ──
onMounted(() => {
  initIngredients()
  emit('progress', 0)
})

onUnmounted(() => {
  if (feedbackTimeout) clearTimeout(feedbackTimeout)
  if (bakeTimer) { clearInterval(bakeTimer); bakeTimer = null }
})
</script>

<template>
  <div class="torta-game">
    <!-- Phase indicator -->
    <div class="torta-phases">
      <span
        v-for="(p, i) in (['ingredienti', 'mescola', 'inforna', 'candeline'] as Phase[])"
        :key="p"
        class="torta-phase-dot"
        :class="{
          active: phase === p,
          done: (['ingredienti', 'mescola', 'inforna', 'candeline'] as Phase[]).indexOf(phase) > i || phase === 'win',
        }"
      >
        {{ ['🥚', '🥣', '🔥', '🕯️'][i] }}
      </span>
    </div>

    <!-- HUD -->
    <div class="torta-hud">
      <span class="torta-hud-phase">{{ $t('torta.phase.' + (phase === 'win' ? 'candeline' : phase)) }}</span>
      <span class="torta-hud-score">🎂 {{ score }}</span>
    </div>

    <!-- Phase 1: Ingredienti -->
    <div v-if="phase === 'ingredienti'" class="torta-section">
      <div class="torta-instruction">
        {{ $t('torta.collectInstruction', { name: recipientName }) }}
      </div>

      <!-- Recipe card -->
      <div class="torta-recipe">
        <div class="torta-recipe-title">{{ $t('torta.recipe') }}</div>
        <div class="torta-recipe-list">
          <span
            v-for="ing in recipe"
            :key="ing.name"
            class="torta-recipe-item"
            :class="{ collected: grid.some(g => g.name === ing.name && g.collected) }"
          >
            {{ ing.emoji }} {{ $t('torta.ing.' + ing.name) }}
          </span>
        </div>
      </div>

      <!-- Feedback -->
      <div
        v-if="recipeFeedback"
        class="torta-feedback"
        :class="'torta-feedback--' + recipeFeedbackType"
      >
        {{ recipeFeedback }}
      </div>

      <!-- Grid -->
      <div class="torta-grid">
        <div
          v-for="(item, idx) in grid"
          :key="item.id"
          class="torta-ingredient"
          :class="{
            'torta-ingredient--collected': item.collected,
            'torta-ingredient--wrong': item.wrong,
          }"
          @click="handleIngredientTap(idx)"
        >
          <span class="torta-ingredient-emoji">{{ item.emoji }}</span>
        </div>
      </div>
    </div>

    <!-- Phase 2: Mescola -->
    <div v-if="phase === 'mescola'" class="torta-section">
      <div class="torta-instruction">
        {{ $t('torta.mixInstruction') }}
      </div>

      <div
        class="torta-bowl"
        :class="{ 'torta-bowl--shaking': mixBowlShaking }"
        @click="handleMixTap"
      >
        <span class="torta-bowl-emoji">🥣</span>
        <div class="torta-bowl-splashes" v-if="mixTaps > 0">
          <span
            v-for="n in Math.min(mixTaps, 6)"
            :key="n"
            class="torta-splash"
            :style="{ '--splash-i': n }"
          >💫</span>
        </div>
      </div>

      <div class="torta-mix-bar-container">
        <div class="torta-mix-bar" :style="{ width: mixProgress + '%' }" />
      </div>
      <div class="torta-mix-label">{{ mixTaps }} / {{ mixTarget }}</div>
    </div>

    <!-- Phase 3: Inforna -->
    <div v-if="phase === 'inforna'" class="torta-section">
      <div class="torta-instruction">
        {{ bakeStarted ? $t('torta.baking') : $t('torta.ovenInstruction') }}
      </div>

      <div
        class="torta-oven"
        :class="{
          'torta-oven--glowing': ovenGlowing,
          'torta-oven--done': bakeProgress >= 100,
        }"
        @click="handleOvenTap"
      >
        <div class="torta-oven-body">
          <div class="torta-oven-window">
            <span v-if="!bakeStarted" class="torta-oven-emoji">🥣</span>
            <span v-else-if="bakeProgress < 100" class="torta-oven-emoji torta-oven-emoji--baking">🥧</span>
            <span v-else class="torta-oven-emoji torta-oven-emoji--done">🎂</span>
          </div>
          <div class="torta-oven-handle" />
        </div>
        <div v-if="ovenGlowing && bakeProgress < 100" class="torta-steam">
          <span v-for="n in 3" :key="n" class="torta-steam-puff" :style="{ '--puff-i': n }">♨️</span>
        </div>
      </div>

      <div v-if="bakeStarted" class="torta-bake-bar-container">
        <div class="torta-bake-bar" :style="{ width: bakeProgress + '%' }" />
      </div>
    </div>

    <!-- Phase 4: Candeline -->
    <div v-if="phase === 'candeline'" class="torta-section">
      <div class="torta-instruction">
        {{ $t('torta.candlesInstruction') }}
      </div>

      <div class="torta-cake-display">
        <div class="torta-cake-base">🎂</div>
        <div class="torta-candles-row">
          <div
            v-for="candle in candles"
            :key="candle.id"
            class="torta-candle-slot"
            :class="{
              'torta-candle-slot--placed': candle.placed,
              'torta-candle-slot--lit': candle.lit,
            }"
          >
            <span v-if="candle.lit" class="torta-candle-flame">🔥</span>
            <span v-if="candle.placed" class="torta-candle-body">🕯️</span>
            <span v-else class="torta-candle-placeholder">⬜</span>
          </div>
        </div>
      </div>

      <!-- Candles to place -->
      <div class="torta-candles-tray">
        <div
          v-for="(candle, idx) in candles"
          :key="'tray-' + candle.id"
          class="torta-candle-pick"
          :class="{ 'torta-candle-pick--used': candle.placed }"
          @click="handleCandleTap(idx)"
        >
          <span v-if="!candle.placed">🕯️</span>
        </div>
      </div>
    </div>

    <!-- Win Overlay -->
    <div v-if="phase === 'win'" class="torta-overlay">
      <div class="torta-overlay-card">
        <div class="torta-overlay-emoji">🎂</div>
        <div class="torta-overlay-title">{{ $t('torta.win.' + recipientGender, { name: recipientName }) }}</div>
        <div class="torta-overlay-sub">{{ $t('torta.winSub') }}</div>
        <div class="torta-overlay-score">{{ $t('torta.winScore') }} {{ score }} 🎂</div>
      </div>
    </div>
  </div>
</template>
