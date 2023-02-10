import { styled } from '@/theme';

export const StyledFigureImage = styled('figure', {
  my: '$5',
  '& div.image-wrapper': {
    width: '100%',
    height: '192px',
    position: 'relative',
    '& img.image': {
      objectFit: 'cover',
      borderTopLeftRadius: '5px',
      borderTopRightRadius: '5px',
    },
    '@md': {
      height: '400px',
    },
    '@lg': {
      height: '512px',
    },
  },
  '& figcaption.caption': {
    textAlign: 'center',
    p: '$4',
    backgroundColor: '$gray2',
    bottom: 0,
    width: '100%',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
});
