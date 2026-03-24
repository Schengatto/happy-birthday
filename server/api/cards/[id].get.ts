import { useDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID mancante' })
  }

  const sql = useDb()
  const rows = await sql('SELECT config FROM cards WHERE id = $1', [id])

  if (rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Biglietto non trovato' })
  }

  return rows[0].config
})
