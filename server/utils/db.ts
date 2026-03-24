import { neon } from '@neondatabase/serverless'

let _sql: ReturnType<typeof neon> | null = null

export function useDb() {
  if (!_sql) {
    const url = process.env.NEON_DATABASE_URL
    if (!url) {
      throw new Error('NEON_DATABASE_URL non configurata')
    }
    _sql = neon(url)
  }
  return _sql
}
