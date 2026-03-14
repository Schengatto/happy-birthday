<script setup lang="ts">
import '~/assets/css/viewer.css'

defineProps<{
  title: string
  gameIndex: number
  totalGames: number
}>()
</script>

<template>
  <div class="game-wrapper">
    <div class="game-wrapper-title">{{ title }}</div>
    <div class="game-wrapper-body">
      <slot />
    </div>
  </div>
</template>
