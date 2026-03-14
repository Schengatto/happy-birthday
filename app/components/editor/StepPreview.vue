<script setup lang="ts">
import '~/assets/css/editor.css'
import { ref, computed } from 'vue'
import type { CardConfig, GameType } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

const props = defineProps<{
  config: CardConfig
}>()

const emit = defineEmits<{
  back: []
}>()

const isCreating = ref(false)
const cardUrl = ref('')
const cardPath = computed(() => {
  if (!cardUrl.value) return ''
  try {
    return new URL(cardUrl.value).pathname
  } catch {
    return cardUrl.value
  }
})
const copied = ref(false)

const GAME_EMOJIS: Record<GameType, string> = {
  missione: '🎯',
  coppie: '🎴',
  palloncini: '🎈',
  sequenza: '🧠',
  regalo: '🎁',
}

const THEME_COLORS = {
  pink: 'linear-gradient(135deg, #ffb6c1, #ff69b4)',
  dark: 'linear-gradient(135deg, #1a1a2e, #16213e)',
  pastel: 'linear-gradient(135deg, #fce4ec, #e8eaf6)',
} as const

async function createCard() {
  isCreating.value = true
  try {
    const { id } = await $fetch<{ id: string }>('/api/cards', {
      method: 'POST',
      body: props.config,
    })
    const base = window.location.origin
    cardUrl.value = `${base}/card/${id}`
  } catch (err) {
    console.error($t('preview.error'), err)
  } finally {
    isCreating.value = false
  }
}

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(cardUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback: select the text
  }
}
</script>

<template>
  <div>
    <h2 class="wizard-title">{{ $t('preview.title') }}</h2>
    <p class="wizard-subtitle">{{ $t('preview.subtitle') }}</p>

    <div class="preview-summary">
      <div class="preview-card">
        <span class="preview-card-icon">🎁</span>
        <div class="preview-card-content">
          <div class="preview-card-label">{{ $t('preview.recipient') }}</div>
          <div class="preview-card-value">{{ config.recipientName }}</div>
        </div>
      </div>

      <div class="preview-card">
        <span class="preview-card-icon">✍️</span>
        <div class="preview-card-content">
          <div class="preview-card-label">{{ $t('preview.from') }}</div>
          <div class="preview-card-value">{{ config.senderName }}</div>
        </div>
      </div>

      <div class="preview-card">
        <span class="preview-card-icon">💌</span>
        <div class="preview-card-content">
          <div class="preview-card-label">{{ $t('preview.message') }}</div>
          <div class="preview-card-value">{{ config.message }}</div>
        </div>
      </div>

      <div class="preview-card">
        <span class="preview-card-icon">🎮</span>
        <div class="preview-card-content">
          <div class="preview-card-label">{{ $t('preview.gamesLabel') }}</div>
          <div class="preview-games-list">
            <span
              v-for="game in config.games"
              :key="game.type"
              class="preview-game-tag"
            >
              {{ GAME_EMOJIS[game.type] }} {{ $t('preview.game.' + game.type) }}
            </span>
          </div>
        </div>
      </div>

      <div class="preview-card">
        <span class="preview-card-icon">🎨</span>
        <div class="preview-card-content">
          <div class="preview-card-label">{{ $t('preview.themeLabel') }}</div>
          <div class="preview-card-value">
            <span
              class="preview-theme-dot"
              :style="{ background: THEME_COLORS[config.theme] }"
            />
            {{ $t('theme.' + config.theme) }}
          </div>
        </div>
      </div>
    </div>

    <template v-if="!cardUrl">
      <div class="wizard-nav">
        <button class="btn btn-secondary" @click="emit('back')">
          {{ $t('wizard.back') }}
        </button>
        <button
          class="btn btn-primary"
          :disabled="isCreating"
          @click="createCard"
        >
          {{ isCreating ? $t('preview.creating') : $t('preview.create') }}
        </button>
      </div>
    </template>

    <template v-else>
      <p class="preview-success">
        {{ $t('preview.created') }}
      </p>

      <div class="preview-url-box">
        <span class="preview-url-text">{{ cardUrl }}</span>
        <button class="btn btn-primary btn-copy" @click="copyUrl">
          {{ copied ? $t('preview.copied') : $t('preview.copy') }}
        </button>
      </div>

      <div style="text-align: center; margin-top: 1rem;">
        <NuxtLink :to="cardPath" class="btn btn-primary preview-open-link">
          {{ $t('preview.open') }}
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
