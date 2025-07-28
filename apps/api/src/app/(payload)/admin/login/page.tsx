import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/libs/auth'
import { getPayload } from '@/libs/payload'

export default async function Login() {
  const authenticated = await auth.api.getSession({
    headers: await headers(),
  })

  if (authenticated) {
    return redirect(authenticated.user.role === 'user' ? '/' : '/admin')
  }

  return (
    <div>
      <h1>Login</h1>
      <p>Please fill out the form to create your first user.</p>

      <form
        action={async (formData: FormData) => {
          'use server'

          const { response } = await auth.api.signInEmail({
            body: {
              email: formData.get('email') as string,
              password: formData.get('password') as string,
            },
            returnHeaders: true,
            asResponse: false,
          })

          const payload = await getPayload()

          const session = await payload.findByID({
            collection: 'users',
            id: response.user.id,
          })

          return redirect(session.role === 'user' ? '/' : '/admin')
        }}
      >
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
