<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudio } from '~/composables/useAudio'
import { ALCHIMIA_STEPS } from '~/utils/emoji-sets'
import { shuffle } from '~/utils/shuffle'
import '~/assets/css/game-alchimia.css'

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

const currentStep = ref(0)
const score = ref(0)
const won = ref(false)
const feedback = ref('')
const feedbackType = ref<'success' | 'error'>('success')
const shakeWrongId = ref<string | null>(null)
const flyingEmoji = ref('')
const showFlyAnimation = ref(false)
const transitioning = ref(false)

// Collected ingredients shown in the bowl area
const collected = ref<{ emoji: string; resultEmoji: string }[]>([])

// Shuffled choices for current step
const choices = ref<{ id: string; emoji: string; correct: boolean }[]>([])

let feedbackTimeout: ReturnType<typeof setTimeout> | null = null
let shakeTimeout: ReturnType<typeof setTimeout> | null = null

const totalSteps = ALCHIMIA_STEPS.length

const step = computed(() => ALCHIMIA_STEPS[currentStep.value])

const bowlEmoji = computed(() => {
  if (collected.value.length === 0) return '👩🏻‍🍳'
  return collected.value[collected.value.length - 1]!.resultEmoji
})

function buildChoices() {
  const s = step.value
  if (!s) return
  const all = [
    { id: s.correctId, emoji: s.correctEmoji, correct: true },
    ...s.distractors.map(d => ({ id: d.id, emoji: d.emoji, correct: false })),
  ]
  choices.value = shuffle(all)
}

function showFeedbackMsg(msg: string, type: 'success' | 'error') {
  feedback.value = msg
  feedbackType.value = type
  if (feedbackTimeout) clearTimeout(feedbackTimeout)
  feedbackTimeout = setTimeout(() => { feedback.value = '' }, 1200)
}

function handleChoice(choice: { id: string; emoji: string; correct: boolean }) {
  if (won.value || transitioning.value) return

  if (choice.correct) {
    const s = step.value!
    score.value += 15
    playSuccess()

    // Fly animation
    flyingEmoji.value = choice.emoji
    showFlyAnimation.value = true
    transitioning.value = true

    setTimeout(() => {
      showFlyAnimation.value = false
      collected.value.push({ emoji: choice.emoji, resultEmoji: s.resultEmoji })
      showFeedbackMsg($t('alchimia.discovered', { name: $t('alchimia.el.' + s.resultId) }), 'success')

      const nextStep = currentStep.value + 1
      emit('progress', Math.round((nextStep / totalSteps) * 100))

      if (nextStep >= totalSteps) {
        won.value = true
        playVictory()
        setTimeout(() => {
          emit('complete', score.value)
        }, 3000)
      } else {
        playLevelUp()
        setTimeout(() => {
          currentStep.value = nextStep
          buildChoices()
          transitioning.value = false
        }, 600)
      }
    }, 500)
  } else {
    playError()
    shakeWrongId.value = choice.id
    showFeedbackMsg($t('alchimia.noRecipe'), 'error')
    if (shakeTimeout) clearTimeout(shakeTimeout)
    shakeTimeout = setTimeout(() => { shakeWrongId.value = null }, 500)
  }
}

onMounted(() => {
  buildChoices()
  emit('progress', 0)
})

onUnmounted(() => {
  if (feedbackTimeout) clearTimeout(feedbackTimeout)
  if (shakeTimeout) clearTimeout(shakeTimeout)
})
</script>

<template>
  <div class="alchimia-game">
    <!-- Step indicator -->
    <div class="alchimia-steps">
      <span
        v-for="(s, i) in ALCHIMIA_STEPS"
        :key="s.id"
        class="alchimia-step-dot"
        :class="{
          active: i === currentStep,
          done: i < currentStep || won,
        }"
      >
        {{ s.resultEmoji }}
      </span>
    </div>

    <!-- HUD -->
    <div class="alchimia-hud">
      <span class="alchimia-hud-progress">
        {{ $t('alchimia.progress', { current: currentStep + (won ? 1 : 0), total: totalSteps }) }}
      </span>
      <span class="alchimia-hud-score">⚗️ {{ score }}</span>
    </div>

    <!-- Bowl / workbench -->
    <div class="alchimia-bowl">
      <div class="alchimia-bowl-collected">
        <span
          v-for="(item, i) in collected"
          :key="i"
          class="alchimia-bowl-item"
        >{{ item.emoji }}</span>
      </div>
      <div class="alchimia-bowl-emoji">{{ bowlEmoji }}</div>
      <!-- Flying emoji animation -->
      <span v-if="showFlyAnimation" class="alchimia-flying" :key="currentStep + '-fly'">
        {{ flyingEmoji }}
      </span>
    </div>

    <!-- Instruction -->
    <div v-if="!won" class="alchimia-instruction">
      {{ $t('alchimia.stepInstruction', { name: recipientName, ingredient: step ? $t('alchimia.el.' + step.correctId) : '' }) }}
    </div>

    <!-- Feedback -->
    <div
      v-if="feedback"
      class="alchimia-feedback"
      :class="'alchimia-feedback--' + feedbackType"
    >
      {{ feedback }}
    </div>

    <!-- Choices -->
    <div v-if="!won" class="alchimia-choices">
      <div
        v-for="choice in choices"
        :key="choice.id"
        class="alchimia-choice"
        :class="{
          'alchimia-choice--shake': shakeWrongId === choice.id,
        }"
        @click="handleChoice(choice)"
      >
        <span class="alchimia-choice-emoji">{{ choice.emoji }}</span>
      </div>
    </div>

    <!-- Win Overlay -->
    <div v-if="won" class="alchimia-overlay">
      <div class="alchimia-overlay-card">
        <div class="alchimia-overlay-emoji">🥳</div>
        <div class="alchimia-overlay-title">{{ $t('alchimia.win.' + recipientGender, { name: recipientName }) }}</div>
        <div class="alchimia-overlay-sub">{{ $t('alchimia.winSub') }}</div>
        <div class="alchimia-overlay-score">{{ $t('alchimia.winScore') }} {{ score }} ⚗️</div>
      </div>
    </div>
  </div>
</template>
