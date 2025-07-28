import { createAuthClient } from 'better-auth/client'

export const auth = createAuthClient({
  baseURL: 'http://localhost:3000',
})
