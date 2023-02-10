import Image, { ImageProps } from 'next/image';
import { StyledFigureImage } from './figure-image.styles';

export type FigureImageProps = ImageProps & {
  caption?: string;
};

export function FigureImage({ caption, ...props }: FigureImageProps) {
  return (
    <StyledFigureImage>
      <div className="image-wrapper">
        <Image className="image" fill {...props} />
      </div>
      {caption && <figcaption className="caption">{caption}</figcaption>}
    </StyledFigureImage>
  );
}
