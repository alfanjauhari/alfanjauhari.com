import Image, { ImageProps } from 'next/image';
import { ImgHTMLAttributes } from 'react';

export type AvatarProps = Overwrite<
  ImgHTMLAttributes<HTMLImageElement>,
  ImageProps
>;

export function Avatar({
  src,
  alt = 'Uncaptioned Image',
  ...props
}: AvatarProps) {
  return (
    <Image
      src={src}
      alt={alt}
      className="rounded-full"
      width={40}
      height={40}
      objectFit="cover"
      {...props}
    />
  );
}
