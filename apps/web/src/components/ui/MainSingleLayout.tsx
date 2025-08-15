import { type ComponentProps, forwardRef } from 'react'

export interface MainSingleLayoutProps extends ComponentProps<'div'> {
  title: string
  description: string
  tag?: string
  date?: Date
}

export const MainSingleLayout = forwardRef<
  HTMLDivElement,
  MainSingleLayoutProps
>(({ title, description, tag, date, children, ...props }, ref) => {
  return (
    <div
      className="py-20 flex flex-col items-center max-w-(--breakpoint-lg) mx-auto has-[.toc]:max-w-(--breakpoint-xl)"
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

      <div className="has-[.toc]:grid has-[.toc]:grid-cols-[3fr_1fr] has-[.toc]:gap-6 mt-12 group/single-layout">
        <article
          id="article-content"
          className="mx-auto w-full max-w-(--breakpoint-lg) prose prose-stone prose-pre:[tab-size:2] prose-a:decoration-dotted"
        >
          {children}
        </article>
      </div>
    </div>
  )
})
