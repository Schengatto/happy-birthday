<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudio } from '~/composables/useAudio'
import { DOLCETTI_GOOD, DOLCETTI_BAD, DOLCETTI_LEVELS } from '~/utils/emoji-sets'
import '~/assets/css/game-dolcetti.css'

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

const { playError, playVictory, playPop } = useAudio()

const TARGET = 10

// Game state
const caught = ref(0)
const lives = ref(3)
const phase = ref<'playing' | 'win' | 'lose'>('playing')
const playerX = ref(50)
const items = ref<{ id: number; emoji: string; x: number; y: number; bad: boolean; caught: boolean }[]>([])

let nextId = 0
let spawnTimer: ReturnType<typeof setInterval> | null = null
let animFrame: number | null = null
let lastTime = 0
let moveDirection = 0

const levelConfig = computed(() => DOLCETTI_LEVELS[0]!)
const playerWidth = 16

function shufflePick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

function spawnItem() {
  if (phase.value !== 'playing') return
  const cfg = levelConfig.value
  const isGood = Math.random() < cfg.goodRatio
  const emoji = isGood ? shufflePick(DOLCETTI_GOOD) : shufflePick(DOLCETTI_BAD)
  items.value.push({
    id: nextId++,
    emoji,
    x: 5 + Math.random() * 90,
    y: -8,
    bad: !isGood,
    caught: false,
  })
}

function gameLoop(timestamp: number) {
  if (phase.value !== 'playing') return
  if (!lastTime) lastTime = timestamp
  const dt = (timestamp - lastTime) / 1000
  lastTime = timestamp

  const moveSpeed = 120
  if (moveDirection !== 0) {
    playerX.value = Math.max(3, Math.min(97, playerX.value + moveDirection * moveSpeed * dt))
  }

  const cfg = levelConfig.value
  const fallSpeed = 100 / (cfg.fallDuration / 1000)
  const catchZoneY = 85

  for (const item of items.value) {
    if (item.caught) continue
    item.y += fallSpeed * dt

    if (item.y >= catchZoneY - 5 && item.y <= catchZoneY + 8) {
      const dist = Math.abs(item.x - playerX.value)
      if (dist < playerWidth / 2 + 3) {
        item.caught = true
        if (item.bad) {
          lives.value--
          playError()
          if (lives.value <= 0) {
            phase.value = 'lose'
            stopAll()
            return
          }
        } else {
          caught.value++
          playPop(true)
          emit('progress', Math.round((caught.value / TARGET) * 100))
          if (caught.value >= TARGET) {
            phase.value = 'win'
            stopAll()
            playVictory()
            emit('progress', 100)
            setTimeout(() => {
              emit('complete', caught.value * 100)
            }, 3000)
            return
          }
        }
      }
    }
  }

  items.value = items.value.filter(i => i.y < 110 && !i.caught)
  animFrame = requestAnimationFrame(gameLoop)
}

function startGame() {
  phase.value = 'playing'
  items.value = []
  lastTime = 0
  moveDirection = 0
  playerX.value = 50

  const cfg = levelConfig.value
  spawnTimer = setInterval(spawnItem, cfg.spawnInterval)
  animFrame = requestAnimationFrame(gameLoop)
}

function onKeyDown(e: KeyboardEvent) {
  if (phase.value !== 'playing') return
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    moveDirection = -1
    e.preventDefault()
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    moveDirection = 1
    e.preventDefault()
  }
}

function onKeyUp(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    if (moveDirection === -1) moveDirection = 0
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    if (moveDirection === 1) moveDirection = 0
  }
}

function startMoveLeft() { moveDirection = -1 }
function startMoveRight() { moveDirection = 1 }
function stopMove() { moveDirection = 0 }

function handleLoseAcknowledge() {
  emit('complete', caught.value * 50)
}

function stopAll() {
  if (spawnTimer) { clearInterval(spawnTimer); spawnTimer = null }
  if (animFrame !== null) { cancelAnimationFrame(animFrame); animFrame = null }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  startGame()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  stopAll()
})
</script>

<template>
  <div class="dolcetti-game">
    <!-- HUD -->
    <div class="dolcetti-hud">
      <span class="dolcetti-hud-caught">🍬 {{ caught }}/{{ TARGET }}</span>
      <span class="dolcetti-hud-lives">
        <span v-for="i in 3" :key="i" :class="{ 'dolcetti-life--lost': i > lives }">
          {{ i <= lives ? '❤️' : '🖤' }}
        </span>
      </span>
    </div>

    <!-- Instruction -->
    <div class="dolcetti-instruction">
      {{ $t('dolcetti.instruction') }}
    </div>

    <!-- Game Area -->
    <div class="dolcetti-area">
      <div
        v-for="item in items"
        :key="item.id"
        class="dolcetti-item"
        :class="{ 'dolcetti-item--bad': item.bad }"
        :style="{ left: item.x + '%', top: item.y + '%' }"
      >
        {{ item.emoji }}
      </div>

      <div
        class="dolcetti-player"
        :style="{ left: playerX + '%' }"
      >
        🙌
      </div>
    </div>

    <!-- Mobile controls -->
    <div class="dolcetti-controls">
      <button
        class="dolcetti-ctrl-btn dolcetti-ctrl-left"
        @pointerdown.prevent="startMoveLeft"
        @pointerup.prevent="stopMove"
        @pointerleave.prevent="stopMove"
        @pointercancel.prevent="stopMove"
        :disabled="phase !== 'playing'"
      >
        ◀
      </button>
      <button
        class="dolcetti-ctrl-btn dolcetti-ctrl-right"
        @pointerdown.prevent="startMoveRight"
        @pointerup.prevent="stopMove"
        @pointerleave.prevent="stopMove"
        @pointercancel.prevent="stopMove"
        :disabled="phase !== 'playing'"
      >
        ▶
      </button>
    </div>

    <!-- Win Overlay -->
    <div v-if="phase === 'win'" class="dolcetti-overlay">
      <div class="dolcetti-overlay-card">
        <div class="dolcetti-overlay-emoji">🏆</div>
        <div class="dolcetti-overlay-title">{{ $t('dolcetti.win.' + props.recipientGender, { name: props.recipientName }) }}</div>
        <div class="dolcetti-overlay-sub">{{ $t('dolcetti.winSub') }}</div>
        <div class="dolcetti-overlay-score">🍬 {{ caught }}/{{ TARGET }}</div>
      </div>
    </div>

    <!-- Lose Overlay -->
    <div v-if="phase === 'lose'" class="dolcetti-overlay" @click="handleLoseAcknowledge">
      <div class="dolcetti-overlay-card">
        <div class="dolcetti-overlay-emoji">😔</div>
        <div class="dolcetti-overlay-title">{{ $t('dolcetti.lose') }}</div>
        <div class="dolcetti-overlay-sub">{{ $t('dolcetti.loseSub', { name: props.recipientName }) }}</div>
        <div class="dolcetti-overlay-score">🍬 {{ caught }}/{{ TARGET }}</div>
      </div>
    </div>
  </div>
</template>
