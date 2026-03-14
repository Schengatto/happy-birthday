<script setup lang="ts">
import '~/assets/css/viewer.css'
import { ref, onMounted } from 'vue'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

const props = defineProps<{
  recipientName: string
}>()

const emit = defineEmits<{
  open: []
}>()

const opened = ref(false)
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

function handleOpen() {
  if (opened.value) return
  opened.value = true
  setTimeout(() => emit('open'), 600)
}
</script>

<template>
  <div class="envelope" :class="{ 'envelope-open': opened, 'envelope-ready': mounted }" @click="handleOpen">
    <div class="envelope-icon">💌</div>
    <div class="envelope-text">
      {{ $t('envelope.text', { name: recipientName }) }}
    </div>
    <div v-if="!opened" class="envelope-hint">{{ $t('envelope.hint') }}</div>
  </div>
</template>
