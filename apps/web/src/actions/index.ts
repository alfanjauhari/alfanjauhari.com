import { ActionError, ActionInputError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { ValidationError } from 'payload'

export const server = {
  login: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
    handler: async ({ email, password }, ctx) => {
      try {
        const response = await ctx.locals.payload.login({
          collection: 'users',
          data: {
            email,
            password,
          },
        })

        ctx.cookies.set('api-token', response.token || '', {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        })

        return {
          success: true,
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          throw new ActionInputError(
            error.data.errors.map((error) => ({
              message: error.message,
              code: 'custom',
              path: [error.path],
            })),
          )
        }

        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Login failed',
          stack: error instanceof Error ? error.stack : undefined,
        })
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
    handler: async ({ name, email, password }, ctx) => {
      try {
        const response = await ctx.locals.payload.create({
          collection: 'users',
          data: {
            name,
            email,
            password,
          },
        })

        return {
          success: true,
          user: response,
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          throw new ActionInputError(
            error.data.errors.map((error) => ({
              message: error.message,
              code: 'custom',
              path: [error.path],
            })),
          )
        }

        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Registration failed',
          stack: error instanceof Error ? error.stack : undefined,
        })
      }
    },
  }),
}
