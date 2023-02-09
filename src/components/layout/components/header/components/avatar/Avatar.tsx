import { styled } from '@/theme';
import Image, { ImageProps } from 'next/image';
import { ImgHTMLAttributes } from 'react';

export type AvatarProps = Overwrite<
  ImgHTMLAttributes<HTMLImageElement>,
  ImageProps
>;

// #region Styled
const StyledAvatarWrapper = styled('div', {
  width: '48px',
  height: '48px',
  position: 'relative',
});
// #endregion Styled

export function Avatar({
  src,
  alt = 'Uncaptioned Image',
  ...props
}: AvatarProps) {
  return (
    <StyledAvatarWrapper>
      <Image src={src} alt={alt} fill {...props} />
    </StyledAvatarWrapper>
  );
}
