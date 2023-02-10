import { styled } from '@/theme';

export const StyledH1 = styled('h1', {
  fontSize: '$xxxl',
  lineHeight: 1.13,
  fontWeight: 'bold',
  my: '$5',
});

export const StyledH2 = styled('h2', StyledH1, {
  fontSize: '$xxl',
  lineHeight: 1.1,
});

export const StyledH3 = styled('h3', StyledH1, {
  fontSize: '$xl',
  lineHeight: 1,
});

export const StyledH4 = styled('h4', StyledH3, {
  fontSize: '$lg',
});

export const StyledH5 = styled('h5', StyledH3, {
  fontSize: '$md',
});

export const StyledH6 = styled('h6', StyledH5, {
  fontSize: '$md',
  fontWeight: 'normal',
});
