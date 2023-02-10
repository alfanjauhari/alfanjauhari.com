import { render, screen } from '@testing-library/react';
import { Pre } from './pre';

describe('MDXComponent/Pre', () => {
  it('should render successfuly', () => {
    render(<Pre data-testid="pre-component" />);

    expect(screen.getByTestId('pre-component')).toBeVisible();
  });

  it('should match snapshot', () => {
    render(<Pre data-testid="pre-component" />);

    expect(screen.getByTestId('pre-component')).toMatchSnapshot();
  });
});
