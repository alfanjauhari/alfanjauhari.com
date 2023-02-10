import { styled } from '@/theme';
import Image from 'next/image';

export const StyledImage = styled(Image, {
  my: '$5',
  objectFit: 'cover',
});
