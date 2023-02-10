import { render, screen } from '@testing-library/react';
import { Image } from './image';

describe('MDXComponent/Image', () => {
  it('should render successfuly', () => {
    render(<Image alt="Title" src="/images/icon.webp" fill />);

    expect(screen.getByRole('img')).toBeVisible();
  });

  it('should match snapshot', () => {
    render(<Image alt="Title" src="/images/icon.webp" fill />);

    expect(screen.getByRole('img')).toMatchSnapshot();
  });
});
