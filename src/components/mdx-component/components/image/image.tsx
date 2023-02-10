import { ComponentProps } from 'react';
import { StyledImage } from './image.styles';

export type ImageProps = ComponentProps<typeof StyledImage>;

export function Image(props: ImageProps) {
  return <StyledImage {...props} />;
}
