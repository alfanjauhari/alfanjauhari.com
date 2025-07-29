import Button from '@/components/base/Button'
import { auth } from '@/libs/auth'

export function ProvidersLogin() {
  console.log('ENV', import.meta.env.PUBLIC_PAYLOAD_API_URL)
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() =>
          auth.signIn.social({
            provider: 'github',
            callbackURL: import.meta.env.SITE_URL,
          })
        }
        className="text-xl p-4"
      >
        Github
      </Button>
      <Button
        onClick={() =>
          auth.signIn.social({
            provider: 'google',
            callbackURL: import.meta.env.SITE_URL,
          })
        }
        className="text-xl p-4"
      >
        Google
      </Button>
    </div>
  )
}
