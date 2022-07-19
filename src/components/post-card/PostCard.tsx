import Image from 'next/image';
import Link from 'next/link';
import { forwardRef, HTMLAttributes } from 'react';

export type PostCardProps = HTMLAttributes<HTMLDivElement> &
  Omit<PostType, 'description' | 'category'>;

export const PostCard = forwardRef<HTMLDivElement, PostCardProps>(
  ({ thumbnail, title, excerpt, slug, publishedAt, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        <div className="relative h-[320px] w-full">
          <Image
            src={thumbnail}
            alt={title}
            height={320}
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>
        <div className="mt-4">
          <Link href={slug} passHref>
            <a className="font-bold text-xl">{title}</a>
          </Link>
        </div>
        <p className="mt-2 text-gray-700">{excerpt}</p>
        <p className="mt-2 font-semibold">
          Published at :{' '}
          {new Date(publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    );
  },
);
