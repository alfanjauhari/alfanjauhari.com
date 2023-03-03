import { styled } from '@/theme';
import Image from 'next/image';
import Link from 'next/link';

export const StyledPostCard = styled('div');

export const StyledImageWrapper = styled('div', {
  position: 'relative',
  height: '320px',
  width: '100%',
});

export const StyledImage = styled(Image, {
  objectFit: 'cover',
  borderRadius: '4px',
});

export const StyledLinkWrapper = styled('div', {
  mt: '$4',
});

export const StyledLink = styled(Link, {
  fontWeight: 'bold',
  fontSize: '$xl',
});

export const StyledExcerpt = styled('p', {
  mt: '$2',
  color: '$gray7',
});

export const StyledDate = styled('p', {
  mt: '$2',
  fontWeight: '600',
});
