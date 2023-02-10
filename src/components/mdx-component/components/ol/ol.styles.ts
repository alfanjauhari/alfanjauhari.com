import { styled } from '@/theme';

export const StyledOl = styled('ol', {
  my: '$5',
  counterReset: 'custom-counter',
  '& li': {
    counterIncrement: 'custom-counter',
    my: '$2',
    '&:before': {
      content: 'counter(custom-counter) ". "',
      mr: '$2',
      color: '$gray4',
    },
  },
});
