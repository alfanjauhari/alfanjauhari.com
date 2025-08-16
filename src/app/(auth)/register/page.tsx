import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { RegisterForm } from '@/components/pages/auth/RegisterForm'
import { auth } from '@/libs/auth'

export interface RegisterPageProps {
  searchParams: Promise<{
    [search: string]: string | string[] | undefined
  }>
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { redirectTo } = await searchParams

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.session) {
    return redirect(typeof redirectTo === 'string' ? redirectTo : '/')
  }

  return <RegisterForm />
}
