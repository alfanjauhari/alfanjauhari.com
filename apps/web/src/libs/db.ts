import postgres from 'postgres'

export const sql = postgres(import.meta.env.DATABASE_URL, {
  debug: process.env.NODE_ENV === 'development',
})
