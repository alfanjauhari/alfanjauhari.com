import { createStitches } from '@stitches/react';
import { breakpoints } from './breakpoints';
import { globalStyles } from './global-styles';
import { utils } from './utils';

export const { styled, getCssText, config, globalCss } = createStitches({
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
      xxl: '24px',
      xxxl: '30px',
    },
    lineHeights: {
      sm: '20px',
      md: '24px',
      lg: '28px',
      xl: '32px',
      xxl: '36px',
      xxxl: '40px',
    },
    colors: {
      gray1: '#f9fafb',
      gray2: '#f3f4f6',
      gray3: '#e5e7eb',
      gray4: '#d1d5db',
      gray5: '#9ca3af',
      gray6: '#6b7280',
      gray7: '#4b5563',
      gray8: '#374151',
      gray9: '#1f2937',
      blue1: '#eff6ff',
      blue2: '#dbeafe',
      blue3: '#bfdbfe',
      blue4: '#93c1fd',
      blue5: '#60a3fa',
      blue6: '#3b8df6',
      blue7: '#257ceb',
      blue8: '#1d6fd8',
      blue9: '#1e5daf',
    },
    fonts: {
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)',
    },
  },
  utils,
  media: breakpoints,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalCSS = (...styles: Record<string, any>[]) =>
  globalCss(globalStyles, ...styles);
