<script setup lang="ts">
import '~/assets/css/editor.css'
import { ref } from 'vue'
import type { CardConfig, GameType } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

const props = defineProps<{
  config: CardConfig
}>()

const emit = defineEmits<{
  back: []
  created: [url: string]
}>()

const isCreating = ref(false)

const GAME_EMOJIS: Record<GameType, string> = {
  missione: '🎯',
  coppie: '🎴',
  palloncini: '🎈',
  sequenza: '🧠',
  regalo: '🎁',
  torta: '🎂',
  artiglio: '🏗️',
  bolle: '🫧',
  dolcetti: '🍬',
  alchimia: '⚗️',
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
    emit('created', `${base}/card/${id}`)
  } catch (err) {
    console.error($t('preview.error'), err)
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <div>
    <h2 class="wizard-title">{{ $t('preview.title') }}</h2>
    <p class="wizard-subtitle">{{ $t('preview.subtitle') }}</p>

    <ul class="preview-list">
      <li class="preview-list-item">
        <span class="preview-list-label">{{ $t('preview.recipient') }}</span>
        <span class="preview-list-value">{{ config.recipientName }}</span>
      </li>
      <li class="preview-list-item">
        <span class="preview-list-label">{{ $t('preview.from') }}</span>
        <span class="preview-list-value">{{ config.senderName }}</span>
      </li>
      <li class="preview-list-item">
        <span class="preview-list-label">{{ $t('preview.message') }}</span>
        <span class="preview-list-value">{{ config.message }}</span>
      </li>
      <li class="preview-list-item">
        <span class="preview-list-label">{{ $t('preview.gamesLabel') }}</span>
        <span class="preview-list-value">
          <span
            v-for="(game, idx) in config.games"
            :key="game.type"
          >{{ idx > 0 ? ', ' : '' }}{{ GAME_EMOJIS[game.type] }} {{ $t('preview.game.' + game.type) }}</span>
        </span>
      </li>
      <li class="preview-list-item">
        <span class="preview-list-label">{{ $t('preview.themeLabel') }}</span>
        <span class="preview-list-value">
          <span
            class="preview-list-theme-dot"
            :style="{ background: THEME_COLORS[config.theme] }"
          />
          {{ $t('theme.' + config.theme) }}
        </span>
      </li>
    </ul>

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
  </div>
</template>
