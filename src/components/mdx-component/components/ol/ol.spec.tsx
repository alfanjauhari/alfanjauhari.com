import { render, screen } from '@testing-library/react';
import { Ol } from './ol';

describe('MDXComponent/Ol', () => {
  it('should render successfuly', () => {
    render(
      <Ol>
        <li>First Item</li>
        <li>Second Item</li>
      </Ol>,
    );

    expect(screen.getByRole('list')).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('should match snapshot', () => {
    render(
      <Ol>
        <li>First Item</li>
        <li>Second Item</li>
      </Ol>,
    );

    expect(screen.getByRole('list')).toMatchSnapshot();
  });
});
