import {
  motion,
  useAnimation,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from 'framer-motion'
import { forwardRef, type HTMLAttributes, useRef } from 'react'
import { FOOTER_MENU, SOCIAL_MEDIA } from '@/libs/config'

const NAME = 'ALFAN'

export const Footer = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    const textContainerRef = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll()
    const controls = useAnimation()

    const variants: Variants = {
      hidden: { opacity: 0, y: '100%' },
      visible: (i: number) => {
        return {
          opacity: 1,
          y: 0,
          transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: 'easeOut',
          },
        }
      },
    }

    useMotionValueEvent(scrollY, 'change', (latest) => {
      if (textContainerRef.current) {
        const max =
          Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight,
          ) - window.innerHeight

        if (latest >= max) {
          controls.start(() => 'visible')
        } else {
          controls.start(() => 'hidden')
        }
      }
    })

    return (
      <footer
        className="p-6 lg:p-20 overflow-y-clip max-h-[520px]"
        {...props}
        ref={ref}
      >
        <div className="flex flex-col md:flex-row justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-heading text-stone-700 uppercase tracking-wider">
              Alfan Jauhari
            </h1>
            <p>My home, my heaven and my personal digital sanctuary</p>
          </div>
          <div className="flex gap-12 mt-12 md:mt-0">
            {FOOTER_MENU.map((menu) => (
              <div className="space-y-4" key={menu.key}>
                <h1 className="font-heading uppercase text-stone-700 tracking-wider">
                  {menu.name}
                </h1>
                <ul className="space-y-2">
                  {menu.children.map((child) => (
                    <li key={child.href}>
                      <a href={child.href} className="text-stone-700">
                        {child.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="space-y-4">
              <h1 className="font-heading uppercase text-stone-700 tracking-wider">
                Connect with Me
              </h1>
              <ul className="space-y-2">
                {SOCIAL_MEDIA.map((socmed) => (
                  <li key={socmed.href}>
                    <a
                      href={socmed.href}
                      className="text-stone-700"
                      target="_blank"
                    >
                      {socmed.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div
          className="font-heading tracking-widest grid grid-cols-5 mt-12 -mb-12 md:-mb-20 lg:mb-0 md:mt-20"
          ref={textContainerRef}
        >
          {NAME.split('').map((letter, index) => (
            <motion.span
              // biome-ignore lint/suspicious/noArrayIndexKey: Unnecessary unique index
              key={index}
              className="text-[32vw] lg:text-[25vw] italic leading-none text-stone-700"
              custom={index}
              initial={{ opacity: 0, y: '100%' }}
              animate={controls}
              variants={variants}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </footer>
    )
  },
)
