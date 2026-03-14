<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudio } from '~/composables/useAudio'
import {
  MISSIONE_DECORAZIONI,
  MISSIONE_TAVOLO,
} from '~/utils/emoji-sets'
import '~/assets/css/game-missione.css'

import type { RecipientGender } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

/* ─── Props & Emits ─── */
const props = defineProps<{
  recipientName: string
  recipientGender: RecipientGender
  theme?: 'cuoricini' | 'floreale' | 'festivo' | 'classic-light' | 'classic-dark' | 'modern'
}>()

const emit = defineEmits<{
  complete: [score: number]
  progress: [percent: number]
}>()

/* ─── Audio ─── */
const { playSuccess, playError, playLevelUp } = useAudio()

/* ─── Game State ─── */
type Phase = 'decora' | 'tavolo'

const phase = ref<Phase>('decora')
const score = ref(0)

/* ─── Phase 1: Decora la sala ─── */
interface DecoSlot {
  id: number
  emoji: string  // the expected decoration
  placed: boolean
  label: string
}

interface DragItem {
  id: number
  emoji: string
  label: string
  used: boolean
}

const decoSlots = ref<DecoSlot[]>(
  MISSIONE_DECORAZIONI.map((d, i) => ({
    id: i,
    emoji: d.emoji,
    placed: false,
    label: $t('missione.slot.' + d.name),
  }))
)

const decoTray = ref<DragItem[]>(
  [...MISSIONE_DECORAZIONI]
    .sort(() => Math.random() - 0.5)
    .map((d, i) => ({
      id: i,
      emoji: d.emoji,
      label: $t('missione.slot.' + d.name),
      used: false,
    }))
)

const decoPlacedCount = computed(() => decoSlots.value.filter((s) => s.placed).length)
const decoTotal = computed(() => decoSlots.value.length)

/* ─── Phase 2: Prepara il tavolo ─── */
interface TableSlot {
  id: number
  emoji: string
  placed: boolean
  label: string
}

const tableSlots = ref<TableSlot[]>(
  MISSIONE_TAVOLO.map((d, i) => ({
    id: i,
    emoji: d.emoji,
    placed: false,
    label: $t('missione.slot.' + d.name),
  }))
)

const tableTray = ref<DragItem[]>(
  [...MISSIONE_TAVOLO]
    .sort(() => Math.random() - 0.5)
    .map((d, i) => ({
      id: i,
      emoji: d.emoji,
      label: $t('missione.slot.' + d.name),
      used: false,
    }))
)

const tablePlacedCount = computed(() => tableSlots.value.filter((s) => s.placed).length)
const tableTotal = computed(() => tableSlots.value.length)

/* ─── Drag & Drop State ─── */
const dragging = ref<DragItem | null>(null)
const ghostX = ref(0)
const ghostY = ref(0)
const ghostVisible = ref(false)
const highlightSlot = ref<number | null>(null)
const feedbackMsg = ref('')
const feedbackType = ref<'success' | 'error' | ''>('')

let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function showFeedback(msg: string, type: 'success' | 'error') {
  feedbackMsg.value = msg
  feedbackType.value = type
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => {
    feedbackMsg.value = ''
    feedbackType.value = ''
  }, 1500)
}

/* ─── Pointer Handlers ─── */
function onTrayPointerDown(item: DragItem, e: PointerEvent) {
  if (item.used) return
  e.preventDefault()
  dragging.value = item
  ghostX.value = e.clientX
  ghostY.value = e.clientY
  ghostVisible.value = true
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  e.preventDefault()
  ghostX.value = e.clientX
  ghostY.value = e.clientY

  // Check if over any slot
  const slots = phase.value === 'decora' ? decoSlots.value : tableSlots.value
  const slotEls = document.querySelectorAll('.missione-drop-slot:not(.placed)')
  highlightSlot.value = null
  slotEls.forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      const slotId = parseInt(el.getAttribute('data-slot-id') || '-1')
      highlightSlot.value = slotId
    }
  })
}

function onPointerUp(_e: PointerEvent) {
  if (!dragging.value) return

  const item = dragging.value
  const targetSlotId = highlightSlot.value

  if (targetSlotId !== null) {
    const slots = phase.value === 'decora' ? decoSlots.value : tableSlots.value
    const slot = slots.find((s) => s.id === targetSlotId)

    if (slot && !slot.placed) {
      if (slot.emoji === item.emoji) {
        // Correct placement
        slot.placed = true
        item.used = true
        score.value++
        playSuccess()
        showFeedback($t('missione.placed'), 'success')
        updateProgress()

        // Check phase completion
        if (phase.value === 'decora' && decoPlacedCount.value >= decoTotal.value) {
          setTimeout(() => transitionToTavolo(), 800)
        } else if (phase.value === 'tavolo' && tablePlacedCount.value >= tableTotal.value) {
          playLevelUp()
          setTimeout(() => {
            emit('progress', 100)
            emit('complete', score.value)
          }, 800)
        }
      } else {
        // Wrong slot
        playError()
        showFeedback($t('missione.wrongSpot'), 'error')
      }
    }
  }

  // Reset drag state
  dragging.value = null
  ghostVisible.value = false
  highlightSlot.value = null
}

function updateProgress() {
  const totalItems = decoTotal.value + tableTotal.value
  const placedItems = decoPlacedCount.value + tablePlacedCount.value
  emit('progress', Math.round((placedItems / totalItems) * 100))
}

function transitionToTavolo() {
  playLevelUp()
  phase.value = 'tavolo'
  showFeedback($t('missione.roomDone'), 'success')
}

