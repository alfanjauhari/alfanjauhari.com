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
    <div className="w-12 h-12 relative">
      <Image src={src} alt={alt} layout="fill" objectFit="cover" {...props} />
    </div>
  );
}
