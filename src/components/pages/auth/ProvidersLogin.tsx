'use client'

import { useRouter } from 'next/navigation'
import { memo, useState } from 'react'
import Button from '@/components/base/Button'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { GoogleIcon } from '@/components/icons/GoogleIcon'
import { env } from '@/libs/config'
import { authClient } from '@/libs/utils'

export const ProvidersLogin = memo(function ProvidersLogin() {
  const router = useRouter()

  const [state, setState] = useState<
    'githubLoading' | 'googleLoading' | 'idle' | `Error: ${string}`
  >('idle')

  const onSocialLogin = (provider: 'github' | 'google') => async () => {
    setState(`${provider}Loading`)

    const response = await authClient.signIn.social({
      provider: provider,
      callbackURL: env.NEXT_PUBLIC_SITE_URL,
    })

    if (response.error) {
      setState(`Error: ${response.error.message}`)
      return
    }

    router.push(response.data.url || '/')
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        isLoading={state === 'githubLoading'}
        disabled={state !== 'idle'}
        onClick={onSocialLogin('github')}
        className="text-xl p-4 h-16"
      >
        <GithubIcon className="fill-current size-7" />
        <span>Github</span>
      </Button>
      <Button
        isLoading={state === 'googleLoading'}
        disabled={state !== 'idle'}
        onClick={onSocialLogin('google')}
        className="text-xl p-4 h-16"
      >
        <GoogleIcon className="fill-current size-7" />
        <span>Google</span>
      </Button>
    </div>
  )
})
