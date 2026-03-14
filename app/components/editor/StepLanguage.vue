<script setup lang="ts">
import '~/assets/css/editor.css'
import type { CardLocale } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const props = defineProps<{
  selectedLocale: CardLocale
}>()

const emit = defineEmits<{
  'update:selectedLocale': [value: CardLocale]
}>()

const { $t } = useLocale()

const options: { id: CardLocale; flag: string; labelKey: string }[] = [
  { id: 'it', flag: '🇮🇹', labelKey: 'lang.it' },
  { id: 'en', flag: '🇬🇧', labelKey: 'lang.en' },
]
</script>

<template>
  <div>
    <h2 class="wizard-title">{{ $t('lang.title') }}</h2>
    <p class="wizard-subtitle">{{ $t('lang.subtitle') }}</p>

    <div class="lang-picker-grid">
      <div
        v-for="opt in options"
        :key="opt.id"
        class="lang-pick-card"
        :class="{ selected: selectedLocale === opt.id }"
        @click="emit('update:selectedLocale', opt.id)"
      >
        <span class="lang-pick-flag">{{ opt.flag }}</span>
        <span class="lang-pick-label">{{ $t(opt.labelKey) }}</span>
      </div>
    </div>
  </div>
</template>
