import { render, screen } from '@testing-library/react';
import { Heading } from './heading';

describe('MDXComponent/Heading', () => {
  it('should render successfuly', () => {
    render(<Heading>Heading 1</Heading>);

    expect(
      screen.getByRole('heading', {
        name: 'Heading 1',
      }),
    ).toBeVisible();
  });

  it('should render correct html tag', () => {
    render(<Heading as="h2">Heading 2</Heading>);

    expect(
      screen.getByRole('heading', {
        level: 2,
      }),
    ).toBeVisible();
  });

  it('should match snapshot', () => {
    render(<Heading>Heading 1</Heading>);

    expect(screen.getByRole('heading')).toMatchSnapshot();
  });
});
