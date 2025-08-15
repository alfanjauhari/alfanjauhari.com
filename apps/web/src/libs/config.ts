import { createEnv } from '@t3-oss/env-nextjs'
import z from 'zod'
import BAKTIDNAImage from '@/assets/projects/BAKTI-DNA.png'
import GCBCImage from '@/assets/projects/GCBC.png'
import MichelleOhImage from '@/assets/projects/Michelle-Oh.png'
import TempeaImage from '@/assets/projects/Tempea.png'
import ZOGWebsiteImage from '@/assets/projects/ZOG-Website.png'

export const NAVIGATION_MENU = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'About',
    href: '/about',
  },
  {
    name: 'Updates',
    href: '/updates',
  },
  {
    name: 'Snippets',
    href: '/snippets',
  },
]

export const FOOTER_MENU = [
  {
    name: 'Explore',
    key: 'explore',
    children: [
      {
        name: 'About',
        href: '/about',
      },
      {
        name: 'Updates',
        href: '/updates',
      },
      {
        name: 'Uses',
        href: '/uses',
      },
    ],
  },
]

export const PROJECTS = [
  {
    name: 'Zero One Group Website',
    year: '2024',
    role: 'Product Engineer',
    stacks: [
      'Next JS',
      'TypeScript',
      'Tailwind CSS',
      'Three.js',
      'Framer Motion',
    ],
    image: ZOGWebsiteImage,
    link: 'https://zero-one-group.com',
  },
  {
    name: 'Global Capacity Building Coalition',
    year: '2024',
    role: 'Product Engineer',
    stacks: ['Full Stack Next JS', 'TypeScript', 'Tailwind CSS'],
    image: GCBCImage,
    link: 'https://capacity-building.org',
  },
  {
    name: 'Tempea',
    year: '2024',
    role: 'Product Engineer',
    stacks: ['Wordpress'],
    image: TempeaImage,
  },
  {
    name: 'Michelle Oh Jewelry',
    year: '2023',
    role: 'Product Engineer',
    stacks: ['Shopify'],
    image: MichelleOhImage,
    link: 'https://michelle-oh.com/',
  },
  {
    name: 'BAKTI DNA',
    year: '2022',
    role: 'Product Engineer',
    stacks: ['Nx', 'Next JS', 'TypeScript', 'Chakra UI'],
    image: BAKTIDNAImage,
  },
]

export const SOCIAL_MEDIA = [
  {
    name: 'GitHub',
    href: '/github',
  },
  {
    name: 'LinkedIn',
    href: '/linkedin',
  },
  {
    name: 'Twitter/X',
    href: '/x',
  },
  {
    name: 'Instagram',
    href: '/instagram',
  },
  {
    name: 'Facebook',
    href: '/fb',
  },
]

export const env = createEnv({
  server: {
    SENTRY_AUTH_TOKEN: z.string().min(1, 'SENTRY_AUTH_TOKEN is required'),
    SENTRY_DSN: z.string().min(1, 'SENTRY_DSN is required'),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().min(1, 'NEXT_PUBLIC_SITE_URL is required'),
    NEXT_PUBLIC_CDN_URL: z.string().min(1, 'NEXT_PUBLIC_CDN_URL is required'),
  },
  runtimeEnv: {
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,

    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
  },
})
