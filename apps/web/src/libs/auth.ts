import { createAuthClient } from 'better-auth/client'

export const auth = createAuthClient({
  baseURL: import.meta.env.PUBLIC_PAYLOAD_API_URL,
})
