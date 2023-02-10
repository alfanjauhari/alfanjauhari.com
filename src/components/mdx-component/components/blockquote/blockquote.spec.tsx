import { render, screen } from '@testing-library/react';
import { Blockquote } from './blockquote';

describe('MDXComponent/Blockquote', () => {
  it('should render successfuly', () => {
    render(
      <Blockquote data-testid="blockquote-component">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        vero error culpa, ut voluptate, asperiores doloremque nam autem neque
        rem voluptatibus vitae reiciendis doloribus odio libero quos esse
        provident numquam?
      </Blockquote>,
    );

    expect(screen.getByTestId('blockquote-component')).toBeVisible();
  });

  it('should match snapshot', () => {
    render(
      <Blockquote data-testid="blockquote-component">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        vero error culpa, ut voluptate, asperiores doloremque nam autem neque
        rem voluptatibus vitae reiciendis doloribus odio libero quos esse
        provident numquam?
      </Blockquote>,
    );

    expect(screen.getByTestId('blockquote-component')).toMatchSnapshot();
  });
});
