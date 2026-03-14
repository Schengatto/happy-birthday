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
  { id: 'cuoricini', labelKey: 'theme.cuoricini', colors: 'linear-gradient(135deg, #ffc1cc, #ff8fa3)' },
  { id: 'floreale', labelKey: 'theme.floreale', colors: 'linear-gradient(135deg, #f8c8dc, #d4a9e0, #a8d8ea)' },
  { id: 'festivo', labelKey: 'theme.festivo', colors: 'linear-gradient(135deg, #ffe082, #ffcc02, #ff8a65)' },
  { id: 'classic-light', labelKey: 'theme.classic-light', colors: 'linear-gradient(135deg, #f5f0e8, #e8dfd3)' },
  { id: 'classic-dark', labelKey: 'theme.classic-dark', colors: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
  { id: 'modern', labelKey: 'theme.modern', colors: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)' },
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
