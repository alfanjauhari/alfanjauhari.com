import { styled } from '@/theme';

export const StyledButton = styled('button', {
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
          backgroundColor: '$gray8',
          transitionDuration: '300ms',
          color: 'White',
        },
      },
      secondary: {
        backgroundColor: '$gray3',
        color: '$gray9',
        '&:hover': {
          backgroundColor: '$gray2',
          transitionDuration: '300ms',
          color: '$gray9',
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
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
