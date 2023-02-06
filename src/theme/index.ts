import { Inter } from '@next/font/google';
import { createStitches } from '@stitches/react';
import { breakpoints } from './breakpoints';
import { utils } from './utils';

const inter = Inter({
  subsets: ['latin'],
});

export const { styled, getCssText } = createStitches({
  theme: {
    space: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
    },
    sizes: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
    },
    fontSizes: {
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '32px',
      xxxl: '48px',
    },
    lineHeights: {
      sm: '20px',
      md: '24px',
      lg: '28px',
      xl: '32px',
      xxl: '36px',
      xxxl: '40px',
    },
    fonts: {
      sans: inter.style.fontFamily,
    },
    colors: {
      gray1: 'rgb(243 244 246)',
      gray2: 'rgb(229 231 235)',
      gray3: 'rgb(209 213 219)',
      gray4: 'rgb(156 163 175)',
      gray5: 'rgb(107 114 128)',
      gray6: 'rgb(75 85 99)',
      gray7: 'rgb(55 65 81)',
      gray8: 'rgb(31 41 55)',
      gray9: 'rgb(17 24 39)',
    },
  },
  utils,
  media: breakpoints,
});
