import { render, screen } from '@testing-library/react';
import { PostCard } from './post-card';

describe('PostCard', () => {
  it('should render successfully', () => {
    render(
      <PostCard
        excerpt="PostCard Excerpt"
        publishedAt="01/01/2023"
        slug="/"
        thumbnail="/images/blog-image.png"
        title="PostCard Title"
      />,
    );

    expect(screen.getByText('PostCard Excerpt')).toBeVisible();
    expect(screen.getByText('PostCard Title')).toBeVisible();
  });
});
