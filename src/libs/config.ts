import GCBCImage from '@/assets/projects/GCBC.png'
import TempeaImage from '@/assets/projects/Tempea.png'
import MichelleOhImage from '@/assets/projects/Michelle-Oh.png'
import BAKTIDNAImage from '@/assets/projects/BAKTI-DNA.png'

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
    name: 'Blog',
    href: '/blog',
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
        name: 'Blog',
        href: '/blog',
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
    name: 'Global Capacity Building Coalition',
    year: '2024',
    role: 'Product Engineer',
    stacks: ['Full Stack Next JS', 'TypeScript', 'Tailwind CSS'],
    image: GCBCImage,
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
    href: 'https://github.com/alfanjauhari',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/m-alfanjauhari',
  },
  {
    name: 'Twitter/X',
    href: 'https://x.com/alfanjauhari_',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/alfanjauhari_',
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/m.alfanjauhari',
  },
]
