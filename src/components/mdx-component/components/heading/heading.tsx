import { HTMLAttributes } from 'react';
import {
  StyledH1,
  StyledH2,
  StyledH3,
  StyledH4,
  StyledH5,
  StyledH6,
} from './heading.styles';

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export function Heading({ as = 'h1', ...props }: HeadingProps) {
  const components = {
    h1: StyledH1,
    h2: StyledH2,
    h3: StyledH3,
    h4: StyledH4,
    h5: StyledH5,
    h6: StyledH6,
  };

  const HeadingComponent = components[as];

  return <HeadingComponent {...props} />;
}
