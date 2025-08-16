import type { PropsWithChildren } from 'react'
import '@/styles/fonts.css'
import '@/styles/global.css'
import type { Metadata } from 'next'
import { env } from '@/libs/config'

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
    <html lang="en" className="m-0 p-0 scroll-smooth">
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}
