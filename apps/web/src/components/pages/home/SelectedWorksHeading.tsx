import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion'
import {
  type ComponentProps,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { cn } from '@/libs/utils'

// Adjust this value to change the speed/velocity
const VELOCITY = 5

export const SelectedWorksHeading = forwardRef<
  HTMLDivElement,
  ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  const baseX = useMotionValue(0)
  const { scrollYProgress } = useScroll()
  const scrollVelocity = useVelocity(scrollYProgress)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  })

  const [repetitions, setRepetitions] = useState(1)

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const directionFactor = useRef<number>(1)

  const x = useTransform(baseX, (v) => `${wrap(-100 / repetitions, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * VELOCITY * (delta / 1000)

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()

    baseX.set(baseX.get() + moveBy)
  })

  // biome-ignore lint/style/noNonNullAssertion: need to pass container ref to the passed ref from parent
  useImperativeHandle(ref, () => containerRef.current!)

  useEffect(() => {
    const calculateRepetitions = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const textWidth = textRef.current.offsetWidth
        const newRepetitions = Math.ceil(containerWidth / textWidth) + 2

        setRepetitions(newRepetitions)
      }
    }

    calculateRepetitions()

    window.addEventListener('resize', calculateRepetitions)

    return () => window.removeEventListener('resize', calculateRepetitions)
  }, [])

  return (
    <div
      className={cn('w-full overflow-hidden whitespace-nowrap', className)}
      {...props}
      ref={containerRef}
    >
      <motion.div
        className={cn(
          'inline-block text-10xl tracking-wide text-stone-700 font-heading uppercase',
          className,
        )}
        initial={{
          y: '100%',
        }}
        animate={{
          y: '0',
        }}
        transition={{
          type: 'spring',
          ease: 'easeOut',
          duration: 0.5,
        }}
        style={{ x }}
      >
        {Array.from({ length: repetitions }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Unnecessary to use unique id
          <span key={i} ref={i === 0 ? textRef : null}>
            Selected Works{' '}
          </span>
        ))}
      </motion.div>
    </div>
  )
})
