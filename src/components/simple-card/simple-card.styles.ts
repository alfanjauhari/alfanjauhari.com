import { styled } from '@/theme';
import Link from 'next/link';

export const StyledSimpleCard = styled(Link, {
  border: '1px solid $colors$gray2',
  p: '$4',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  '&:hover': {
    color: '$gray9',
    backgroundColor: '$gray1',
  },
});

export const StyledSimpleCardTitle = styled('h1', {
  fontWeight: 600,
});

export const StyledSimpleCardDate = styled('p', {
  fontSize: '$sm',
  color: '$gray8',
});
