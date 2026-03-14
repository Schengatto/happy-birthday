<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudio } from '~/composables/useAudio'
import { PALLONCINI_GOOD, PALLONCINI_BAD, PALLONCINI_LEVELS } from '~/utils/emoji-sets'
import '~/assets/css/game-palloncini.css'

interface Balloon {
  id: number
  emoji: string
  isGood: boolean
  x: number
  wobble: number
  duration: number
  size: number
  popped: boolean
}

interface ScorePopup {
  id: number
  x: number
  y: number
  text: string
  good: boolean
}

import type { RecipientGender } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

const props = defineProps<{
  recipientName: string
  recipientGender: RecipientGender
  theme?: 'pink' | 'dark' | 'pastel'
}>()

const emit = defineEmits<{
  complete: [score: number]
  progress: [percent: number]
}>()

const { playPop, playError, playLevelUp, playVictory } = useAudio()

const currentLevel = ref(0)
const score = ref(0)
const lives = ref(3)
const timeLeft = ref(0)
const balloons = ref<Balloon[]>([])
const popups = ref<ScorePopup[]>([])
const phase = ref<'playing' | 'levelComplete' | 'win' | 'lose'>('playing')

let nextId = 0
let spawnTimer: ReturnType<typeof setInterval> | null = null
let countdownTimer: ReturnType<typeof setInterval> | null = null
let cleanupTimer: ReturnType<typeof setInterval> | null = null

const levelConfig = computed(() => PALLONCINI_LEVELS[currentLevel.value]!)

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function spawnBalloon() {
  if (phase.value !== 'playing') return

  const cfg = levelConfig.value
  const isGood = Math.random() < cfg.goodRatio
  const pool = isGood ? PALLONCINI_GOOD : PALLONCINI_BAD
  const emoji = pool[Math.floor(Math.random() * pool.length)]!
  const duration = cfg.baseDur + (Math.random() - 0.5) * 1400 // ±700ms

  const balloon: Balloon = {
    id: nextId++,
    emoji,
    isGood,
    x: randomBetween(8, 84),
    wobble: randomBetween(-8, 8),
    duration,
    size: randomBetween(2.4, 3.3),
    popped: false,
  }

  balloons.value.push(balloon)
}

function addPopup(x: number, y: number, text: string, good: boolean) {
  const popup: ScorePopup = { id: nextId++, x, y, text, good }
  popups.value.push(popup)
  setTimeout(() => {
    popups.value = popups.value.filter(p => p.id !== popup.id)
  }, 900)
}

function handleBalloonClick(balloon: Balloon, event: MouseEvent | TouchEvent) {
  if (balloon.popped || phase.value !== 'playing') return
  balloon.popped = true

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const popupX = rect.left + rect.width / 2
  const popupY = rect.top

  if (balloon.isGood) {
    score.value += 10
    playPop(true)
    addPopup(popupX, popupY, '+10 🎀', true)
  } else {
    lives.value--
    playPop(false)
    playError()
    addPopup(popupX, popupY, '💔', false)

    if (lives.value <= 0) {
      phase.value = 'lose'
      stopTimers()
      return
    }
  }
}

function cleanupBalloons() {
  // Remove balloons that have finished their animation (past duration + buffer)
  balloons.value = balloons.value.filter(b => {
    if (b.popped) return false
    return true
  })
}

function startLevel() {
  const cfg = levelConfig.value
  timeLeft.value = cfg.time
  balloons.value = []
  popups.value = []
  phase.value = 'playing'

  emit('progress', Math.round(((currentLevel.value) / PALLONCINI_LEVELS.length) * 100))

  spawnTimer = setInterval(spawnBalloon, cfg.spawnInterval)

  countdownTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      onLevelTimeUp()
    }
  }, 1000)

  // Periodically clean popped balloons from DOM
  cleanupTimer = setInterval(cleanupBalloons, 2000)
}

function stopTimers() {
  if (spawnTimer) { clearInterval(spawnTimer); spawnTimer = null }
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null }
  if (cleanupTimer) { clearInterval(cleanupTimer); cleanupTimer = null }
}

