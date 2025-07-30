import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { captureException } from '@sentry/astro'
import { z } from 'astro/zod'
import { Controller, useForm } from 'react-hook-form'
import Button from '@/components/base/Button'
import { Checkbox } from '@/components/base/Checkbox'
import { Input } from '@/components/base/Input'
import { auth } from '@/libs/auth'
import { ProvidersLogin } from './ProvidersLogin'

// #region Types
interface LoginFormProps {
  callbackURL?: string | null
  message?: string | null
}

export const LoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  callbackURL: z.string(),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof LoginSchema>
// #endregion

export function LoginForm({ callbackURL, message }: LoginFormProps) {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      callbackURL: callbackURL || '/',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await auth.signIn.email(data)

      if (!response.error) {
        window.location.href = data.callbackURL || '/'

        return
      }

      if (response.error.code === 'INVALID_EMAIL_OR_PASSWORD') {
        form.setError('email', {
          message: response.error.message,
        })
      }

      throw new Error(response.error.message || 'Login failed')
    } catch (error) {
      captureException(error)

      form.setError('email', {
        message: 'An unexpected error occurred. Please try again later.',
      })
    }
  }

  return (
    <div className="flex items-center h-screen">
      <div className="bg-white px-6 flex flex-col justify-center w-1/3 h-full">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {message && <p className="p-4 bg-red-600 text-white">{message}</p>}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-gray-700">
              Email
            </label>
            <Input type="email" id="email" {...form.register('email')} />
            <ErrorMessage
              name="email"
              errors={form.formState.errors}
              render={({ message }) => (
                <p className="text-red-600 text-sm">{message}</p>
              )}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-gray-700">
              Password
            </label>
            <Input
              type="password"
              id="password"
              {...form.register('password')}
            />
            <ErrorMessage
              name="password"
              errors={form.formState.errors}
              render={({ message }) => (
                <p className="text-red-600 text-sm">{message}</p>
              )}
            />
          </div>
          <div className="flex items-center gap-2">
            <Controller
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <Button
            type="submit"
            className="text-xl p-4 h-16"
            isLoading={form.formState.isSubmitting}
          >
            Login
          </Button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-2">
          Don't have an account?{' '}
          <a
            href="/register"
            className="text-stone-700 underline hover:no-underline"
          >
            Register here
          </a>
        </p>
        <p className="text-sm text-center text-gray-600 mt-6 mb-2">
          Or login with
        </p>
        <ProvidersLogin />
      </div>
    </div>
  )
}
