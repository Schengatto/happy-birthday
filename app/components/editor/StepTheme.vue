<script setup lang="ts">
import '~/assets/css/editor.css'
import type { CardTheme } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

const props = defineProps<{
  selectedTheme: CardTheme
}>()

const emit = defineEmits<{
  'update:selectedTheme': [value: CardTheme]
}>()

interface ThemeOption {
  id: CardTheme
  labelKey: string
  colors: string
}

const themes: ThemeOption[] = [
  { id: 'pink', labelKey: 'theme.pink', colors: 'linear-gradient(135deg, #ffb6c1, #ff69b4)' },
  { id: 'dark', labelKey: 'theme.dark', colors: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
  { id: 'pastel', labelKey: 'theme.pastel', colors: 'linear-gradient(135deg, #fce4ec, #e8eaf6)' },
]
</script>

<template>
  <div>
    <h2 class="wizard-title">{{ $t('theme.title') }}</h2>
    <p class="wizard-subtitle">{{ $t('theme.subtitle') }}</p>

    <div class="theme-picker-grid">
      <div
        v-for="theme in themes"
        :key="theme.id"
        class="theme-pick-card"
        :class="{ selected: selectedTheme === theme.id }"
        @click="emit('update:selectedTheme', theme.id)"
      >
        <div class="theme-swatch" :style="{ background: theme.colors }" />
        <div class="theme-pick-label">{{ $t(theme.labelKey) }}</div>
      </div>
    </div>
  </div>
</template>
