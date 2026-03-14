<script setup lang="ts">
import '~/assets/css/viewer.css'
import { ref, onMounted } from 'vue'
import type { CardConfig } from '../../../types/card'
import { useTheme } from '~/composables/useTheme'
import { provideLocale } from '~/composables/useLocale'

const props = defineProps<{
  config: CardConfig
}>()

type ViewerPhase = 'envelope' | 'message' | 'games' | 'finale'

const phase = ref<ViewerPhase>('envelope')
const { applyTheme } = useTheme()

const gameTypes = props.config.games.map(g => g.type)

// Provide locale to all viewer children (fallback to 'it' for old cards without locale)
const localeRef = ref(props.config.locale ?? 'it')
provideLocale(localeRef)

onMounted(() => {
  applyTheme(props.config.theme)
})

function onEnvelopeOpen() {
  phase.value = 'message'
}

function onMessageContinue() {
  if (gameTypes.length > 0) {
    phase.value = 'games'
  } else {
    phase.value = 'finale'
  }
}

function onAllGamesComplete() {
  phase.value = 'finale'
}
</script>

<template>
  <div>
    <CardEnvelope
      v-if="phase === 'envelope'"
      :recipient-name="config.recipientName"
      @open="onEnvelopeOpen"
    />

    <CardMessage
      v-if="phase === 'message'"
      :recipient-name="config.recipientName"
      :sender-name="config.senderName"
      :message="config.message"
      @continue="onMessageContinue"
    />

    <GameCarousel
      v-if="phase === 'games'"
      :games="gameTypes"
      :recipient-name="config.recipientName"
      :recipient-gender="config.recipientGender"
      :theme="config.theme"
      @all-complete="onAllGamesComplete"
    />

    <CardFinale
      v-if="phase === 'finale'"
      :recipient-name="config.recipientName"
      :recipient-gender="config.recipientGender"
    />
  </div>
</template>
