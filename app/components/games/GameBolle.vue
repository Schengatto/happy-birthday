<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudio } from '~/composables/useAudio'
import { useLocale } from '~/composables/useLocale'
import { BOLLE_EMOJIS, BOLLE_LEVELS } from '~/utils/emoji-sets'
import '~/assets/css/game-bolle.css'

import type { RecipientGender } from '../../../types/card'

const { $t } = useLocale()

const LEVEL_LABEL_KEYS = ['bolle.level1', 'bolle.level2']

const props = defineProps<{
  recipientName: string
  recipientGender: RecipientGender
  theme?: 'pink' | 'dark' | 'pastel'
}>()

const emit = defineEmits<{
  complete: [score: number]
  progress: [percent: number]
}>()

const { playPop, playSuccess, playError, playLevelUp, playVictory, playFlip } = useAudio()

const COLS = 8
const MAX_ROWS = 9
const ROW_H = 0.866

const currentLevel = ref(0)
const score = ref(0)
const phase = ref<'playing' | 'shooting' | 'levelComplete' | 'win' | 'lose'>('playing')
const grid = ref<(string | null)[][]>([])
const currentEmoji = ref('')
const nextEmoji = ref('')
const poppingCells = ref<Set<string>>(new Set())
const arenaRef = ref<HTMLElement | null>(null)
const cellSize = ref(44)

const shootBubble = ref<{ x: number; y: number; emoji: string; dx: number; dy: number } | null>(null)
let animFrame: number | null = null

const levelConfig = computed(() => BOLLE_LEVELS[currentLevel.value]!)

function colCount(row: number): number {
  return row % 2 === 1 ? COLS - 1 : COLS
}

function gridToPixel(row: number, col: number): { x: number; y: number } {
  const cs = cellSize.value
  const isOdd = row % 2 === 1
  return {
    x: col * cs + (isOdd ? cs * 0.5 : 0) + cs / 2,
    y: row * cs * ROW_H + cs / 2,
  }
}

function pixelToNearestCell(px: number, py: number): [number, number] {
  const cs = cellSize.value
  const rowF = (py - cs / 2) / (cs * ROW_H)
  const row = Math.max(0, Math.round(rowF))
  const isOdd = row % 2 === 1
  const maxCol = colCount(row)
  const colF = (px - cs / 2 - (isOdd ? cs * 0.5 : 0)) / cs
  const col = Math.max(0, Math.min(maxCol - 1, Math.round(colF)))
  return [row, col]
}

function randomEmoji(): string {
  const cfg = levelConfig.value
  const emojis = BOLLE_EMOJIS.slice(0, cfg.emojiCount)
  const gridEmojis = new Set<string>()
  for (const row of grid.value) {
    for (const cell of row) {
      if (cell) gridEmojis.add(cell)
    }
  }
  const available = emojis.filter(e => gridEmojis.has(e))
  const pool = available.length > 0 ? available : emojis
  return pool[Math.floor(Math.random() * pool.length)]!
}

function initGrid() {
  const cfg = levelConfig.value
  const emojis = BOLLE_EMOJIS.slice(0, cfg.emojiCount)
  const rows: (string | null)[][] = []
  for (let r = 0; r < cfg.rows; r++) {
    const cols = colCount(r)
    const row: (string | null)[] = []
    for (let c = 0; c < cols; c++) {
      row.push(emojis[Math.floor(Math.random() * emojis.length)]!)
    }
    rows.push(row)
  }
  grid.value = rows
  currentEmoji.value = randomEmoji()
  nextEmoji.value = randomEmoji()
  phase.value = 'playing'
}

function getNeighbors(row: number, col: number): [number, number][] {
  const isOdd = row % 2 === 1
  const deltas: [number, number][] = isOdd
    ? [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]]
    : [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]
  return deltas
    .map(([dr, dc]) => [row + dr, col + dc] as [number, number])
    .filter(([r, c]) => {
      if (r < 0) return false
      if (r >= grid.value.length) return false
      const maxC = colCount(r)
      return c >= 0 && c < maxC
    })
}

function findGroup(row: number, col: number, emoji: string): Set<string> {
  const visited = new Set<string>()
  const stack: [number, number][] = [[row, col]]
  while (stack.length > 0) {
    const [r, c] = stack.pop()!
    const key = `${r},${c}`
    if (visited.has(key)) continue
    if (r < 0 || r >= grid.value.length) continue
    if (c < 0 || c >= grid.value[r]!.length) continue
    if (grid.value[r]![c] !== emoji) continue
    visited.add(key)
    for (const [nr, nc] of getNeighbors(r, c)) {
      if (!visited.has(`${nr},${nc}`)) stack.push([nr, nc])
    }
  }
  return visited
}

