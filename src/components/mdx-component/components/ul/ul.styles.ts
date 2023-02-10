import { styled } from '@/theme';

export const StyledUl = styled('ul', {
  my: '$5',
  listStyleType: 'disc',
  pl: '$4',
  '& li': {
    my: '$2',
    pl: '$2',
    '&::marker': {
      color: '$gray4',
    },
  },
});
