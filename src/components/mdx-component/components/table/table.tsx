import { TableHTMLAttributes } from 'react';
import { StyledTable } from './table.styles';

export type TableProps = TableHTMLAttributes<HTMLTableElement>;

export function Table(props: TableProps) {
  return <StyledTable {...props} />;
}
