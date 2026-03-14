<script setup lang="ts">
import '~/assets/css/viewer.css'
import { computed } from 'vue'
import type { GameType, CardTheme, RecipientGender } from '../../../types/card'
import { useGameState } from '~/composables/useGameState'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

const props = defineProps<{
  games: GameType[]
  recipientName: string
  recipientGender: RecipientGender
  theme?: CardTheme
}>()

const emit = defineEmits<{
  allComplete: []
}>()

const { currentGameIndex, currentGameType, totalGames, allCompleted, completeCurrentGame, advanceToNext, isGameDone } = useGameState(props.games)

const currentTitle = computed(() => $t('carousel.' + currentGameType.value))

function onGameComplete(score: number) {
  completeCurrentGame(score)
  if (!advanceToNext()) {
    emit('allComplete')
  }
}
</script>

<template>
  <div class="game-carousel">
    <div class="game-carousel-header">
      <div class="game-carousel-dots">
        <span
          v-for="(game, i) in games"
          :key="i"
          class="game-carousel-dot"
          :class="{ active: i === currentGameIndex, done: isGameDone(i) }"
        />
      </div>
      <span class="game-carousel-label">
        {{ currentTitle }}
      </span>
    </div>

    <div class="game-carousel-body">
      <GameMissione
        v-if="currentGameType === 'missione'"
        :recipient-name="recipientName"
        :recipient-gender="recipientGender"
        :theme="theme"
        @complete="onGameComplete"
      />
      <GameCoppie
        v-if="currentGameType === 'coppie'"
        :recipient-name="recipientName"
        :recipient-gender="recipientGender"
        :theme="theme"
        @complete="onGameComplete"
      />
      <GamePalloncini
        v-if="currentGameType === 'palloncini'"
        :recipient-name="recipientName"
        :recipient-gender="recipientGender"
        :theme="theme"
        @complete="onGameComplete"
      />
      <GameSequenza
        v-if="currentGameType === 'sequenza'"
        :recipient-name="recipientName"
        :recipient-gender="recipientGender"
        :theme="theme"
        @complete="onGameComplete"
      />
      <GameRegalo
        v-if="currentGameType === 'regalo'"
        :recipient-name="recipientName"
        :recipient-gender="recipientGender"
        :theme="theme"
        @complete="onGameComplete"
      />
      <GameTorta
        v-if="currentGameType === 'torta'"
        :recipient-name="recipientName"
        :recipient-gender="recipientGender"
        :theme="theme"
        @complete="onGameComplete"
      />
      <GameArtiglio
        v-if="currentGameType === 'artiglio'"
        :recipient-name="recipientName"
        :recipient-gender="recipientGender"
        :theme="theme"
        @complete="onGameComplete"
      />
      <GameBolle
        v-if="currentGameType === 'bolle'"
        :recipient-name="recipientName"
        :recipient-gender="recipientGender"
        :theme="theme"
        @complete="onGameComplete"
      />
      <GameDolcetti
        v-if="currentGameType === 'dolcetti'"
        :recipient-name="recipientName"
        :recipient-gender="recipientGender"
        :theme="theme"
        @complete="onGameComplete"
      />
      <GameAlchimia
        v-if="currentGameType === 'alchimia'"
        :recipient-name="recipientName"
        :recipient-gender="recipientGender"
        :theme="theme"
        @complete="onGameComplete"
      />
    </div>
  </div>
</template>
