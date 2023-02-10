import { styled } from '@/theme';

export const StyledTable = styled('table', {
  my: '$5',
  width: '100%',
  tableLayout: 'fixed',
  borderSpacing: 0,
  '& thead': {
    '& th': {
      py: '$2',
      textAlign: 'start',
      fontSize: '$sm',
      borderBottom: '1px solid $colors$gray3',
      fontWeight: 'normal',
      color: '$gray6',
    },
    '& td': {
      py: '$2',
      borderBottom: '1px solid $colors$gray3',
      fontSize: '$sm',
    },
  },
  '& tbody': {
    width: '100%',
    '& tr': {
      '& td': {
        py: '$2',
        borderBottom: '1px solid $colors$gray3',
        fontSize: '$md',
      },
      '&:nth-child(odd)': {
        backgroundColor: '$gray1',
      },
    },
  },
});
