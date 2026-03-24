<script setup lang="ts">
import '~/assets/css/viewer.css'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

defineProps<{
  recipientName: string
  senderName: string
  message: string
}>()

const emit = defineEmits<{
  continue: []
}>()
</script>

<template>
  <div class="card-message">
    <div class="card-message-card">
      <div class="card-message-deco">&#10045; &#10045; &#10045;</div>
      <div class="card-message-name">{{ recipientName }}</div>
      <div class="card-message-greeting">{{ $t('message.greeting') }}</div>
      <hr class="card-message-divider" />
      <div class="card-message-text">{{ message }}</div>
      <div class="card-message-sender">{{ $t('message.sender', { name: senderName }) }}</div>
    </div>
    <div class="card-message-continue">
      <button class="btn btn-primary" @click="$emit('continue')">
        {{ $t('message.continue') }}
      </button>
    </div>
  </div>
</template>
