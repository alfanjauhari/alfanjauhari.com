import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { captureException } from '@sentry/astro'
import { z } from 'astro/zod'
import { useForm } from 'react-hook-form'
import Button from '@/components/base/Button'
import { Input } from '@/components/base/Input'
import { auth } from '@/libs/auth'
import { ProvidersLogin } from './ProvidersLogin'

// #region Types
export const RegisterSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof RegisterSchema>
// #endregion

export function RegisterForm() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await auth.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      if (!response.error) {
        window.location.href = '/login'

        return
      }

      if (response.error.code === 'USER_ALREADY_EXISTS') {
        form.setError('email', {
          message: 'Email already exists. Please login instead.',
        })

        return
      }

      throw new Error(response.error.message || 'Registration failed')
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
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm text-gray-700">
              Name
            </label>
            <Input type="text" id="name" {...form.register('name')} />
            <ErrorMessage
              name="name"
              errors={form.formState.errors}
              render={({ message }) => (
                <p className="text-red-600 text-sm">{message}</p>
              )}
            />
          </div>
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
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm text-gray-700"
            >
              Confirm Password
            </label>
            <Input
              type="password"
              id="confirmPassword"
              {...form.register('confirmPassword')}
            />
            <ErrorMessage
              name="confirmPassword"
              errors={form.formState.errors}
              render={({ message }) => (
                <p className="text-red-600 text-sm">{message}</p>
              )}
            />
          </div>
          <Button
            type="submit"
            className="text-xl p-4"
            isLoading={form.formState.isSubmitting}
          >
            Register
          </Button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-2">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-stone-700 underline hover:no-underline"
          >
            Login here
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
