import { type ComponentProps, forwardRef, type ReactNode } from 'react'
import { cn } from '@/libs/utils'

export interface MainSingleLayoutProps extends ComponentProps<'div'> {
  title: string
  description: string
  tag?: string
  date?: Date
  toc?: ReactNode
}

export const MainSingleLayout = forwardRef<
  HTMLDivElement,
  MainSingleLayoutProps
>(({ title, description, tag, date, children, toc, ...props }, ref) => {
  return (
    <div
      className={cn(
        'py-20 flex flex-col items-center max-w-(--breakpoint-lg) mx-auto',
        {
          'min-lg:max-w-(--breakpoint-xl)': toc,
        },
      )}
      ref={ref}
      {...props}
    >
      {(tag || date) && (
        <div className="flex items-center gap-2">
          <a
            href={`/blog/tag/${tag}`}
            className="bg-stone-700 text-white font-semibold p-2 w-fit text-sm"
          >
            {tag}
          </a>
          <span>&mdash;</span>
          <p className="text-stone-700 text-sm">
            {Intl.DateTimeFormat('en-ID', {
              dateStyle: 'medium',
            }).format(date)}
          </p>
        </div>
      )}
      <div className="mt-4 space-y-4 w-full border-b border-b-stone-300 pb-4">
        <h1 className="font-heading text-5xl lg:text-7xl leading-tight! text-stone-700 text-center">
          {title}
        </h1>
        <p className="text-center italic">{description}</p>
      </div>

      <div
        id="single-content-wrapper"
        className={cn('mt-12', {
          'min-lg:grid min-lg:grid-cols-[3fr_1fr] min-lg:gap-6': toc,
        })}
      >
        <article
          id="single-content"
          className="mx-auto w-full max-w-full prose prose-stone prose-pre:[tab-size:2] prose-a:decoration-dotted"
        >
          {children}
        </article>
        {toc}
      </div>
    </div>
  )
})
