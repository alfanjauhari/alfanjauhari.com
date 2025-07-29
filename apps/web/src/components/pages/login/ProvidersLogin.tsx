import Button from '@/components/base/Button'
import { auth } from '@/libs/auth'

export function ProvidersLogin() {
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => {
          throw new Error('GitHub login is not supported yet')
        }}
        className="text-xl p-4"
      >
        Github
      </Button>
      <Button
        onClick={() =>
          auth.signIn.social({
            provider: 'google',
            callbackURL: import.meta.env.PUBLIC_SITE_URL,
          })
        }
        className="text-xl p-4"
      >
        Google
      </Button>
    </div>
  )
}
