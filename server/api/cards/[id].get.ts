export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID mancante' })
  }

  const storage = useStorage('cards')
  const config = await storage.getItem(id)

  if (!config) {
    throw createError({ statusCode: 404, statusMessage: 'Biglietto non trovato' })
  }

  return config
})