function findConnected(): Set<string> {
  const connected = new Set<string>()
  const stack: [number, number][] = []
  if (grid.value.length > 0) {
    for (let c = 0; c < grid.value[0]!.length; c++) {
      if (grid.value[0]![c]) stack.push([0, c])
    }
  }
  while (stack.length > 0) {
    const [r, c] = stack.pop()!
    const key = `${r},${c}`
    if (connected.has(key)) continue
    if (r < 0 || r >= grid.value.length) continue
    if (c < 0 || c >= grid.value[r]!.length) continue
    if (!grid.value[r]![c]) continue
    connected.add(key)
    for (const [nr, nc] of getNeighbors(r, c)) {
      if (!connected.has(`${nr},${nc}`)) stack.push([nr, nc])
    }
  }
  return connected
}

function removeFloating(): number {
  const connected = findConnected()
  let removed = 0
  for (let r = 0; r < grid.value.length; r++) {
    for (let c = 0; c < grid.value[r]!.length; c++) {
      if (grid.value[r]![c] && !connected.has(`${r},${c}`)) {
        grid.value[r]![c] = null
        removed++
      }
    }
  }
  return removed
}

function trimGrid() {
  while (grid.value.length > 0 && grid.value[grid.value.length - 1]!.every(c => !c)) {
    grid.value.pop()
  }
}

function isGridEmpty(): boolean {
  return grid.value.every(row => row.every(cell => !cell))
}

function findBestEmptyNeighbor(px: number, py: number, hitRow: number, hitCol: number): [number, number] {
  const neighbors = getNeighbors(hitRow, hitCol)
  let best: [number, number] | null = null
  let bestDist = Infinity

  for (const [nr, nc] of neighbors) {
    if (nr < 0) continue
    const maxC = colCount(nr)
    if (nc < 0 || nc >= maxC) continue
    // Ensure row exists
    if (nr < grid.value.length && grid.value[nr]![nc]) continue
    const pos = gridToPixel(nr, nc)
    const dist = Math.sqrt((px - pos.x) ** 2 + (py - pos.y) ** 2)
    if (dist < bestDist) {
      bestDist = dist
      best = [nr, nc]
    }
  }

  if (!best) {
    // Fallback: use pixel position
    best = pixelToNearestCell(px, py)
  }

  return best
}

function placeBubble(row: number, col: number, emoji: string) {
  // Ensure grid has enough rows
  while (grid.value.length <= row) {
    const r = grid.value.length
    grid.value.push(new Array(colCount(r)).fill(null))
  }

  const maxC = colCount(row)
  const safeCol = Math.max(0, Math.min(maxC - 1, col))

  if (grid.value[row]![safeCol]) {
    // Cell occupied — find nearest empty neighbor
    const best = findBestEmptyNeighbor(
      gridToPixel(row, safeCol).x,
      gridToPixel(row, safeCol).y,
      row, safeCol
    )
    row = best[0]
    col = best[1]
    while (grid.value.length <= row) {
      const r = grid.value.length
      grid.value.push(new Array(colCount(r)).fill(null))
    }
    grid.value[row]![col] = emoji
  } else {
    grid.value[row]![safeCol] = emoji
    col = safeCol
  }

  // Check lose
  if (row >= MAX_ROWS) {
    phase.value = 'lose'
    playError()
    return
  }

  // Check match
  const group = findGroup(row, col, emoji)
  if (group.size >= 3) {
    poppingCells.value = new Set(group)
    score.value += group.size * 10
    playPop(true)

    setTimeout(() => {
      for (const key of group) {
        const [r, c] = key.split(',').map(Number) as [number, number]
        if (grid.value[r]) grid.value[r]![c] = null
      }
      const floatRemoved = removeFloating()
      if (floatRemoved > 0) {
        score.value += floatRemoved * 5
        playSuccess()
      }
      trimGrid()
      poppingCells.value = new Set()
      grid.value = [...grid.value]

      if (isGridEmpty()) {
        if (currentLevel.value < BOLLE_LEVELS.length - 1) {
          phase.value = 'levelComplete'
          playLevelUp()
          emit('progress', Math.round(((currentLevel.value + 1) / BOLLE_LEVELS.length) * 100))
          setTimeout(() => {
            currentLevel.value++
            initGrid()
          }, 2000)
        } else {
          phase.value = 'win'
          playVictory()
          emit('progress', 100)
          setTimeout(() => emit('complete', score.value), 3000)
        }
      } else {
        phase.value = 'playing'
      }
    }, 350)
  } else {
    playFlip()
    phase.value = 'playing'
  }

  currentEmoji.value = nextEmoji.value
  nextEmoji.value = randomEmoji()
}