/* ─── Tap-to-place fallback (for accessibility) ─── */
const selectedItem = ref<DragItem | null>(null)

function onTrayTap(item: DragItem) {
  if (item.used) return
  selectedItem.value = item
}

function onSlotTap(slot: DecoSlot | TableSlot) {
  if (slot.placed || !selectedItem.value) return

  if (slot.emoji === selectedItem.value.emoji) {
    slot.placed = true
    selectedItem.value.used = true
    score.value++
    playSuccess()
    showFeedback($t('missione.placed'), 'success')
    selectedItem.value = null
    updateProgress()

    if (phase.value === 'decora' && decoPlacedCount.value >= decoTotal.value) {
      setTimeout(() => transitionToTavolo(), 800)
    } else if (phase.value === 'tavolo' && tablePlacedCount.value >= tableTotal.value) {
      playLevelUp()
      setTimeout(() => {
        emit('progress', 100)
        emit('complete', score.value)
      }, 800)
    }
  } else {
    playError()
    showFeedback($t('missione.wrongSpot'), 'error')
  }
}

/* ─── Lifecycle ─── */
onMounted(() => {
  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
})

onUnmounted(() => {
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
  if (feedbackTimer) clearTimeout(feedbackTimer)
})
</script>

<template>
  <div class="missione-wrapper">
    <!-- Phase indicator -->
    <div class="missione-phase-bar">
      <span
        class="missione-phase-dot"
        :class="{ active: phase === 'decora', done: phase === 'tavolo' }"
      >{{ $t('missione.phase1') }}</span>
      <span class="missione-phase-line" :class="{ done: phase === 'tavolo' }"></span>
      <span
        class="missione-phase-dot"
        :class="{ active: phase === 'tavolo' }"
      >{{ $t('missione.phase2') }}</span>
    </div>

    <!-- Phase 1: Decora la sala -->
    <template v-if="phase === 'decora'">
      <h2 class="missione-title">{{ $t('missione.decoraTitle') }}</h2>
      <p class="missione-subtitle">
        {{ $t('missione.decoraSub', { name: props.recipientName }) }}
      </p>

      <!-- Room scene with drop zones -->
      <div class="missione-scene missione-room">
        <div class="missione-room-wall">
          <div
            v-for="slot in decoSlots"
            :key="slot.id"
            class="missione-drop-slot"
            :class="{
              placed: slot.placed,
              highlight: highlightSlot === slot.id && !slot.placed,
              selected: selectedItem !== null && !slot.placed,
            }"
            :data-slot-id="slot.id"
            @click="onSlotTap(slot)"
          >
            <span v-if="slot.placed" class="missione-slot-emoji placed-anim">{{ slot.emoji }}</span>
            <span v-else class="missione-slot-hint">{{ slot.label }}</span>
          </div>
        </div>
      </div>

      <!-- Decoration tray -->
      <p class="missione-tray-label">{{ $t('missione.dragHint') }}</p>
      <div class="missione-tray">
        <button
          v-for="item in decoTray"
          :key="item.id"
          class="missione-tray-item"
          :class="{ used: item.used, selected: selectedItem?.id === item.id && selectedItem?.emoji === item.emoji }"
          :style="{ animationDelay: item.id * 0.08 + 's' }"
          @pointerdown="onTrayPointerDown(item, $event)"
          @click="onTrayTap(item)"
        >
          {{ item.emoji }}
        </button>
      </div>

      <p class="missione-counter">
        {{ decoPlacedCount }} / {{ decoTotal }}
      </p>
    </template>

    <!-- Phase 2: Prepara il tavolo -->
    <template v-if="phase === 'tavolo'">
      <h2 class="missione-title">{{ $t('missione.tavoloTitle') }}</h2>
      <p class="missione-subtitle">
        {{ $t('missione.tavoloSub', { name: props.recipientName }) }}
      </p>

      <!-- Table scene with drop zones -->
      <div class="missione-scene missione-table">
        <div class="missione-table-surface">
          <div
            v-for="slot in tableSlots"
            :key="slot.id"
            class="missione-drop-slot"
            :class="{
              placed: slot.placed,
              highlight: highlightSlot === slot.id && !slot.placed,
              selected: selectedItem !== null && !slot.placed,
            }"
            :data-slot-id="slot.id"
            @click="onSlotTap(slot)"
          >
            <span v-if="slot.placed" class="missione-slot-emoji placed-anim">{{ slot.emoji }}</span>
            <span v-else class="missione-slot-hint">{{ slot.label }}</span>
          </div>
        </div>
      </div>

      <!-- Table items tray -->
      <p class="missione-tray-label">{{ $t('missione.dragHint') }}</p>
      <div class="missione-tray">
        <button
          v-for="item in tableTray"
          :key="item.id"
          class="missione-tray-item"
          :class="{ used: item.used, selected: selectedItem?.id === item.id && selectedItem?.emoji === item.emoji }"
          :style="{ animationDelay: item.id * 0.08 + 's' }"
          @pointerdown="onTrayPointerDown(item, $event)"
          @click="onTrayTap(item)"
        >
          {{ item.emoji }}
        </button>
      </div>

      <p class="missione-counter">
        {{ tablePlacedCount }} / {{ tableTotal }}
      </p>
    </template>

    <!-- Feedback message -->
    <p v-if="feedbackMsg" class="missione-feedback" :class="feedbackType">
      {{ feedbackMsg }}
    </p>

    <!-- Drag ghost -->
    <div
      v-if="ghostVisible && dragging"
      class="missione-ghost"
      :style="{ left: ghostX + 'px', top: ghostY + 'px' }"
    >
      {{ dragging.emoji }}
    </div>
  </div>
</template>
