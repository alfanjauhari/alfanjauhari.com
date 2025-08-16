import { Loader2 } from 'lucide-react'
import {
  type ButtonHTMLAttributes,
  forwardRef,
  type PropsWithChildren,
} from 'react'
import { cn } from '@/libs/utils'

export interface ButtonProps
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  isLoading?: boolean
  inverted?: boolean
  asChild?: boolean
}

export const buttonClassName =
  'p-6 border border-stone-300 relative after:bg-white after:absolute after:inset-0 after:-translate-y-full after:duration-300 hover:after:translate-y-0 overflow-hidden bg-stone-700 outline-none text-white font-heading uppercase tracking-wider text-xl hover:text-stone-700 w-full cursor-pointer focus-visible:ring-stone-400 focus-visible:ring-[2px]'

export const buttonClassNameInverted =
  'bg-white after:bg-stone-700 text-stone-700 hover:text-white after:translate-y-full hover:after:translate-y-0'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, children, isLoading, disabled, inverted, asChild, ...props },
    ref,
  ) => {
    return (
      <button
        className={cn(
          buttonClassName,
          {
            'opacity-80 pointer-events-none': isLoading,
            [buttonClassNameInverted]: inverted,
          },
          className,
        )}
        disabled={isLoading || disabled}
        {...props}
        ref={ref}
      >
        <div className="z-10 relative flex items-center gap-2 justify-center">
          {isLoading ? <Loader2 className="animate-spin size-7" /> : children}
        </div>
      </button>
    )
  },
)

export default Button
