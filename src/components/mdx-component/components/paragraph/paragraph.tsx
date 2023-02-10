import { HTMLAttributes } from 'react';
import { StyledParagraph } from './paragraph.styles';

export type ParagraphProps = HTMLAttributes<HTMLParagraphElement>;

export function Paragraph(props: ParagraphProps) {
  return <StyledParagraph {...props} />;
}
