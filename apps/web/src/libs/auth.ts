import { createAuthClient } from 'better-auth/client'

export const auth = createAuthClient({
  baseURL: process.env.VITE_PAYLOAD_API_URL || 'http://localhost:3000',
})
