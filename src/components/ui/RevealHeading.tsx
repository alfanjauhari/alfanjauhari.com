import { cn } from '@/libs/utils'
import { type HTMLMotionProps, motion } from 'framer-motion'
import { forwardRef } from 'react'

export interface RevealHeadingProps extends HTMLMotionProps<'h1'> {
  sequence?: number
}

export const RevealHeading = forwardRef<HTMLHeadingElement, RevealHeadingProps>(
  ({ className, sequence, ...props }, ref) => {
    return (
      <div className="overflow-y-hidden">
        <motion.h1
          className={cn(
            'text-10xl tracking-wide text-stone-700 font-heading uppercase',
            className,
          )}
          initial={{
            y: '-100%',
          }}
          animate={{
            y: 0,
          }}
          transition={{
            type: 'spring',
            ease: 'easeInOut',
            duration: 0.5,
            delay: sequence ? sequence * 0.5 : 0,
          }}
          {...props}
          ref={ref}
        />
      </div>
    )
  },
)
