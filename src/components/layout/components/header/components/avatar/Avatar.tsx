import { SizeType } from '@/components/button/types';
import clsx from 'clsx';
import Image, { ImageProps } from 'next/image';
import { ImgHTMLAttributes } from 'react';

export type AvatarProps = Overwrite<
  ImgHTMLAttributes<HTMLImageElement>,
  ImageProps
> & {
  size?: SizeType;
};

export function Avatar({
  src,
  alt = 'Uncaptioned Image',
  size = 'md',
  ...props
}: AvatarProps) {
  const avatarSizes: Record<SizeType, string> = {
    sm: 'h-2 w-2',
    md: 'h-4 w-4',
    lg: 'h-10 w-10',
  };

  return (
    <Image
      src={src}
      alt={alt}
      className={clsx(avatarSizes[size], 'rounded-full')}
      width={80}
      height={80}
      {...props}
    />
  );
}
