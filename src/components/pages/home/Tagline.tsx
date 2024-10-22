import { RevealHeading } from '@/components/ui/RevealHeading'
import { type HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'

const TAGLINE = "Architecting Tomorrow's Digital\nLandscape"

export const Tagline = forwardRef<HTMLHeadingElement, HTMLMotionProps<'h1'>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="grow flex flex-col gap-2 justify-center">
        {TAGLINE.split(' ').map((word, index) => (
          <RevealHeading
            key={word}
            className={className}
            sequence={index}
            ref={ref}
            {...props}
          >
            {word}
          </RevealHeading>
        ))}
      </div>
    )
  },
)
