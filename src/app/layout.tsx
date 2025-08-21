import type { PropsWithChildren } from 'react'
import '@/styles/global.css'
import type { Metadata } from 'next'
import { Anton, Fira_Code } from 'next/font/google'
import localFont from 'next/font/local'
import { env } from '@/libs/env'
import { cn } from '@/libs/utils'

const antonFont = Anton({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading',
})

const firaCodeFont = Fira_Code({
  display: 'swap',
  variable: '--font-mono',
  subsets: ['latin'],
})

const satoshiFont = localFont({
  src: [
    {
      path: '../assets/fonts/Satoshi-Variable.woff2',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Satoshi-VariableItalic.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Alfan Jauhari',
    template: '%s — Alfan Jauhari',
  },
  description: "Architecting Tomorrow's Digital Landscape",
  openGraph: {
    title: {
      default: 'Alfan Jauhari',
      template: '%s — Alfan Jauhari',
    },
    description: "Architecting Tomorrow's Digital Landscape",
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    site: '/',
    title: {
      default: 'Alfan Jauhari',
      template: '%s — Alfan Jauhari',
    },
    description: "Architecting Tomorrow's Digital Landscape",
  },
  icons: {
    icon: [
      {
        sizes: '16x16',
        url: '/icons/favicon-16x16.png',
      },
      {
        sizes: '32x32',
        url: '/icons/favicon-32x32.png',
      },
      {
        url: '/icons/favicon.ico',
        rel: 'favicon',
      },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={cn(
        'm-0 p-0 scroll-smooth',
        antonFont.variable,
        satoshiFont.variable,
        firaCodeFont.variable,
      )}
    >
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}
