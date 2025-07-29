import { ActionError, type ActionErrorCode, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { auth } from '@/libs/auth'

export const server = {
  login: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email(),
      password: z.string().min(6),
      redirectTo: z.string().optional(),
    }),
    handler: async ({ email, password, redirectTo: redirectToInput }, ctx) => {
      const redirectTo = redirectToInput
        ? new URL(redirectToInput, ctx.url).pathname
        : '/'

      const response = await auth.signIn.email({
        email,
        password,
        callbackURL: redirectTo,
      })

      if (response.error) {
        throw new ActionError({
          code: response.error.statusText as ActionErrorCode,
          message: response.error.message,
          stack: JSON.stringify(response.error, null, 2),
        })
      }

      return {
        success: true,
        redirectTo,
      }
    },
  }),
  register: defineAction({
    accept: 'form',
    input: z
      .object({
        name: z.string().min(1, 'Name is required'),
        email: z
          .string()
          .min(1, 'Email is required')
          .email('Invalid email address'),
        password: z
          .string()
          .min(6, 'Password must be at least 6 characters long'),
        confirm_password: z.string(),
      })
      .refine((data) => data.password === data.confirm_password, {
        message: 'Passwords must match',
        path: ['confirm_password'],
      }),
    handler: async ({ name, email, password }) => {
      const response = await auth.signUp.email({
        name,
        email,
        password,
        callbackURL: `${import.meta.env.SITE}/login`,
      })

      if (response.error) {
        throw new ActionError({
          code: response.error.statusText as ActionErrorCode,
          message: response.error.message,
          stack: JSON.stringify(response.error, null, 2),
        })
      }

      return {
        success: true,
        user: response,
      }
    },
  }),
}