function shoot(localX: number, localY: number) {
  if (phase.value !== 'playing') return

  const cs = cellSize.value
  const arenaWidth = COLS * cs
  const shooterX = arenaWidth / 2
  const shooterY = (MAX_ROWS + 0.5) * cs * ROW_H

  let dx = localX - shooterX
  let dy = localY - shooterY

  // Only shoot upward
  if (dy >= -cs * 0.5) return

  // Limit angle so shots aren't too horizontal
  const angle = Math.atan2(dy, dx)
  const minAngle = -Math.PI + 0.15
  const maxAngle = -0.15
  const clampedAngle = Math.max(minAngle, Math.min(maxAngle, angle))

  const speed = cs * 0.28
  dx = Math.cos(clampedAngle) * speed
  dy = Math.sin(clampedAngle) * speed

  phase.value = 'shooting'
  shootBubble.value = { x: shooterX, y: shooterY, emoji: currentEmoji.value, dx, dy }

  animateShot()
}

function animateShot() {
  if (!shootBubble.value) return

  const b = shootBubble.value
  const cs = cellSize.value
  const arenaWidth = COLS * cs

  b.x += b.dx
  b.y += b.dy

  // Bounce off side walls
  if (b.x <= cs / 2) { b.x = cs / 2; b.dx = Math.abs(b.dx) }
  if (b.x >= arenaWidth - cs / 2) { b.x = arenaWidth - cs / 2; b.dx = -Math.abs(b.dx) }

  // Hit top wall
  if (b.y <= cs / 2) {
    const [row, col] = pixelToNearestCell(b.x, b.y)
    shootBubble.value = null
    placeBubble(row, col, b.emoji)
    return
  }

  // Check collision with existing bubbles
  for (let r = 0; r < grid.value.length; r++) {
    for (let c = 0; c < grid.value[r]!.length; c++) {
      if (!grid.value[r]![c]) continue
      const pos = gridToPixel(r, c)
      const dist = Math.sqrt((b.x - pos.x) ** 2 + (b.y - pos.y) ** 2)
      if (dist < cs * 0.85) {
        const bestCell = findBestEmptyNeighbor(b.x, b.y, r, c)
        shootBubble.value = null
        placeBubble(bestCell[0], bestCell[1], b.emoji)
        return
      }
    }
  }

  // Continue animation
  shootBubble.value = { ...b }
  animFrame = requestAnimationFrame(animateShot)
}

function handleClick(e: MouseEvent) {
  if (phase.value !== 'playing' || !arenaRef.value) return
  const rect = arenaRef.value.getBoundingClientRect()
  shoot(e.clientX - rect.left, e.clientY - rect.top)
}

function handleTouch(e: TouchEvent) {
  if (phase.value !== 'playing' || !arenaRef.value) return
  e.preventDefault()
  const touch = e.touches[0]!
  const rect = arenaRef.value.getBoundingClientRect()
  shoot(touch.clientX - rect.left, touch.clientY - rect.top)
}

function handleLoseAcknowledge() {
  emit('complete', score.value)
}

function updateSize() {
  if (arenaRef.value) {
    cellSize.value = Math.min(50, Math.floor(arenaRef.value.clientWidth / COLS))
  }
}

let resizeObserver: ResizeObserver | null = null

// Computed for rendering
const visibleBubbles = computed(() => {
  const result: { key: string; emoji: string; x: number; y: number; popping: boolean }[] = []
  for (let r = 0; r < grid.value.length; r++) {
    for (let c = 0; c < grid.value[r]!.length; c++) {
      const emoji = grid.value[r]![c]
      if (!emoji) continue
      const pos = gridToPixel(r, c)
      result.push({
        key: `${r},${c}`,
        emoji,
        x: pos.x,
        y: pos.y,
        popping: poppingCells.value.has(`${r},${c}`),
      })
    }
  }
  return result
})

