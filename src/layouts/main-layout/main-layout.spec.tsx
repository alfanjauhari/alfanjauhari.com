import { menu } from '@/configs';
import { render, screen, within } from '@testing-library/react';
import { MainLayout } from './main-layout';

describe('MainLayout', () => {
  it('should render successfuly', () => {
    render(
      <MainLayout>
        <section>Hello Section with MainLayout</section>
      </MainLayout>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Alfan Jauhari',
      }),
    );

    expect(screen.getByText('Hello Section with MainLayout'));
  });

  it('should have correct menu items length', () => {
    render(
      <MainLayout>
        <section>Hello Section with MainLayout</section>
      </MainLayout>,
    );

    const listElement = screen.getByRole('list');
    expect(listElement).toBeVisible();

    const listItemsElement = within(listElement).getAllByRole('listitem');
    expect(listItemsElement).toHaveLength(menu.length);
  });
});
