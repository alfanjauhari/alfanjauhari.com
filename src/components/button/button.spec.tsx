import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('should render successfuly', () => {
    render(<Button>Hello Button</Button>);

    expect(
      screen.getByRole('button', {
        name: 'Hello Button',
      }),
    ).toBeVisible();
  });

  it('should can properly run onClick event', async () => {
    const mockOnClick = jest.fn();

    render(<Button onClick={mockOnClick}>Hello Button</Button>);

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Hello Button',
      }),
    );

    expect(mockOnClick).toBeCalled();
  });
});
