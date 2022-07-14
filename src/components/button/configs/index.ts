import { SizeType, VariantType } from '../types';

export const buttonSizes: Record<SizeType, string> = {
  sm: 'py-2 px-4',
  md: 'py-2 px-6 md:px-8',
  lg: 'py-3 px-6 md:px-8',
};

export const buttonVariants: Record<VariantType, string> = {
  primary:
    'bg-gray-900 shadow text-white hover:bg-opacity-90 hover:text-white duration-300',
  secondary:
    'bg-gray-300 shadow text-gray-900 hover:bg-opacity-90 duration-300',
};

export const baseButtonClassNames =
  'rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600';
