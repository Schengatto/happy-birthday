<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudio } from '~/composables/useAudio'
import { ARTIGLIO_DOLCETTI, ARTIGLIO_BAD, ARTIGLIO_ROUNDS } from '~/utils/emoji-sets'
import '~/assets/css/game-artiglio.css'

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

const { playSuccess, playError, playLevelUp, playVictory, playPop } = useAudio()

// Game state
const currentRound = ref(0)
const totalCaught = ref(0)
const attemptsLeft = ref(5)
const phase = ref<'playing' | 'dropping' | 'grabbing' | 'returning' | 'roundComplete' | 'win' | 'lose'>('playing')
const clawX = ref(50) // percentage 0-100 (horizontal position)
const clawDirection = ref(1) // 1 = right, -1 = left
const clawDrop = ref(0) // percentage 0-100 of the drop zone height
const caughtEmoji = ref('')
const shelfItems = ref<{ id: number; emoji: string; x: number; bad: boolean }[]>([])

let animFrame: number | null = null
let dropTimer: ReturnType<typeof setInterval> | null = null
let nextId = 0

const roundConfig = computed(() => ARTIGLIO_ROUNDS[currentRound.value]!)
const totalTarget = computed(() => ARTIGLIO_ROUNDS.reduce((s, r) => s + r.catchTarget, 0))

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function generateShelf() {
  const goodCount = 4 + currentRound.value
  const badCount = 1 + currentRound.value // 1 bad in round 1, 2 in round 2, 3 in round 3
  const totalCount = goodCount + badCount

  const goodEmojis = shuffleArray(ARTIGLIO_DOLCETTI).slice(0, goodCount)
  const badEmojis = shuffleArray(ARTIGLIO_BAD)

  const allItems: typeof shelfItems.value = []
  for (let i = 0; i < goodCount; i++) {
    allItems.push({ id: nextId++, emoji: goodEmojis[i % goodEmojis.length]!, x: 0, bad: false })
  }
  for (let i = 0; i < badCount; i++) {
    allItems.push({ id: nextId++, emoji: badEmojis[i % badEmojis.length]!, x: 0, bad: true })
  }

  // Shuffle positions and assign evenly spaced x
  const shuffled = shuffleArray(allItems)
  for (let i = 0; i < shuffled.length; i++) {
    shuffled[i]!.x = 8 + (84 / (totalCount - 1)) * i
  }
  shelfItems.value = shuffled
}

function startRound() {
  phase.value = 'playing'
  clawX.value = 50
  clawDrop.value = 0
  clawDirection.value = 1
  caughtEmoji.value = ''
  generateShelf()
  startClawMovement()
}

function startClawMovement() {
  stopAnimation()
  function animate() {
    if (phase.value !== 'playing') return
    const speed = roundConfig.value.speed
    clawX.value += speed * clawDirection.value
    if (clawX.value >= 92) {
      clawX.value = 92
      clawDirection.value = -1
    } else if (clawX.value <= 8) {
      clawX.value = 8
      clawDirection.value = 1
    }
    animFrame = requestAnimationFrame(animate)
  }
  animFrame = requestAnimationFrame(animate)
}

function handleGrab() {
  if (phase.value !== 'playing') return
  stopAnimation()
  phase.value = 'dropping'
  attemptsLeft.value--

  // Slow drop: ~1.5% per 30ms = ~2 seconds to reach bottom
  dropTimer = setInterval(() => {
    clawDrop.value += 1.5
    if (clawDrop.value >= 100) {
      clawDrop.value = 100
      clearDropTimer()
      checkGrab()
    }
  }, 30)
}

function checkGrab() {
  const grabRange = 8
  let caught: typeof shelfItems.value[0] | null = null

  for (const item of shelfItems.value) {
    if (Math.abs(clawX.value - item.x) <= grabRange) {
      caught = item
      break
    }
  }

  if (caught) {
    caughtEmoji.value = caught.emoji
    shelfItems.value = shelfItems.value.filter(i => i.id !== caught!.id)
    phase.value = 'grabbing'
    const isBad = caught.bad

    if (isBad) {
      playError()
      // Penalty: lose an extra attempt
      attemptsLeft.value = Math.max(0, attemptsLeft.value - 1)
    } else {
      playSuccess()
      totalCaught.value++
    }

    // Pause at bottom to "grab", then return up
    setTimeout(() => {
      phase.value = 'returning'
      dropTimer = setInterval(() => {
        clawDrop.value -= 1.5
        if (clawDrop.value <= 0) {
          clawDrop.value = 0
          clearDropTimer()
          onGrabComplete(!isBad)
        }
      }, 30)
    }, 600)
  } else {
    // Miss — pause briefly then return
    playPop(false)
    phase.value = 'returning'
    setTimeout(() => {
      dropTimer = setInterval(() => {
        clawDrop.value -= 2
        if (clawDrop.value <= 0) {
          clawDrop.value = 0
          clearDropTimer()
          onGrabComplete(false)
        }
      }, 30)
    }, 400)
  }
}

