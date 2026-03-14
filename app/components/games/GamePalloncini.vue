<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAudio } from '~/composables/useAudio'
import { PALLONCINI_EMOJIS, PALLONCINI_TARGET, PALLONCINI_SPAWN_INTERVAL, PALLONCINI_BASE_DUR } from '~/utils/emoji-sets'
import '~/assets/css/game-palloncini.css'

import type { RecipientGender } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

interface Balloon {
  id: number
  emoji: string
  x: number
  wobble: number
  duration: number
  size: number
  popped: boolean
}

const props = defineProps<{
  recipientName: string
  recipientGender: RecipientGender
  theme?: 'pink' | 'dark' | 'pastel'
}>()

const emit = defineEmits<{
  complete: [score: number]
  progress: [percent: number]
}>()

const { playPop, playVictory } = useAudio()

const caught = ref(0)
const balloons = ref<Balloon[]>([])
const phase = ref<'playing' | 'win'>('playing')

let nextId = 0
let spawnTimer: ReturnType<typeof setInterval> | null = null
let cleanupTimer: ReturnType<typeof setInterval> | null = null

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function spawnBalloon() {
  if (phase.value !== 'playing') return

  const emoji = PALLONCINI_EMOJIS[Math.floor(Math.random() * PALLONCINI_EMOJIS.length)]!
  const duration = PALLONCINI_BASE_DUR + (Math.random() - 0.5) * 1400

  const balloon: Balloon = {
    id: nextId++,
    emoji,
    x: randomBetween(8, 84),
    wobble: randomBetween(-8, 8),
    duration,
    size: randomBetween(2.4, 3.3),
    popped: false,
  }

  balloons.value.push(balloon)
}

function handleBalloonClick(balloon: Balloon) {
  if (balloon.popped || phase.value !== 'playing') return
  balloon.popped = true
  caught.value++
  playPop(true)

  emit('progress', Math.round((caught.value / PALLONCINI_TARGET) * 100))

  if (caught.value >= PALLONCINI_TARGET) {
    phase.value = 'win'
    stopTimers()
    playVictory()
    emit('progress', 100)
    setTimeout(() => emit('complete', caught.value), 3000)
  }
}

function cleanupBalloons() {
  balloons.value = balloons.value.filter(b => !b.popped)
}

function startGame() {
  caught.value = 0
  balloons.value = []
  phase.value = 'playing'
  emit('progress', 0)

  spawnTimer = setInterval(spawnBalloon, PALLONCINI_SPAWN_INTERVAL)
  cleanupTimer = setInterval(cleanupBalloons, 2000)
}

function stopTimers() {
  if (spawnTimer) { clearInterval(spawnTimer); spawnTimer = null }
  if (cleanupTimer) { clearInterval(cleanupTimer); cleanupTimer = null }
}

onMounted(() => {
  startGame()
})

onUnmounted(() => {
  stopTimers()
})
</script>

<template>
  <div class="palloncini-game">
    <!-- HUD -->
    <div class="palloncini-hud">
      <span class="palloncini-hud-title">🎈 {{ $t('palloncini.title') }}</span>
      <span class="palloncini-hud-counter">{{ caught }}/{{ PALLONCINI_TARGET }}</span>
    </div>

    <!-- Arena -->
    <div class="palloncini-arena">
      <span
        v-for="balloon in balloons"
        :key="balloon.id"
        class="palloncini-balloon"
        :class="{ 'palloncini-balloon--popped': balloon.popped }"
        :style="{
          '--x': balloon.x + '%',
          '--dur': balloon.duration + 'ms',
          '--w': balloon.wobble,
          '--sz': balloon.size + 'rem',
        }"
        @click="handleBalloonClick(balloon)"
      >{{ balloon.emoji }}</span>
    </div>

    <!-- Instruction -->
    <div class="palloncini-instruction">
      {{ $t('palloncini.instruction') }}
    </div>

    <!-- Win Overlay -->
    <div v-if="phase === 'win'" class="palloncini-overlay">
      <div class="palloncini-overlay-card">
        <div class="palloncini-overlay-emoji">🎈</div>
        <div class="palloncini-overlay-title">{{ $t('palloncini.win.' + recipientGender, { name: recipientName }) }}</div>
        <div class="palloncini-overlay-sub">{{ $t('palloncini.winSub') }}</div>
      </div>
    </div>
  </div>
</template>
