<script setup lang="ts">
import '~/assets/css/editor.css'

import type { RecipientGender } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

const props = defineProps<{
  recipientName: string
  recipientGender: RecipientGender
  senderName: string
  message: string
}>()

const emit = defineEmits<{
  'update:recipientName': [value: string]
  'update:recipientGender': [value: RecipientGender]
  'update:senderName': [value: string]
  'update:message': [value: string]
}>()
</script>

<template>
  <div>
    <h2 class="wizard-title">{{ $t('recipient.title') }}</h2>
    <p class="wizard-subtitle">{{ $t('recipient.subtitle') }}</p>

    <div class="field">
      <label class="field-label">{{ $t('recipient.nameLabel') }}</label>
      <input
        class="field-input"
        type="text"
        :placeholder="$t('recipient.namePlaceholder')"
        maxlength="50"
        :value="recipientName"
        @input="emit('update:recipientName', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="field">
      <label class="field-label">{{ $t('recipient.genderLabel') }}</label>
      <div class="field-toggle-group">
        <button
          type="button"
          class="field-toggle-btn"
          :class="{ active: recipientGender === 'M' }"
          @click="emit('update:recipientGender', 'M')"
        >
          {{ $t('recipient.male') }}
        </button>
        <button
          type="button"
          class="field-toggle-btn"
          :class="{ active: recipientGender === 'F' }"
          @click="emit('update:recipientGender', 'F')"
        >
          {{ $t('recipient.female') }}
        </button>
      </div>
    </div>

    <div class="field">
      <label class="field-label">{{ $t('recipient.senderLabel') }}</label>
      <input
        class="field-input"
        type="text"
        :placeholder="$t('recipient.senderPlaceholder')"
        maxlength="50"
        :value="senderName"
        @input="emit('update:senderName', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="field">
      <label class="field-label">{{ $t('recipient.messageLabel') }}</label>
      <textarea
        class="field-input field-textarea"
        :placeholder="$t('recipient.messagePlaceholder')"
        maxlength="300"
        :value="message"
        @input="emit('update:message', ($event.target as HTMLTextAreaElement).value)"
      />
      <span class="field-hint">{{ message.length }}/300 {{ $t('recipient.charCount') }}</span>
    </div>
  </div>
</template>
