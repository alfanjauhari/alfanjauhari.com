import { render, screen } from '@testing-library/react';
import { FigureImage } from './figure-image';

describe('MDXComponent/FigureImage', () => {
  it('should render successfuly', () => {
    render(<FigureImage alt="Title" src="/images/icon.webp" />);

    expect(screen.getByRole('img')).toBeVisible();
  });

  it('should match snapshot', () => {
    render(<FigureImage alt="Title" src="/images/icon.webp" />);

    expect(screen.getByRole('img')).toMatchSnapshot();
  });
});
