import { styled } from '@/theme';
import { BlogLink, FigureImage, Hr } from './components';

const StyledParagraph = styled('p', {
  my: '20px',
  ':where(p > :first-child)': {
    marginTop: 0,
  },
});

const MDXComponent = {
  a: BlogLink,
  FigureImage,
  Hr,
  p: StyledParagraph,
};

export default MDXComponent;
