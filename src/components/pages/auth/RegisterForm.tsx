'use client'

import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import type { CheckedState } from '@radix-ui/react-checkbox'
import * as Dialog from '@radix-ui/react-dialog'
import { captureException } from '@sentry/nextjs'
import { XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from '@/components/base/Button'
import { Checkbox } from '@/components/base/Checkbox'
import { Input } from '@/components/base/Input'
import { authClient } from '@/libs/utils'
import { ProvidersLogin } from './ProvidersLogin'

// #region Types
export const RegisterSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
    disclaimerAgreement: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the disclaimer',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof RegisterSchema>
// #endregion

export function RegisterForm() {
  const [isDisclaimerDialogOpen, setIsDisclaimerDialogOpen] = useState(false)
  const [isAlreadyReadDisclaimer, setIsAlreadyReadDisclaimer] = useState(false)

  const router = useRouter()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      disclaimerAgreement: false,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      if (!response.error) {
        window.umami.track('user_signed_up', {
          email: data.email,
        })

        return router.push('/login')
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

  const onCheckDisclaimer = (checked: CheckedState) => {
    if (checked && !isAlreadyReadDisclaimer) {
      setIsDisclaimerDialogOpen(true)

      return
    }

    setIsAlreadyReadDisclaimer(true)

    form.setValue('disclaimerAgreement', checked === true)
  }

  const onDisclaimerUnderstand = () => {
    setIsDisclaimerDialogOpen(false)
    setIsAlreadyReadDisclaimer(true)

    form.setValue('disclaimerAgreement', true)
  }

  return (
    <div className="flex items-center h-screen">
      <div className="bg-white px-6 flex flex-col justify-center lg:w-1/2 xl:w-1/3 w-full h-full">
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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Controller
                control={form.control}
                name="disclaimerAgreement"
                render={({ field }) => (
                  <Checkbox
                    id="disclaimerAgreement"
                    checked={field.value}
                    onCheckedChange={onCheckDisclaimer}
                  />
                )}
              />
              <label
                htmlFor="disclaimerAgreement"
                className="text-sm text-gray-700"
              >
                I agree to the{' '}
                <Dialog.Root
                  open={isDisclaimerDialogOpen}
                  onOpenChange={setIsDisclaimerDialogOpen}
                >
                  <Dialog.Trigger asChild>
                    <button
                      className="inline underline cursor-pointer"
                      type="button"
                    >
                      disclaimer
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="bg-black/50 fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content className="p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-white fixed top-1/2 left-1/2 z-50 -translate-1/2 lg:max-w-[80vw]">
                      <Dialog.Title className="font-bold text-bold font-heading text-2xl uppercase tracking-wider text-stone-700">
                        Disclaimer
                      </Dialog.Title>
                      <Dialog.Description>
                        Please read the disclaimer carefully before signing up.
                      </Dialog.Description>
                      <div className="space-y-2 mt-4">
                        <h1 className="text-lg font-bold">
                          Why do you need to sign up on my website to access
                          particular resources?
                        </h1>
                        <p>
                          To access certain resources on this website, I ask you
                          to create an account first. This is a part of how I
                          try to give you a more personalized experience over
                          time. By signing up, I can make sure the content you
                          see is more relevant to you and your needs. It also
                          helps me filter out bots and automated scrapers, which
                          often try to get into exclusive content. In short,
                          requiring a sign-up lets me maintain a cleaner, more
                          human-friendly space for everyone here.
                        </p>

                        <p>
                          Another reason for this is accountability. If you
                          share something from this site on social media,
                          signing up let me know who’s sharing it. That way, if
                          a discussion happens online, I don’t have to deal with
                          random anonymous arguments and it’s easier to keep the
                          conversation meaningful{' '}
                          <i>
                            (aka I will ignore any discussion outside of this
                            website publicly)
                          </i>
                          . At the end of the day, signing up is meant to
                          protect both the content and the community around it.
                          If you’re not comfortable with this, that’s perfectly
                          fine there’s no need to sign up, and you won’t be
                          forced into anything. But if you’d like the full
                          experience, registration is the way to go.
                        </p>

                        <p>
                          Email me at{' '}
                          <a
                            href="mailto:hi@alfanjauhari.com"
                            className="underline"
                          >
                            hi@alfanjauhari.com
                          </a>{' '}
                          if you want to complain lol
                        </p>
                      </div>
                      <Dialog.Close className="cursor-pointer absolute top-6 right-6">
                        <XIcon className="size-4 text-gray-500" />
                      </Dialog.Close>
                      <Button
                        type="button"
                        className="mt-4 p-4"
                        onClick={onDisclaimerUnderstand}
                      >
                        Understand
                      </Button>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </label>
            </div>
            <ErrorMessage
              name="disclaimerAgreement"
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
          Or register with
        </p>
        <ProvidersLogin />
      </div>
    </div>
  )
}
