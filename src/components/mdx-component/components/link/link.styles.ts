import { styled } from '@/theme';
import Link from 'next/link';

export const StyledInternalLink = styled(Link, {
  color: '$blue6',
  '&:hover': {
    color: '$blue8',
    transitionDuration: '300ms',
  },
});

export const StyledExternalLink = styled('a', StyledInternalLink);
