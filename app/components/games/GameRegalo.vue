<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudio } from '~/composables/useAudio'
import { REGALO_SURPRISES, REGALO_LEVELS } from '~/utils/emoji-sets'
import '~/assets/css/game-regalo.css'

import type { RecipientGender } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

const LEVEL_LABEL_KEYS = ['regalo.level1', 'regalo.level2', 'regalo.level3']

interface Gift {
  id: number
  surprise: string
  tapsNeeded: number
  tapsReceived: number
  opened: boolean
  shaking: boolean
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

const { playFlip, playSuccess, playError, playLevelUp, playVictory } = useAudio()

const currentLevel = ref(0)
const score = ref(0)
const timeLeft = ref(0)
const gifts = ref<Gift[]>([])
const phase = ref<'playing' | 'levelComplete' | 'win' | 'lose'>('playing')

let nextId = 0
let countdownTimer: ReturnType<typeof setInterval> | null = null

const levelConfig = computed(() => REGALO_LEVELS[currentLevel.value]!)

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function createGifts() {
  const cfg = levelConfig.value
  const surprises = shuffleArray(REGALO_SURPRISES).slice(0, cfg.gifts)
  return surprises.map((surprise) => ({
    id: nextId++,
    surprise,
    tapsNeeded: cfg.tapsToOpen,
    tapsReceived: 0,
    opened: false,
    shaking: false,
  }))
}

function handleGiftTap(gift: Gift) {
  if (gift.opened || phase.value !== 'playing') return

  gift.tapsReceived++
  gift.shaking = true
  playFlip()

  setTimeout(() => { gift.shaking = false }, 150)

  if (gift.tapsReceived >= gift.tapsNeeded) {
    gift.opened = true
    score.value += 25
    playSuccess()

    // Check if all opened
    const allOpened = gifts.value.every(g => g.opened)
    if (allOpened) {
      onAllOpened()
    }
  }
}

function onAllOpened() {
  stopTimers()

  // Bonus points for remaining time
  score.value += timeLeft.value * 5

  if (currentLevel.value < REGALO_LEVELS.length - 1) {
    phase.value = 'levelComplete'
    playLevelUp()
    emit('progress', Math.round(((currentLevel.value + 1) / REGALO_LEVELS.length) * 100))

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

function startLevel() {
  const cfg = levelConfig.value
  timeLeft.value = cfg.timeLimit
  gifts.value = createGifts()
  phase.value = 'playing'

  emit('progress', Math.round((currentLevel.value / REGALO_LEVELS.length) * 100))

  countdownTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      onTimeUp()
    }
  }, 1000)
}

function onTimeUp() {
  stopTimers()
  phase.value = 'lose'
  playError()
}

function handleLoseAcknowledge() {
  emit('complete', score.value)
}

function stopTimers() {
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null }
}

function giftProgress(gift: Gift): number {
  return Math.round((gift.tapsReceived / gift.tapsNeeded) * 100)
}

onMounted(() => {
  startLevel()
})

onUnmounted(() => {
  stopTimers()
})
</script>

<template>
  <div class="regalo-game">
    <!-- HUD -->
    <div class="regalo-hud">
      <span class="regalo-hud-level">{{ $t(LEVEL_LABEL_KEYS[currentLevel] ?? 'regalo.level1') }}</span>
      <span class="regalo-hud-score">💝 {{ score }}</span>
      <span
        class="regalo-hud-timer"
        :class="{ 'regalo-hud-timer--warning': timeLeft <= 5 }"
      >⏱ {{ timeLeft }}s</span>
    </div>

    <!-- Instruction -->
    <div class="regalo-instruction">
      {{ $t('regalo.instruction') }}
    </div>

    <!-- Gift grid -->
    <div class="regalo-grid" :style="{ '--cols': Math.min(gifts.length, 4) }">
      <div
        v-for="gift in gifts"
        :key="gift.id"
        class="regalo-gift"
        :class="{
          'regalo-gift--opened': gift.opened,
          'regalo-gift--shaking': gift.shaking,
        }"
        @click="handleGiftTap(gift)"
      >
        <div class="regalo-gift-inner">
          <div v-if="!gift.opened" class="regalo-gift-wrapped">
            <span class="regalo-gift-emoji">🎁</span>
            <div class="regalo-gift-progress">
              <div class="regalo-gift-bar" :style="{ width: giftProgress(gift) + '%' }" />
            </div>
          </div>
          <div v-else class="regalo-gift-surprise">
            <span class="regalo-gift-surprise-emoji">{{ gift.surprise }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Level Complete Overlay -->
    <div v-if="phase === 'levelComplete'" class="regalo-overlay">
      <div class="regalo-overlay-card">
        <div class="regalo-overlay-emoji">🎉</div>
        <div class="regalo-overlay-title">{{ $t('regalo.levelDone') }}</div>
        <div class="regalo-overlay-sub">{{ $t('regalo.levelDoneSub') }}</div>
        <div class="regalo-overlay-score">{{ $t('regalo.points') }} {{ score }} 💝</div>
      </div>
    </div>

    <!-- Win Overlay -->
    <div v-if="phase === 'win'" class="regalo-overlay">
      <div class="regalo-overlay-card">
        <div class="regalo-overlay-emoji">🏆</div>
        <div class="regalo-overlay-title">{{ $t('regalo.win.' + recipientGender, { name: recipientName }) }}</div>
        <div class="regalo-overlay-sub">{{ $t('regalo.winSub') }}</div>
        <div class="regalo-overlay-score">{{ $t('regalo.winScore') }} {{ score }} 💝</div>
      </div>
    </div>

    <!-- Lose Overlay -->
    <div v-if="phase === 'lose'" class="regalo-overlay" @click="handleLoseAcknowledge">
      <div class="regalo-overlay-card">
        <div class="regalo-overlay-emoji">⏰</div>
        <div class="regalo-overlay-title">{{ $t('regalo.lose') }}</div>
        <div class="regalo-overlay-sub">{{ $t('regalo.loseSub', { name: recipientName }) }}</div>
        <div class="regalo-overlay-score">{{ $t('regalo.loseScore') }} {{ score }}</div>
      </div>
    </div>
  </div>
</template>
