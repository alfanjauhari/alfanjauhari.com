import { styled } from '@/theme';
import { ComponentProps } from 'react';

export const Button = styled('button', {
  borderRadius: '4px',
  '&:focus': {
    outline: 'none',
    boxShadow: 'inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$gray8',
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: '$gray9',
        color: 'White',
        '&:hover': {
          backgroundColor: '$gray7',
          transitionDuration: '300ms',
        },
      },
      secondary: {
        backgroundColor: '$gray3',
        color: '$gray9',
        '&:hover': {
          backgroundColor: '$gray2',
          transitionDuration: '300ms',
        },
      },
    },
    size: {
      sm: {
        py: '$2',
        px: '$4',
      },
      md: {
        py: '$2',
        px: '$6',
        '@md': {
          px: '$8',
        },
      },
      lg: {
        py: '$3',
        px: '$6',
        '@md': {
          px: '$8',
        },
      },
    },
  },
});

export type ButtonProps = ComponentProps<typeof Button>;
