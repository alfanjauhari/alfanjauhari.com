import { captureException } from '@sentry/astro'
import { memo, useState } from 'react'
import Button from '@/components/base/Button'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { GoogleIcon } from '@/components/icons/GoogleIcon'
import { auth } from '@/libs/auth'

export const ProvidersLogin = memo(function ProvidersLogin() {
  const [state, setState] = useState<'loading' | 'idle' | `Error: ${string}`>(
    'idle',
  )

  const onSocialLogin = (provider: 'github' | 'google') => async () => {
    setState('loading')

    try {
      const response = await auth.signIn.social({
        provider: provider,
        callbackURL: import.meta.env.PUBLIC_SITE_URL,
        disableRedirect: true,
      })

      if (response.error) {
        setState(`Error: ${response.error.message}`)
        return
      }

      window.location.href =
        response.data.url || import.meta.env.PUBLIC_SITE_URL
    } catch (error) {
      captureException(error)

      setState(`Error: Failed to login with ${provider}`)
    } finally {
      setState('idle')
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        isLoading={state === 'loading'}
        onClick={onSocialLogin('github')}
        className="text-xl p-4 h-16"
      >
        <GithubIcon className="fill-current size-7" />
        <span>Github</span>
      </Button>
      <Button
        isLoading={state === 'loading'}
        onClick={onSocialLogin('google')}
        className="text-xl p-4 h-16"
      >
        <GoogleIcon className="fill-current size-7" />
        <span>Google</span>
      </Button>
    </div>
  )
})
