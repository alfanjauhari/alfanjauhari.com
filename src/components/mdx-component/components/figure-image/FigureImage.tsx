import { styled } from '@/theme';
import Image, { ImageProps } from 'next/image';

export type FigureImageProps = ImageProps & { caption: string };

// #region Styled
const StyledFigureImage = styled('figure', {
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
// #endregion Styled

export function FigureImage({ caption, alt, ...props }: FigureImageProps) {
  return (
    <StyledFigureImage>
      <div className="image-wrapper">
        <Image className="image" layout="fill" alt={alt} {...props} />
      </div>
      {caption && <figcaption className="caption">{caption}</figcaption>}
    </StyledFigureImage>
  );
}
