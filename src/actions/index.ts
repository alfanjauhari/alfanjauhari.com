import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { sql } from '@/libs/db'

export const server = {
  login: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email(),
      password: z.string().min(6),
      remember: z.boolean().optional(),
    }),
    handler: async ({ email, password, remember }, ctx) => {
      const users =
        await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`

      if (!users || !users.length) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Invalid email or password',
        })
      }

      const passwordHash = await Bun.password.verify(
        password,
        users[0].password,
      )

      if (!passwordHash) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Invalid email or password',
        })
      }

      const sessionDuration = remember
        ? 30 * 24 * 60 * 60 * 1000 // 30 days
        : 24 * 60 * 60 * 1000 // 1 day

      const sessions = await sql`
        INSERT INTO sessions (user_id, token, expired_at) VALUES (
          ${users[0].id},
          ${Bun.randomUUIDv7()},
          ${new Date(Date.now() + sessionDuration)}
        ) RETURNING token
      `

      if (!sessions || !sessions.length) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create session',
        })
      }

      console.log(ctx.cookies)

      ctx.cookies.set('auth_token', sessions[0].token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: sessionDuration / 1000, // Convert milliseconds to seconds
      })

      return {
        token: sessions[0].token,
      }
    },
  }),
}
