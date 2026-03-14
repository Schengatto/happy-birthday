export type RecipientGender = 'M' | 'F'

export type CardLocale = 'it' | 'en'

export interface CardConfig {
  v: 1
  locale: CardLocale
  recipientName: string
  recipientGender: RecipientGender
  senderName: string
  message: string
  games: GameSelection[]
  theme: CardTheme
}

export interface GameSelection {
  type: GameType
}

export type GameType = 'missione' | 'coppie' | 'palloncini' | 'sequenza' | 'regalo' | 'torta' | 'artiglio' | 'bolle' | 'dolcetti' | 'alchimia'

export type CardTheme = 'cuoricini' | 'floreale' | 'festivo' | 'classic-light' | 'classic-dark' | 'modern'

export interface StoredCard {
  id: string
  config: CardConfig
  createdAt: Date
}
