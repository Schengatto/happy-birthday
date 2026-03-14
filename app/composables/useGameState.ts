import { ref, computed } from 'vue'
import type { GameType } from '../../types/card'

export function useGameState(gameTypes: GameType[]) {
  const completedGames = ref<Set<number>>(new Set())
  const currentGameIndex = ref(0)

  const totalGames = computed(() => gameTypes.length)
  const allCompleted = computed(() => completedGames.value.size === totalGames.value)
  const currentGameType = computed(() => gameTypes[currentGameIndex.value]!)

  function completeCurrentGame(score: number) {
    completedGames.value.add(currentGameIndex.value)
    // Force reactivity
    completedGames.value = new Set(completedGames.value)
  }

  function advanceToNext() {
    if (currentGameIndex.value < totalGames.value - 1) {
      currentGameIndex.value++
      return true
    }
    return false
  }

  function isGameDone(index: number) {
    return completedGames.value.has(index)
  }

  return {
    currentGameIndex,
    currentGameType,
    totalGames,
    allCompleted,
    completeCurrentGame,
    advanceToNext,
    isGameDone,
  }
}
