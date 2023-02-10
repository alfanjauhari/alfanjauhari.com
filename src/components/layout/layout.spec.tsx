import { menu } from '@/configs';
import { render, screen, within } from '@testing-library/react';
import { Layout } from './layout';

describe('Layout', () => {
  it('should render successfuly', () => {
    render(
      <Layout>
        <section>Hello Section with Layout</section>
      </Layout>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Alfan Jauhari',
      }),
    );

    expect(screen.getByText('Hello Section with Layout'));
  });

  it('should have correct menu items length', () => {
    render(
      <Layout>
        <section>Hello Section with Layout</section>
      </Layout>,
    );

    const listElement = screen.getByRole('list');
    expect(listElement).toBeVisible();

    const listItemsElement = within(listElement).getAllByRole('listitem');
    expect(listItemsElement).toHaveLength(menu.length);
  });
});
