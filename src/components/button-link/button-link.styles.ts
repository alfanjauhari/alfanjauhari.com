import { styled } from '@/theme';
import Link from 'next/link';
import { StyledButton } from '../button';

export const StyledButtonLink = styled(Link, StyledButton, {
  variants: {
    variant: {
      primary: {
        '&:hover': {
          color: 'White',
        },
      },
      secondary: {
        '&:hover': {
          color: '$gray9',
        },
      },
    },
  },
});
