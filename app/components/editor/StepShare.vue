<script setup lang="ts">
import '~/assets/css/editor.css'
import { ref, computed } from 'vue'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

const props = defineProps<{
  cardUrl: string
}>()

const copied = ref(false)

const cardPath = computed(() => {
  try {
    return new URL(props.cardUrl).pathname
  } catch {
    return props.cardUrl
  }
})

const canShare = computed(() => typeof navigator !== 'undefined' && !!navigator.share)

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(props.cardUrl)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback: noop
  }
}

async function shareCard() {
  try {
    await navigator.share({
      title: $t('share.shareTitle'),
      url: props.cardUrl,
    })
  } catch {
    // user cancelled or not supported
  }
}
</script>

<template>
  <div class="share-step">
    <div class="share-icon">🎉</div>
    <h2 class="wizard-title">{{ $t('share.title') }}</h2>
    <p class="wizard-subtitle">{{ $t('share.subtitle') }}</p>

    <div class="preview-url-box">
      <span class="preview-url-text">{{ cardUrl }}</span>
      <button class="btn btn-primary btn-copy" @click="copyUrl">
        {{ copied ? $t('preview.copied') : $t('preview.copy') }}
      </button>
    </div>

    <div class="share-actions">
      <button
        v-if="canShare"
        class="btn btn-primary share-btn"
        @click="shareCard"
      >
        {{ $t('share.share') }}
      </button>

      <NuxtLink :to="cardPath" class="btn btn-secondary share-btn">
        {{ $t('preview.open') }}
      </NuxtLink>
    </div>
  </div>
</template>
