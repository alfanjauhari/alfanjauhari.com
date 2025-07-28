import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/libs/utils'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

export const Button: React.FC<Props> = ({ className, children, ...props }) => (
  <button
    className={cn(
      'p-6 border border-stone-300 relative after:bg-white after:absolute after:inset-0 after:-translate-y-full after:duration-300 hover:after:translate-y-0 overflow-hidden bg-stone-700 text-white font-heading uppercase tracking-wider text-xl hover:text-stone-700 w-full cursor-pointer',
      className,
    )}
    {...props}
  >
    <div className="z-10 relative">{children}</div>
  </button>
)

export default Button
