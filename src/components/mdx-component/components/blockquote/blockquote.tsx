import { BlockquoteHTMLAttributes } from 'react';
import { StyledBlockQuote } from './blockquote.styles';

export type BlockquoteProps = BlockquoteHTMLAttributes<HTMLElement>;

export function Blockquote(props: BlockquoteProps) {
  return <StyledBlockQuote {...props} />;
}
