<script setup lang="ts">
import type { CardConfig } from '../../../types/card'
import { t } from '~/utils/i18n'

definePageMeta({
  layout: 'card',
})

const route = useRoute()
const cardId = route.params.id as string

const { data: config, error } = await useFetch<CardConfig>(`/api/cards/${cardId}`)

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Card not found',
  })
}

const locale = config.value?.locale ?? 'it'

useHead({
  title: config.value ? t(locale, 'page.card.title', { name: config.value.recipientName }) : t(locale, 'page.card.fallbackTitle'),
  meta: [
    { name: 'description', content: config.value ? t(locale, 'page.card.description', { name: config.value.recipientName }) : '' },
    { property: 'og:title', content: config.value ? t(locale, 'page.card.title', { name: config.value.recipientName }) : '' },
    { property: 'og:description', content: config.value ? t(locale, 'page.card.ogDescription', { sender: config.value.senderName }) : '' },
  ],
})
</script>

<template>
  <CardViewer v-if="config" :config="config" />
</template>
