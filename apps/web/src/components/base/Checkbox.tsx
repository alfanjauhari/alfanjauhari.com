import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { cn } from '@/libs/utils'

export const Checkbox = forwardRef<
  HTMLButtonElement,
  CheckboxPrimitive.CheckboxProps
>(({ className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer border-stone-300 data-[state=checked]:bg-stone-700 data-[state=checked]:text-stone-300 data-[state=checked]:border-stone-700 focus-visible:border-stone-700 aria-invalid:ring-red-600 aria-invalid:border-red-600 size-4 shrink-0 border outline-none focus-visible:ring-[2px] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
      ref={ref}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
