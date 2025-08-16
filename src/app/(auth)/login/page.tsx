import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/pages/auth/LoginForm'
import { auth } from '@/libs/auth'

export interface LoginPageProps {
  searchParams: Promise<{
    [search: string]: string | undefined
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo } = await searchParams

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.session) {
    return redirect(redirectTo || '/')
  }

  return <LoginForm />
}
