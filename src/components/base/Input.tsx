import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/libs/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          'w-full outline-none p-2 border border-stone-300 focus-visible:ring-stone-400 focus-visible:ring-[2px]',
          className,
        )}
        {...props}
        ref={ref}
      />
    )
  },
)
