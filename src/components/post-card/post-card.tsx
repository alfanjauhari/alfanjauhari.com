import { ComponentProps, forwardRef } from 'react';
import {
  StyledDate,
  StyledExcerpt,
  StyledImage,
  StyledImageWrapper,
  StyledLink,
  StyledLinkWrapper,
  StyledPostCard,
} from './post-card.styles';

export type PostCardProps = ComponentProps<typeof StyledPostCard> &
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
