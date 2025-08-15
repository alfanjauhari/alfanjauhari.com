import type { PropsWithChildren } from 'react'
import { Footer } from '@/components/ui/Footer'
import { Header } from '@/components/ui/Header'

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="px-6">{children}</main>
      <Footer />
    </>
  )
}