function onLevelTimeUp() {
  stopTimers()

  if (currentLevel.value < PALLONCINI_LEVELS.length - 1) {
    phase.value = 'levelComplete'
    playLevelUp()

    setTimeout(() => {
      currentLevel.value++
      startLevel()
    }, 2000)
  } else {
    phase.value = 'win'
    playVictory()
    emit('progress', 100)

    setTimeout(() => {
      emit('complete', score.value)
    }, 3000)
  }
}

function handleLoseAcknowledge() {
  emit('complete', 0)
}

onMounted(() => {
  startLevel()
})

onUnmounted(() => {
  stopTimers()
  // Clear any pending popup timeouts by emptying the array
  popups.value = []
})
</script>

<template>
  <div class="palloncini-game">
    <!-- HUD -->
    <div class="palloncini-hud">
      <span class="palloncini-hud-level">{{ levelConfig!.badge }}</span>
      <span class="palloncini-hud-score">🎀 {{ score }}</span>
      <span class="palloncini-hud-hearts">
        <span
          v-for="i in 3"
          :key="i"
          class="palloncini-hud-heart"
          :class="{ 'palloncini-hud-heart--lost': i > lives }"
        >❤️</span>
      </span>
      <span
        class="palloncini-hud-timer"
        :class="{ 'palloncini-hud-timer--warning': timeLeft <= 5 }"
      >⏱ {{ timeLeft }}s</span>
    </div>

    <!-- Arena -->
    <div class="palloncini-arena">
      <span
        v-for="balloon in balloons"
        :key="balloon.id"
        class="palloncini-balloon"
        :class="{
          'palloncini-balloon--popped': balloon.popped,
          'palloncini-balloon--bad': !balloon.isGood,
        }"
        :style="{
          '--x': balloon.x + '%',
          '--dur': balloon.duration + 'ms',
          '--w': balloon.wobble,
          '--sz': balloon.size + 'rem',
        }"
        @click="handleBalloonClick(balloon, $event)"
      >{{ balloon.emoji }}</span>

      <!-- Score popups -->
      <span
        v-for="popup in popups"
        :key="popup.id"
        class="palloncini-popup"
        :class="popup.good ? 'palloncini-popup--good' : 'palloncini-popup--bad'"
        :style="{ left: popup.x + 'px', top: popup.y + 'px', position: 'fixed' }"
      >{{ popup.text }}</span>
    </div>

    <!-- Level Complete Overlay -->
    <div v-if="phase === 'levelComplete'" class="palloncini-overlay">
      <div class="palloncini-overlay-card">
        <div class="palloncini-overlay-emoji">🎉</div>
        <div class="palloncini-overlay-title">{{ $t('palloncini.levelDone') }}</div>
        <div class="palloncini-overlay-sub">{{ $t('palloncini.levelDoneSub') }}</div>
        <div class="palloncini-overlay-score">{{ $t('palloncini.decorations') }} {{ score }} ⭐</div>
      </div>
    </div>

    <!-- Win Overlay -->
    <div v-if="phase === 'win'" class="palloncini-overlay">
      <div class="palloncini-overlay-card">
        <div class="palloncini-overlay-emoji">🏆</div>
        <div class="palloncini-overlay-title">{{ $t('palloncini.win.' + recipientGender, { name: recipientName }) }}</div>
        <div class="palloncini-overlay-sub">{{ $t('palloncini.winSub') }}</div>
        <div class="palloncini-overlay-score">{{ $t('palloncini.winScore') }} {{ score }} ⭐</div>
      </div>
    </div>

    <!-- Lose Overlay -->
    <div v-if="phase === 'lose'" class="palloncini-overlay" @click="handleLoseAcknowledge">
      <div class="palloncini-overlay-card">
        <div class="palloncini-overlay-emoji">😢</div>
        <div class="palloncini-overlay-title">{{ $t('palloncini.lose') }}</div>
        <div class="palloncini-overlay-sub">{{ $t('palloncini.loseSub', { name: recipientName }) }}</div>
        <div class="palloncini-overlay-score">{{ $t('palloncini.loseScore') }} {{ score }}</div>
      </div>
    </div>
  </div>
</template>
