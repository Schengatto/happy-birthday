<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useAudio } from '~/composables/useAudio'
import { SEQUENZA_EMOJIS, SEQUENZA_LEVELS } from '~/utils/emoji-sets'
import '~/assets/css/game-sequenza.css'

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

const { playError, playFlip, playVictory } = useAudio()

const score = ref(0)
const phase = ref<'showing' | 'input' | 'win' | 'fail'>('showing')
const sequence = ref<number[]>([])
const playerInput = ref<number[]>([])
const activeShowIndex = ref(-1)
const activeInputIndex = ref<number | null>(null)
const message = ref('')

let showTimer: ReturnType<typeof setTimeout> | null = null

const levelConfig = computed(() => SEQUENZA_LEVELS[0]!)

const buttonCount = computed(() => 4)
const buttons = computed(() => SEQUENZA_EMOJIS.slice(0, buttonCount.value))

function generateSequence() {
  const len = levelConfig.value.length
  const seq: number[] = []
  for (let i = 0; i < len; i++) {
    seq.push(Math.floor(Math.random() * buttonCount.value))
  }
  return seq
}

function showSequence() {
  phase.value = 'showing'
  message.value = $t('sequenza.watch')
  activeShowIndex.value = -1
  playerInput.value = []

  const showTime = levelConfig.value.showTime
  let i = 0

  function showNext() {
    if (i < sequence.value.length) {
      activeShowIndex.value = sequence.value[i]!
      playFlip()
      showTimer = setTimeout(() => {
        activeShowIndex.value = -1
        showTimer = setTimeout(() => {
          i++
          showNext()
        }, 200)
      }, showTime)
    } else {
      activeShowIndex.value = -1
      phase.value = 'input'
      message.value = $t('sequenza.repeat')
    }
  }

  showTimer = setTimeout(showNext, 600)
}

function handleButtonClick(btnIndex: number) {
  if (phase.value !== 'input') return

  // Flash feedback
  activeInputIndex.value = btnIndex
  setTimeout(() => { activeInputIndex.value = null }, 200)

  const expectedIndex = playerInput.value.length
  const expected = sequence.value[expectedIndex]

  if (btnIndex === expected) {
    playFlip()
    playerInput.value.push(btnIndex)
    score.value += 10

    if (playerInput.value.length === sequence.value.length) {
      phase.value = 'win'
      message.value = ''
      playVictory()
      emit('progress', 100)

      showTimer = setTimeout(() => {
        emit('complete', score.value)
      }, 3000)
    }
  } else {
    playError()
    phase.value = 'fail'
    message.value = $t('sequenza.wrong')

    showTimer = setTimeout(() => {
      // Retry same level
      startLevel()
    }, 1500)
  }
}

function startLevel() {
  sequence.value = generateSequence()
  playerInput.value = []
  emit('progress', 0)
  showSequence()
}

function clearTimers() {
  if (showTimer) { clearTimeout(showTimer); showTimer = null }
}

onUnmounted(() => {
  clearTimers()
})

// Start first level
startLevel()
</script>

<template>
  <div class="sequenza-game">
    <!-- HUD -->
    <div class="sequenza-hud">
      <span class="sequenza-hud-level">{{ SEQUENZA_LEVELS[0]!.label }}</span>
      <span class="sequenza-hud-score">⭐ {{ score }}</span>
    </div>

    <!-- Message -->
    <div class="sequenza-message" :class="{ 'sequenza-message--error': phase === 'fail' }">
      {{ message }}
    </div>

    <!-- Sequence progress dots -->
    <div class="sequenza-progress">
      <span
        v-for="(s, i) in sequence"
        :key="i"
        class="sequenza-dot"
        :class="{
          'sequenza-dot--done': i < playerInput.length,
          'sequenza-dot--active': phase === 'showing' && activeShowIndex === s && i === sequence.findIndex((v, idx) => idx >= playerInput.length && v === activeShowIndex),
          'sequenza-dot--current': phase === 'input' && i === playerInput.length,
        }"
      />
    </div>

    <!-- Emoji buttons grid -->
    <div class="sequenza-buttons" :style="{ '--cols': Math.ceil(buttonCount / 2) }">
      <button
        v-for="(emoji, idx) in buttons"
        :key="idx"
        class="sequenza-btn"
        :class="{
          'sequenza-btn--active': activeShowIndex === idx,
          'sequenza-btn--pressed': activeInputIndex === idx,
          'sequenza-btn--disabled': phase === 'showing',
        }"
        :disabled="phase !== 'input'"
        @click="handleButtonClick(idx)"
      >
        {{ emoji }}
      </button>
    </div>

    <!-- Win Overlay -->
    <div v-if="phase === 'win'" class="sequenza-overlay">
      <div class="sequenza-overlay-card">
        <div class="sequenza-overlay-emoji">🏆</div>
        <div class="sequenza-overlay-title">{{ $t('sequenza.win.' + recipientGender, { name: recipientName }) }}</div>
        <div class="sequenza-overlay-sub">{{ $t('sequenza.winSub') }}</div>
        <div class="sequenza-overlay-score">{{ $t('sequenza.winScore') }} {{ score }} ⭐</div>
      </div>
    </div>
  </div>
</template>
