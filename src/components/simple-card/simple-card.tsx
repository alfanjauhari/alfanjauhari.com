import { ComponentProps, forwardRef } from 'react';
import {
  StyledSimpleCard,
  StyledSimpleCardDate,
  StyledSimpleCardTitle,
} from './simple-card.styles';

export type SimpleCardProps = ComponentProps<typeof StyledSimpleCard> & {
  title: string;
  description: string;
  publishedAt: string;
};

export const SimpleCard = forwardRef<HTMLAnchorElement, SimpleCardProps>(
  ({ title, description, publishedAt, ...props }, ref) => {
    return (
      <StyledSimpleCard ref={ref} {...props}>
        <StyledSimpleCardTitle>{title}</StyledSimpleCardTitle>
        <p>{description}</p>
        <StyledSimpleCardDate>{publishedAt}</StyledSimpleCardDate>
      </StyledSimpleCard>
    );
  },
);