const arenaHeight = computed(() => (MAX_ROWS + 1.8) * cellSize.value * ROW_H)
const shooterY = computed(() => (MAX_ROWS + 0.3) * cellSize.value * ROW_H)
const dangerLineY = computed(() => (MAX_ROWS - 0.3) * cellSize.value * ROW_H)

onMounted(() => {
  updateSize()
  if (arenaRef.value) {
    resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(arenaRef.value)
  }
  initGrid()
  emit('progress', 0)
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<template>
  <div class="bolle-game">
    <!-- HUD -->
    <div class="bolle-hud">
      <span class="bolle-hud-level">{{ $t(LEVEL_LABEL_KEYS[currentLevel] ?? 'bolle.level1') }}</span>
      <span class="bolle-hud-score">⭐ {{ score }}</span>
    </div>

    <!-- Arena -->
    <div
      ref="arenaRef"
      class="bolle-arena"
      :style="{ height: arenaHeight + 'px' }"
      @click="handleClick"
      @touchstart="handleTouch"
    >
      <!-- Grid bubbles -->
      <div
        v-for="bubble in visibleBubbles"
        :key="bubble.key"
        class="bolle-bubble"
        :class="{ 'bolle-bubble--popping': bubble.popping }"
        :style="{
          left: bubble.x - cellSize * 0.45 + 'px',
          top: bubble.y - cellSize * 0.45 + 'px',
          width: cellSize * 0.9 + 'px',
          height: cellSize * 0.9 + 'px',
          fontSize: cellSize * 0.52 + 'px',
        }"
      >
        {{ bubble.emoji }}
      </div>

      <!-- Danger line -->
      <div class="bolle-danger" :style="{ top: dangerLineY + 'px' }" />

      <!-- Shooting bubble -->
      <div
        v-if="shootBubble"
        class="bolle-bubble bolle-bubble--shooting"
        :style="{
          left: shootBubble.x - cellSize * 0.45 + 'px',
          top: shootBubble.y - cellSize * 0.45 + 'px',
          width: cellSize * 0.9 + 'px',
          height: cellSize * 0.9 + 'px',
          fontSize: cellSize * 0.52 + 'px',
        }"
      >
        {{ shootBubble.emoji }}
      </div>

      <!-- Shooter -->
      <div class="bolle-shooter" :style="{ top: shooterY + 'px' }">
        <div class="bolle-shooter-next">
          <span class="bolle-shooter-next-emoji">{{ nextEmoji }}</span>
        </div>
        <div
          class="bolle-shooter-current"
          :style="{
            width: cellSize * 1.15 + 'px',
            height: cellSize * 1.15 + 'px',
            fontSize: cellSize * 0.6 + 'px',
          }"
        >
          {{ currentEmoji }}
        </div>
      </div>
    </div>

    <!-- Instruction -->
    <div class="bolle-instruction">
      {{ $t('bolle.instruction') }}
    </div>

    <!-- Level Complete Overlay -->
    <div v-if="phase === 'levelComplete'" class="bolle-overlay">
      <div class="bolle-overlay-card">
        <div class="bolle-overlay-emoji">🎉</div>
        <div class="bolle-overlay-title">{{ $t('bolle.levelDone') }}</div>
        <div class="bolle-overlay-sub">{{ $t('bolle.levelDoneSub') }}</div>
        <div class="bolle-overlay-score">{{ $t('bolle.points') }} {{ score }} ⭐</div>
      </div>
    </div>

    <!-- Win Overlay -->
    <div v-if="phase === 'win'" class="bolle-overlay">
      <div class="bolle-overlay-card">
        <div class="bolle-overlay-emoji">🏆</div>
        <div class="bolle-overlay-title">{{ $t('bolle.win.' + recipientGender, { name: recipientName }) }}</div>
        <div class="bolle-overlay-sub">{{ $t('bolle.winSub') }}</div>
        <div class="bolle-overlay-score">{{ $t('bolle.winScore') }} {{ score }} ⭐</div>
      </div>
    </div>

    <!-- Lose Overlay -->
    <div v-if="phase === 'lose'" class="bolle-overlay" @click="handleLoseAcknowledge">
      <div class="bolle-overlay-card">
        <div class="bolle-overlay-emoji">🫧</div>
        <div class="bolle-overlay-title">{{ $t('bolle.lose') }}</div>
        <div class="bolle-overlay-sub">{{ $t('bolle.loseSub', { name: recipientName }) }}</div>
        <div class="bolle-overlay-score">{{ $t('bolle.loseScore') }} {{ score }}</div>
      </div>
    </div>
  </div>
</template>
