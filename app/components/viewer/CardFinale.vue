<script setup lang="ts">
import '~/assets/css/viewer.css'
import { ref, onMounted, onUnmounted } from 'vue'
import { useAudio } from '~/composables/useAudio'
import { BALLOON_EMOJIS } from '~/utils/emoji-sets'
import ConfettiCanvasComponent from '~/components/shared/ConfettiCanvas.vue'
import type { RecipientGender } from '../../../types/card'
import { useLocale } from '~/composables/useLocale'

const { $t } = useLocale()

const props = defineProps<{
  recipientName: string
  recipientGender: RecipientGender
}>()

const confettiRef = ref<InstanceType<typeof ConfettiCanvasComponent>>()
const { playHappyBirthday, playVictory } = useAudio()

const candlesOut = ref(false)

interface FloatingBalloon {
  id: number
  emoji: string
  x: number
  dur: number
  delay: number
}

const balloons = ref<FloatingBalloon[]>([])
let balloonId = 0
let balloonTimer: ReturnType<typeof setInterval> | null = null

function spawnBalloon() {
  balloons.value.push({
    id: balloonId++,
    emoji: BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)]!,
    x: Math.random() * 90 + 5,
    dur: 4 + Math.random() * 3,
    delay: 0,
  })
  // Clean up old balloons
  if (balloons.value.length > 20) {
    balloons.value = balloons.value.slice(-15)
  }
}

function blowCandles() {
  candlesOut.value = true
  playVictory()
  confettiRef.value?.burst(180, true)
}

onMounted(() => {
  playHappyBirthday()
  confettiRef.value?.burst(90)
  balloonTimer = setInterval(spawnBalloon, 600)
})

onUnmounted(() => {
  if (balloonTimer) clearInterval(balloonTimer)
})
</script>

<template>
  <div class="finale">
    <ConfettiCanvas ref="confettiRef" />

    <div class="finale-balloons">
      <span
        v-for="b in balloons"
        :key="b.id"
        class="finale-balloon"
        :style="{
          '--x': b.x + '%',
          '--dur': b.dur + 's',
          '--delay': b.delay + 's',
          left: b.x + '%',
          animationDuration: b.dur + 's',
        }"
      >{{ b.emoji }}</span>
    </div>

    <div class="finale-content">
      <!-- Decorative top sparkles -->
      <div class="finale-sparkles">✨ 🌟 ✨</div>

      <div class="finale-cake-area">
        <div class="finale-candles">
          <span v-if="!candlesOut">🕯️🕯️🕯️🕯️🕯️</span>
          <span v-else class="finale-puffs">💨💨💨</span>
        </div>
        <div class="finale-cake">{{ candlesOut ? '🎊' : '🎂' }}</div>
      </div>

      <div class="finale-card">
        <div class="finale-title">
          {{ $t('finale.title', { name: recipientName.toUpperCase() }) }}
        </div>

        <div class="finale-divider">🎀</div>

        <div class="finale-message">
          {{ $t('finale.message.' + recipientGender) }}
        </div>

        <button v-if="!candlesOut" class="btn btn-primary finale-blow-btn" @click="blowCandles">
          {{ $t('finale.blow') }}
        </button>

        <div v-if="candlesOut" class="finale-celebration">
          🎊 🥳 🎉 🥳 🎊
        </div>
      </div>

      <!-- Decorative bottom sparkles -->
      <div class="finale-sparkles finale-sparkles--bottom">🎉 💖 🎉</div>

    </div>

    <!-- Create your own card link -->
    <a href="/" class="finale-create-link">
      🎂 {{ $t('finale.createYours') }}
    </a>
  </div>
</template>
