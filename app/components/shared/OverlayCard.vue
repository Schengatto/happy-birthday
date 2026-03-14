<script setup lang="ts">
defineProps<{
  show: boolean
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="show" class="overlay-backdrop">
        <div class="overlay-card">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
