import { render, screen } from '@testing-library/react';
import { Ul } from './ul';

describe('MDXComponent/Ul', () => {
  it('should render successfuly', () => {
    render(
      <Ul>
        <li>List Item 1</li>
        <li>List Item 2</li>
      </Ul>,
    );

    expect(screen.getByRole('list')).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('should match snapshot', () => {
    render(
      <Ul>
        <li>List Item 1</li>
        <li>List Item 2</li>
      </Ul>,
    );

    expect(screen.getByRole('list')).toMatchSnapshot();
  });
});
