<script setup lang="ts">
import '~/assets/css/editor.css'
import { ref } from 'vue'
import type { GameType } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

const props = defineProps<{
  selectedGames: GameType[]
}>()

const emit = defineEmits<{
  'update:selectedGames': [value: GameType[]]
}>()

interface GameOption {
  type: GameType
  emoji: string
  nameKey: string
  descKey: string
}

const gameOptions: GameOption[] = [
  { type: 'missione', emoji: '🎯', nameKey: 'games.missione.name', descKey: 'games.missione.desc' },
  { type: 'coppie', emoji: '🍽️', nameKey: 'games.coppie.name', descKey: 'games.coppie.desc' },
  { type: 'palloncini', emoji: '🎀', nameKey: 'games.palloncini.name', descKey: 'games.palloncini.desc' },
  { type: 'sequenza', emoji: '🧠', nameKey: 'games.sequenza.name', descKey: 'games.sequenza.desc' },
  { type: 'regalo', emoji: '🎁', nameKey: 'games.regalo.name', descKey: 'games.regalo.desc' },
  { type: 'torta', emoji: '🎂', nameKey: 'games.torta.name', descKey: 'games.torta.desc' },
  { type: 'artiglio', emoji: '🏗️', nameKey: 'games.artiglio.name', descKey: 'games.artiglio.desc' },
  { type: 'bolle', emoji: '🫧', nameKey: 'games.bolle.name', descKey: 'games.bolle.desc' },
  { type: 'dolcetti', emoji: '🍬', nameKey: 'games.dolcetti.name', descKey: 'games.dolcetti.desc' },
  { type: 'alchimia', emoji: '⚗️', nameKey: 'games.alchimia.name', descKey: 'games.alchimia.desc' },
]

const tryingGame = ref<GameType | null>(null)

function toggleGame(type: GameType) {
  const current = [...props.selectedGames]
  const idx = current.indexOf(type)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else if (current.length < 5) {
    current.push(type)
  }
  emit('update:selectedGames', current)
}

function isSelected(type: GameType) {
  return props.selectedGames.includes(type)
}

function tryGame(type: GameType, event: Event) {
  event.stopPropagation()
  tryingGame.value = type
}

function closeTryGame() {
  tryingGame.value = null
}

function onTryGameComplete() {
  tryingGame.value = null
}
</script>

<template>
  <div>
    <h2 class="wizard-title">{{ $t('games.title') }}</h2>
    <p class="wizard-subtitle">{{ $t('games.subtitle') }}</p>

    <div class="game-picker-grid">
      <div
        v-for="game in gameOptions"
        :key="game.type"
        class="game-pick-card"
        :class="{ selected: isSelected(game.type), disabled: !isSelected(game.type) && selectedGames.length >= 5 }"
        @click="toggleGame(game.type)"
      >
        <span class="game-pick-emoji">{{ game.emoji }}</span>
        <div class="game-pick-info">
          <div class="game-pick-name">{{ $t(game.nameKey) }}</div>
          <div class="game-pick-desc">{{ $t(game.descKey) }}</div>
        </div>
        <button
          class="game-pick-try"
          @click="tryGame(game.type, $event)"
          :title="$t('games.tryTitle')"
        >
          {{ $t('games.try') }}
        </button>
        <div class="game-pick-check">
          <span v-if="isSelected(game.type)">&#10003;</span>
        </div>
      </div>
    </div>

    <p v-if="selectedGames.length === 0" class="game-picker-hint">
      {{ $t('games.hint') }}
    </p>

    <!-- Game Try Overlay (no Transition — games have timers that must stop immediately on unmount) -->
    <Teleport to="body">
      <div v-if="tryingGame" :key="tryingGame" class="game-try-overlay">
        <div class="game-try-container">
          <button class="game-try-close" @click="closeTryGame">&#10005;</button>
          <GameMissione
            v-if="tryingGame === 'missione'"
            recipient-name="Anteprima"
            recipient-gender="M"
            @complete="onTryGameComplete"
          />
          <GameCoppie
            v-if="tryingGame === 'coppie'"
            recipient-name="Anteprima"
            recipient-gender="M"
            @complete="onTryGameComplete"
          />
          <GamePalloncini
            v-if="tryingGame === 'palloncini'"
            recipient-name="Anteprima"
            recipient-gender="M"
            @complete="onTryGameComplete"
          />
          <GameSequenza
            v-if="tryingGame === 'sequenza'"
            recipient-name="Anteprima"
            recipient-gender="M"
            @complete="onTryGameComplete"
          />
          <GameRegalo
            v-if="tryingGame === 'regalo'"
            recipient-name="Anteprima"
            recipient-gender="M"
            @complete="onTryGameComplete"
          />
          <GameTorta
            v-if="tryingGame === 'torta'"
            recipient-name="Anteprima"
            recipient-gender="M"
            @complete="onTryGameComplete"
          />
          <GameArtiglio
            v-if="tryingGame === 'artiglio'"
            recipient-name="Anteprima"
            recipient-gender="M"
            @complete="onTryGameComplete"
          />
          <GameBolle
            v-if="tryingGame === 'bolle'"
            recipient-name="Anteprima"
            recipient-gender="M"
            @complete="onTryGameComplete"
          />
          <GameDolcetti
            v-if="tryingGame === 'dolcetti'"
            recipient-name="Anteprima"
            recipient-gender="M"
            @complete="onTryGameComplete"
          />
          <GameAlchimia
            v-if="tryingGame === 'alchimia'"
            recipient-name="Anteprima"
            recipient-gender="M"
            @complete="onTryGameComplete"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>
