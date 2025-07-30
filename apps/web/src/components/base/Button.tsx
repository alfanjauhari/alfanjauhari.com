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
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, disabled, ...props }, ref) => (
    <button
      className={cn(
        'p-6 border border-stone-300 relative after:bg-white after:absolute after:inset-0 after:-translate-y-full after:duration-300 hover:after:translate-y-0 overflow-hidden bg-stone-700 outline-none text-white font-heading uppercase tracking-wider text-xl hover:text-stone-700 w-full cursor-pointer focus-visible:ring-stone-400 focus-visible:ring-[2px]',
        {
          'opacity-80 pointer-events-none': isLoading,
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
  ),
)

export default Button
