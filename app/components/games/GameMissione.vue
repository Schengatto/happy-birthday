<script setup lang="ts">
import { ref } from 'vue'
import { useAudio } from '~/composables/useAudio'
import {
  MISSIONE_L1_CORRECT,
  MISSIONE_L1_WRONG,
} from '~/utils/emoji-sets'
import { shuffle } from '~/utils/shuffle'
import '~/assets/css/game-missione.css'

import type { RecipientGender } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

/* ─── Props & Emits ─── */
const props = defineProps<{
  recipientName: string
  recipientGender: RecipientGender
  theme?: 'pink' | 'dark' | 'pastel'
}>()

const emit = defineEmits<{
  complete: [score: number]
  progress: [percent: number]
}>()

/* ─── Audio ─── */
const { playSuccess, playError, playLevelUp } = useAudio()

/* ═══════════════════════════════════════
   Find the birthday objects
   ═══════════════════════════════════════ */
interface L1Item {
  emoji: string
  correct: boolean
  found: boolean
  wrongFlash: boolean
  id: number
}

const l1Items = ref<L1Item[]>(buildLevel1Grid())
const l1FoundCount = ref(0)
const l1Msg = ref('')
const l1MsgType = ref<'success' | 'error' | ''>('')

function buildLevel1Grid(): L1Item[] {
  const correct = MISSIONE_L1_CORRECT.map((e) => ({ emoji: e, correct: true }))
  const wrong = MISSIONE_L1_WRONG.map((e) => ({ emoji: e, correct: false }))
  return shuffle([...correct, ...wrong]).map((item, i) => ({
    ...item,
    found: false,
    wrongFlash: false,
    id: i,
  }))
}

function l1Click(item: L1Item) {
  if (item.found) return

  if (item.correct) {
    item.found = true
    l1FoundCount.value++
    l1Msg.value = $t('missione.success')
    l1MsgType.value = 'success'
    playSuccess()
    emit('progress', Math.round((l1FoundCount.value / MISSIONE_L1_CORRECT.length) * 100))

    if (l1FoundCount.value >= MISSIONE_L1_CORRECT.length) {
      playLevelUp()
      setTimeout(() => {
        emit('progress', 100)
        emit('complete', l1FoundCount.value)
      }, 800)
    }
  } else {
    item.wrongFlash = true
    l1Msg.value = $t('missione.error')
    l1MsgType.value = 'error'
    playError()
    setTimeout(() => {
      item.wrongFlash = false
    }, 500)
  }
}
</script>

<template>
  <div class="missione-wrapper">
    <h2 class="missione-title">{{ $t('missione.title') }}</h2>
    <p class="missione-subtitle">
      {{ $t('missione.subtitle', { name: props.recipientName }) }}
    </p>

    <div class="missione-objects-grid">
      <button
        v-for="item in l1Items"
        :key="item.id"
        class="missione-emoji-obj"
        :class="{ found: item.found, 'wrong-flash': item.wrongFlash }"
        :style="{ animationDelay: item.id * 0.06 + 's' }"
        @click="l1Click(item)"
      >
        {{ item.emoji }}
      </button>
    </div>

    <p class="missione-msg" :class="l1MsgType">{{ l1Msg }}</p>
    <p class="missione-found-count">
      {{ $t('missione.found') }} {{ l1FoundCount }} / {{ MISSIONE_L1_CORRECT.length }}
    </p>
  </div>
</template>
