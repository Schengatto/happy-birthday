import { nanoid } from 'nanoid'
import type { CardConfig } from '../../../types/card'
import { useDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<CardConfig>(event)

  // Validate required fields
  if (!body.recipientName || !body.senderName || !body.message) {
    throw createError({ statusCode: 400, statusMessage: 'Campi obbligatori mancanti' })
  }

  if (!body.games || body.games.length === 0 || body.games.length > 10) {
    throw createError({ statusCode: 400, statusMessage: 'Seleziona da 1 a 10 giochi' })
  }

  const validGameTypes = ['missione', 'coppie', 'palloncini', 'sequenza', 'regalo', 'torta', 'artiglio', 'bolle', 'dolcetti', 'alchimia']
  for (const game of body.games) {
    if (!validGameTypes.includes(game.type)) {
      throw createError({ statusCode: 400, statusMessage: `Tipo di gioco non valido: ${game.type}` })
    }
  }

  const validThemes = ['cuoricini', 'floreale', 'festivo', 'classic-light', 'classic-dark', 'modern']
  if (!validThemes.includes(body.theme)) {
    throw createError({ statusCode: 400, statusMessage: 'Tema non valido' })
  }

  const validGenders = ['M', 'F']
  const recipientGender = validGenders.includes(body.recipientGender) ? body.recipientGender : 'M'

  const validLocales = ['it', 'en']
  const locale = validLocales.includes(body.locale) ? body.locale : 'it'

  const config: CardConfig = {
    v: 1,
    locale,
    recipientName: body.recipientName.trim().slice(0, 50),
    recipientGender,
    senderName: body.senderName.trim().slice(0, 50),
    message: body.message.trim().slice(0, 300),
    games: body.games,
    theme: body.theme,
  }

  const id = nanoid(10)
  const sql = useDb()
  await sql('INSERT INTO cards (id, config) VALUES ($1, $2)', [id, JSON.stringify(config)])

  return { id }
})
