import { render, screen } from '@testing-library/react';
import { Hr } from './hr';

describe('MDXComponent/Hr', () => {
  it('should render successfuly', () => {
    render(<Hr data-testid="hr-component" />);

    expect(screen.getByTestId('hr-component')).toBeVisible();
  });

  it('should match snapshot', () => {
    render(<Hr data-testid="hr-component" />);

    expect(screen.getByTestId('hr-component')).toMatchSnapshot();
  });
});
