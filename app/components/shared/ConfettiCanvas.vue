<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConfetti } from '~/composables/useConfetti'

const canvasRef = ref<HTMLCanvasElement>()
const { init, burst } = useConfetti()

onMounted(() => {
  if (canvasRef.value) init(canvasRef.value)
})

defineExpose({ burst })
</script>

<template>
  <canvas ref="canvasRef" class="confetti-canvas" />
</template>
