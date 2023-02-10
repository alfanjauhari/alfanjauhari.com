import { render, screen } from '@testing-library/react';
import { ButtonLink } from './button-link';

describe('ButtonLink', () => {
  it('should render successfuly', () => {
    render(<ButtonLink href="/">Hello Button Link</ButtonLink>);

    expect(
      screen.getByRole('link', {
        name: 'Hello Button Link',
      }),
    ).toBeVisible();
  });

  it('should have correct href value', () => {
    const href = '/blog';

    render(<ButtonLink href={href}>Hello Button Link</ButtonLink>);

    expect(
      screen.getByRole('link', {
        name: 'Hello Button Link',
      }),
    ).toHaveAttribute('href', href);
  });
});
