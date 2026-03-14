<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}>()
</script>

<template>
  <button
    class="btn"
    :class="[`btn-${variant || 'primary'}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
