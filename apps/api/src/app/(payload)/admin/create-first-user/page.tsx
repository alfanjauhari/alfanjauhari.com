import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/libs/auth'
import { getPayload } from '@/libs/payload'

async function createFirstUser(formData: FormData) {
  'use server'

  const payload = await getPayload()

  const { user } = await auth.api.signUpEmail({
    body: {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    },
  })

  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      role: 'admin',
    },
  })
}

export default async function CreateFirstUser() {
  const authenticated = await auth.api.getSession({
    headers: await headers(),
  })

  if (authenticated) {
    return redirect(authenticated.user.role === 'user' ? '/' : '/admin')
  }

  const payload = await getPayload()
  const usersCount = await payload
    .count({
      collection: 'users',
    })
    .then((res) => res.totalDocs)

  if (usersCount > 0) {
    return redirect('/admin/login')
  }

  return (
    <div>
      <h1>Create First User</h1>
      <p>Please fill out the form to create your first user.</p>

      <form action={createFirstUser}>
        <input type="text" name="name" placeholder="Name" required />
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
