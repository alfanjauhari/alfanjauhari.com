import { render, screen } from '@testing-library/react';
import { Table } from './table';

describe('MDXComponent/Table', () => {
  it('should render successfuly', () => {
    render(
      <Table>
        <thead>
          <tr>
            <th>Column 1</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1</td>
          </tr>
        </tbody>
      </Table>,
    );

    expect(screen.getByRole('table')).toBeVisible();
  });

  it('should match snapshot', () => {
    render(
      <Table>
        <thead>
          <tr>
            <th>Column 1</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1</td>
          </tr>
        </tbody>
      </Table>,
    );

    expect(screen.getByRole('table')).toMatchSnapshot();
  });
});
