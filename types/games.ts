import type { CardTheme } from './card'

export interface GameProps {
  recipientName: string
  theme?: CardTheme
}

export interface GameEmits {
  (e: 'complete', score: number): void
  (e: 'progress', percent: number): void
}
