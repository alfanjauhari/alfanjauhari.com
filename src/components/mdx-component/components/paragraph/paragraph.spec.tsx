import { render, screen } from '@testing-library/react';
import { Paragraph } from './paragraph';

describe('MDXComponent/Paragraph', () => {
  it('should render successfuly', () => {
    render(<Paragraph>Paragraph</Paragraph>);

    expect(screen.getByText('Paragraph')).toBeVisible();
  });

  it('should match snapshot', () => {
    render(<Paragraph>Paragraph</Paragraph>);

    expect(screen.getByText('Paragraph')).toMatchSnapshot();
  });
});
