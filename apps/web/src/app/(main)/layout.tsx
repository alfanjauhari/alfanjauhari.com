import type { PropsWithChildren } from 'react'
import { Footer } from '@/components/ui/Footer'
import { Header } from '@/components/ui/Header'
import { SandpackCSS } from '@/components/ui/SandpackCSS'

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <SandpackCSS />
      <Header />
      <main className="px-6">{children}</main>
      <Footer />
    </>
  )
}
