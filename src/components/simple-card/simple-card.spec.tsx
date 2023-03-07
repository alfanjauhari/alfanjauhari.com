import { render, screen } from '@testing-library/react';
import { SimpleCard } from './simple-card';

describe('SimpleCard', () => {
  it('should render successfully', () => {
    render(
      <SimpleCard
        description="SimpleCard Description"
        publishedAt="01/01/2023"
        title="SimpleCard Title"
        href="/"
      />,
    );

    expect(screen.getByText('SimpleCard Description')).toBeVisible();
    expect(screen.getByText('SimpleCard Title')).toBeVisible();
  });
});