function onGrabComplete(success: boolean) {
  caughtEmoji.value = ''

  const roundTarget = roundConfig.value.catchTarget
  const caughtThisRound = totalCaught.value - ARTIGLIO_ROUNDS.slice(0, currentRound.value).reduce((s, r) => s + r.catchTarget, 0)

  if (caughtThisRound >= roundTarget) {
    if (currentRound.value < ARTIGLIO_ROUNDS.length - 1) {
      phase.value = 'roundComplete'
      playLevelUp()
      emit('progress', Math.round(((currentRound.value + 1) / ARTIGLIO_ROUNDS.length) * 100))
      setTimeout(() => {
        currentRound.value++
        attemptsLeft.value = Math.max(attemptsLeft.value, 3)
        startRound()
      }, 2000)
    } else {
      phase.value = 'win'
      playVictory()
      emit('progress', 100)
      setTimeout(() => {
        emit('complete', totalCaught.value * 100)
      }, 3000)
    }
  } else if (attemptsLeft.value <= 0) {
    phase.value = 'lose'
    playError()
  } else {
    phase.value = 'playing'
    startClawMovement()
  }
}

function handleLoseAcknowledge() {
  emit('complete', totalCaught.value * 50)
}

function clearDropTimer() {
  if (dropTimer) { clearInterval(dropTimer); dropTimer = null }
}

function stopAnimation() {
  if (animFrame !== null) {
    cancelAnimationFrame(animFrame)
    animFrame = null
  }
}

function stopAll() {
  stopAnimation()
  clearDropTimer()
}

onMounted(() => {
  attemptsLeft.value = 5
  startRound()
})

onUnmounted(() => {
  stopAll()
})
</script>

<template>
  <div class="artiglio-game">
    <!-- HUD -->
    <div class="artiglio-hud">
      <span class="artiglio-hud-round">{{ $t('artiglio.round', { current: currentRound + 1, total: ARTIGLIO_ROUNDS.length }) }}</span>
      <span class="artiglio-hud-caught">🧁 {{ totalCaught }}/{{ totalTarget }}</span>
      <span class="artiglio-hud-attempts" :class="{ 'artiglio-hud-attempts--low': attemptsLeft <= 2 }">
        🎯 {{ attemptsLeft }}
      </span>
    </div>

    <!-- Instruction -->
    <div class="artiglio-instruction">
      {{ $t('artiglio.instruction') }}
    </div>

    <!-- Machine -->
    <div class="artiglio-machine">
      <!-- Rail bar -->
      <div class="artiglio-rail"></div>

      <!-- Rope: stretches from rail down to the claw -->
      <div
        class="artiglio-rope"
        :style="{
          left: clawX + '%',
          top: '28px',
          height: 'calc(' + clawDrop + '% - ' + (clawDrop * 0.88) + 'px)',
        }"
      ></div>

      <!-- Claw assembly: moves horizontally + drops vertically -->
      <div
        class="artiglio-claw-assembly"
        :style="{
          left: clawX + '%',
          top: 'calc(' + clawDrop + '% + ' + (28 - clawDrop * 0.88) + 'px)',
        }"
      >
        <div class="artiglio-claw" :class="{ 'artiglio-claw--closed': phase === 'grabbing' || (phase === 'returning' && caughtEmoji) }">
          <span class="artiglio-claw-left">╲</span>
          <span class="artiglio-claw-right">╱</span>
        </div>
        <span v-if="caughtEmoji" class="artiglio-claw-prize">{{ caughtEmoji }}</span>
      </div>

      <!-- Shelf with sweets -->
      <div class="artiglio-shelf">
        <div
          v-for="item in shelfItems"
          :key="item.id"
          class="artiglio-sweet"
          :style="{ left: item.x + '%' }"
        >
          {{ item.emoji }}
        </div>
      </div>
    </div>

    <!-- Grab button -->
    <button
      class="artiglio-grab-btn"
      :disabled="phase !== 'playing'"
      @click="handleGrab"
    >
      {{ $t('artiglio.grab') }}
    </button>

    <!-- Round Complete Overlay -->
    <div v-if="phase === 'roundComplete'" class="artiglio-overlay">
      <div class="artiglio-overlay-card">
        <div class="artiglio-overlay-emoji">🎉</div>
        <div class="artiglio-overlay-title">{{ $t('artiglio.roundDone') }}</div>
        <div class="artiglio-overlay-sub">{{ $t('artiglio.roundDoneSub') }}</div>
        <div class="artiglio-overlay-score">🧁 {{ totalCaught }}/{{ totalTarget }}</div>
      </div>
    </div>

    <!-- Win Overlay -->
    <div v-if="phase === 'win'" class="artiglio-overlay">
      <div class="artiglio-overlay-card">
        <div class="artiglio-overlay-emoji">🏆</div>
        <div class="artiglio-overlay-title">{{ $t('artiglio.win.' + props.recipientGender, { name: props.recipientName }) }}</div>
        <div class="artiglio-overlay-sub">{{ $t('artiglio.winSub') }}</div>
        <div class="artiglio-overlay-score">{{ $t('artiglio.winScore') }} {{ totalCaught * 100 }} 💝</div>
      </div>
    </div>

    <!-- Lose Overlay -->
    <div v-if="phase === 'lose'" class="artiglio-overlay" @click="handleLoseAcknowledge">
      <div class="artiglio-overlay-card">
        <div class="artiglio-overlay-emoji">😔</div>
        <div class="artiglio-overlay-title">{{ $t('artiglio.lose') }}</div>
        <div class="artiglio-overlay-sub">{{ $t('artiglio.loseSub', { name: props.recipientName }) }}</div>
        <div class="artiglio-overlay-score">🧁 {{ totalCaught }}/{{ totalTarget }}</div>
      </div>
    </div>
  </div>
</template>
