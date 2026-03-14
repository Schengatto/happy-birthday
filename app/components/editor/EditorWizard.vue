<script setup lang="ts">
import '~/assets/css/editor.css'
import { ref, computed } from 'vue'
import type { CardConfig, GameType, CardTheme, RecipientGender, CardLocale } from '../../../types/card'
import { provideLocale } from '~/composables/useLocale'
import { t } from '~/utils/i18n'

const step = ref(0)
const totalSteps = 6

const locale = ref<CardLocale>('it')
provideLocale(locale)

const cardUrl = ref('')

const stepLabels = computed(() => [
  t(locale.value, 'wizard.step.language'),
  t(locale.value, 'wizard.step.details'),
  t(locale.value, 'wizard.step.games'),
  t(locale.value, 'wizard.step.theme'),
  t(locale.value, 'wizard.step.preview'),
  t(locale.value, 'wizard.step.share'),
])

const recipientName = ref('')
const recipientGender = ref<RecipientGender>('M')
const senderName = ref('')
const message = ref('')
const selectedGames = ref<GameType[]>([])
const selectedTheme = ref<CardTheme>('pink')

const config = computed<CardConfig>(() => ({
  v: 1,
  locale: locale.value,
  recipientName: recipientName.value,
  recipientGender: recipientGender.value,
  senderName: senderName.value,
  message: message.value,
  games: selectedGames.value.map(type => ({ type })),
  theme: selectedTheme.value,
}))

const canNext = computed(() => {
  switch (step.value) {
    case 0: return true
    case 1: return recipientName.value.trim() && senderName.value.trim() && message.value.trim()
    case 2: return selectedGames.value.length > 0
    case 3: return true
    case 4: return true
    default: return false
  }
})

function next() {
  if (canNext.value && step.value < totalSteps - 1) {
    step.value++
  }
}

function prev() {
  if (step.value > 0) {
    step.value--
  }
}
</script>

<template>
  <div class="wizard">
    <div class="wizard-stepper">
      <template v-for="(label, i) in stepLabels" :key="i">
        <div
          class="wizard-step-item"
          :class="{
            active: step === i,
            done: step > i,
            clickable: step > i && step < 5,
          }"
          @click="step > i && step < 5 && (step = i)"
        >
          <div class="wizard-step-circle">
            <span v-if="step > i">&#10003;</span>
            <span v-else>{{ i + 1 }}</span>
            <span class="wizard-step-label">{{ label }}</span>
          </div>
        </div>
        <div
          v-if="i < stepLabels.length - 1"
          class="wizard-step-line"
          :class="{ done: step > i }"
          style=""
        />
      </template>
    </div>

    <div :key="step" class="wizard-step-content">
      <StepLanguage
        v-if="step === 0"
        v-model:selected-locale="locale"
      />

      <StepRecipient
        v-if="step === 1"
        v-model:recipient-name="recipientName"
        v-model:recipient-gender="recipientGender"
        v-model:sender-name="senderName"
        v-model:message="message"
      />

      <StepGamePicker
        v-if="step === 2"
        v-model:selected-games="selectedGames"
      />

      <StepTheme
        v-if="step === 3"
        v-model:selected-theme="selectedTheme"
      />

      <StepPreview
        v-if="step === 4"
        :config="config"
        @back="prev"
        @created="(url: string) => { cardUrl = url; step = 5 }"
      />

      <StepShare
        v-if="step === 5"
        :card-url="cardUrl"
      />
    </div>

    <div v-if="step < 4" class="wizard-nav">
      <button
        v-if="step > 0"
        class="btn btn-secondary"
        @click="prev"
      >
        {{ t(locale, 'wizard.back') }}
      </button>
      <div v-else />
      <button
        class="btn btn-primary"
        :disabled="!canNext"
        @click="next"
      >
        {{ t(locale, 'wizard.next') }}
      </button>
    </div>
  </div>
</template>
