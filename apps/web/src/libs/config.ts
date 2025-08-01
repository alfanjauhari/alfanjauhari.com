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
