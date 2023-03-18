import { render, screen } from '@testing-library/react';
import { RestrictedLayout } from './restricted-layout';

describe('RestrictedLayout', () => {
  it('should render successfuly', () => {
    render(
      <RestrictedLayout>
        <section>Hello Section with RestrictedLayout</section>
      </RestrictedLayout>,
    );

    expect(screen.getByText('Hello Section with RestrictedLayout'));
  });
});
