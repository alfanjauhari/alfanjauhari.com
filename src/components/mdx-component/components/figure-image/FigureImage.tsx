import Image, { ImageProps } from 'next/image';

export type FigureImageProps = ImageProps & { caption: string };

export function FigureImage({ caption, alt, ...props }: FigureImageProps) {
  return (
    <figure>
      <div className="w-full h-[12rem] md:h-[25rem] lg:h-[32rem] relative">
        <Image layout="fill" alt={alt} {...props} />
      </div>
      <figcaption className="text-center p-4 bg-gray-50 bottom-0 w-full">
        {caption}
      </figcaption>
    </figure>
  );
}
