import { HTMLAttributes } from 'react';

export type HrProps = HTMLAttributes<HTMLHRElement>;

export function Hr(props: HrProps) {
  return <hr className="border-gray-400" {...props} />;
}
