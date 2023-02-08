import { styled } from '@/theme';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { OlHTMLAttributes } from 'react';
import { BlogLink, FigureImageProps, Hr } from './components';

const FigureImage = dynamic<FigureImageProps>(() =>
  import('./components').then((res) => res.FigureImage),
);

// #region Styled
const StyledParagraph = styled('p', {
  my: '$5',
});

const StyledH1 = styled('h1', {
  fontSize: '$xxxl',
  lineHeight: 1.13,
  fontWeight: 'bold',
  my: '$5',
});

const StyledH2 = styled('h2', StyledH1, {
  fontSize: '$xxl',
  lineHeight: 1.1,
});

const StyledH3 = styled('h3', StyledH1, {
  fontSize: '$xl',
  lineHeight: 1,
});

const StyledH4 = styled('h4', StyledH3, {
  fontSize: '$lg',
});

const StyledH5 = styled('h5', StyledH3, {
  fontSize: '$md',
});

const StyledH6 = styled('h6', StyledH5, {
  fontSize: '$md',
  fontWeight: 'normal',
});

const StyledUl = styled('ul', {
  my: '$5',
  listStyleType: 'disc',
  pl: '$4',
  '& li': {
    my: '$2',
    pl: '$2',
    '&::marker': {
      color: '$gray4',
    },
  },
});

const StyledBlockQuote = styled('blockquote', {
  fontStyle: 'italic',
  color: '$gray9',
  borderLeft: '2px solid $colors$gray4',
  my: '$5',
  pl: '$4',
});

const StyledOl = styled('ol', {
  my: '$5',
  counterReset: 'custom-counter',
  '& li': {
    counterIncrement: 'custom-counter',
    my: '$2',
    '&:before': {
      content: 'counter(custom-counter) ". "',
      mr: '$2',
      color: '$gray4',
    },
  },
});

const StyledPre = styled('pre', {
  my: '$5',
  backgroundColor: '$gray1',
  overflowX: 'auto',
  fontSize: '14px',
  lineHeight: 1.7,
  p: '$4',
  borderRadius: '5px',
});

const StyledTable = styled('table', {
  my: '$5',
  width: '100%',
  tableLayout: 'fixed',
  borderSpacing: 0,
  '& thead': {
    '& th': {
      py: '$2',
      textAlign: 'start',
      fontSize: '$sm',
      borderBottom: '1px solid $colors$gray3',
      fontWeight: 'normal',
      color: '$gray6',
    },
    '& td': {
      py: '$2',
      borderBottom: '1px solid $colors$gray3',
      fontSize: '$sm',
    },
  },
  '& tbody': {
    width: '100%',
    '& tr': {
      '& td': {
        py: '$2',
        borderBottom: '1px solid $colors$gray3',
        fontSize: '$md',
      },
      '&:nth-child(odd)': {
        backgroundColor: '$gray1',
      },
    },
  },
});

const StyledImage = styled(Image, {
  my: '$5',
  objectFit: 'cover',
});
// #endregion Styled

const MDXComponent = {
  a: BlogLink,
  FigureImage,
  hr: Hr,
  p: StyledParagraph,
  ul: StyledUl,
  h1: StyledH1,
  h2: StyledH2,
  h3: StyledH3,
  h4: StyledH4,
  h5: StyledH5,
  h6: StyledH6,
  blockquote: StyledBlockQuote,
  table: StyledTable,
  pre: StyledPre,
  Image: StyledImage,
  ol: ({ start, ...props }: OlHTMLAttributes<HTMLOListElement>) => (
    <StyledOl
      css={{
        counterSet: `custom-counter ${start ? start - 1 : 0}`,
      }}
      {...props}
    />
  ),
};

export default MDXComponent;
