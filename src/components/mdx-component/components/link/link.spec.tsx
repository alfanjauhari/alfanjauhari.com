import { render, screen } from '@testing-library/react';
import { Link } from './link';

describe('MDXComponent/Link', () => {
  it('should render successfully', () => {
    render(<Link href="/">Home</Link>);

    expect(
      screen.getByRole('link', {
        name: 'Home',
      }),
    ).toBeVisible();
  });

  it('should render external link component if href is an external url', () => {
    render(<Link href="https://google.com">Google</Link>);

    expect(
      screen.getByRole('link', {
        name: 'Google',
      }),
    ).toHaveAttribute('target', '_blank');
  });

  it('should match snapshot', () => {
    render(<Link href="/">Home</Link>);

    expect(
      screen.getByRole('link', {
        name: 'Home',
      }),
    ).toMatchSnapshot();
  });
});
