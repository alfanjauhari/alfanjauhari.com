import { styled } from '@/theme';
import Image from 'next/image';
import Link from 'next/link';
import { forwardRef, HTMLAttributes } from 'react';

// #region Styled
const StyledImageWrapper = styled('div', {
  position: 'relative',
  height: '320px',
  width: '100%',
});

const StyledImage = styled(Image, {
  objectFit: 'cover',
  borderRadius: '4px',
});

const StyledLinkWrapper = styled('div', {
  mt: '$4',
});

const StyledLink = styled(Link, {
  fontWeight: 'bold',
  fontSize: '$xl',
});

const StyledExcerpt = styled('p', {
  mt: '$2',
  color: '$gray7',
});

const StyledDate = styled('p', {
  mt: '$2',
  fontWeight: '600',
});
// #endregion Styled

export type PostCardProps = HTMLAttributes<HTMLDivElement> &
  Omit<PostType, 'description' | 'category'>;

export const PostCard = forwardRef<HTMLDivElement, PostCardProps>(
  ({ thumbnail, title, excerpt, slug, publishedAt, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        <StyledImageWrapper>
          <StyledImage src={thumbnail} alt={title} fill />
        </StyledImageWrapper>
        <StyledLinkWrapper>
          <StyledLink href={slug}>{title}</StyledLink>
        </StyledLinkWrapper>
        <StyledExcerpt>{excerpt}</StyledExcerpt>
        <StyledDate>Published at : {publishedAt}</StyledDate>
      </div>
    );
  },
);
