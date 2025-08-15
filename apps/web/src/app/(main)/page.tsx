import { allUpdates } from 'content-collections'
import { ExternalLinkIcon } from 'lucide-react'
import Image from 'next/image'
import { SelectedWorksHeading } from '@/components/pages/home/SelectedWorksHeading'
import { Tagline } from '@/components/pages/home/Tagline'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { PROJECTS } from '@/libs/config'
import { cn } from '@/libs/utils'

export default async function HomePage() {
  return (
    <>
      <section id="hero" className="flex flex-col justify-center pb-32 py-12">
        <Tagline className="text-6xl lg:text-10xl" />
      </section>
      <section id="works" className="bg-stone-300 -mx-6 px-4 md:px-6 py-20">
        <div className="space-y-12">
          <SelectedWorksHeading className="text-6xl lg:text-10xl" />
          <div>
            {PROJECTS.map((project, index) => (
              <div
                className={cn(
                  'grid grid-cols-1 lg:grid-cols-[1.5fr_0.5fr_1fr_1fr] items-center gap-4 lg:gap-12 border-b border-gray-900 py-6 lg:h-32 group relative',
                  {
                    'border-t': index === 0,
                  },
                )}
                key={project.name}
              >
                {project.link ? (
                  <a
                    className="text-2xl lg:text-3xl w-fit"
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.name}
                  </a>
                ) : (
                  <h1 className="text-2xl lg:text-3xl">{project.name}</h1>
                )}
                <p className="text-xl lg:text-2xl">{project.year}</p>
                <p className="text-xl lg:text-2xl">{project.role}</p>
                <p className="text-xl lg:text-2xl">
                  {project.stacks.join(', ')}
                </p>
                <Image
                  src={project.image}
                  alt={`${project.name} Website`}
                  width={240}
                  height={180}
                  className="absolute right-0 rounded-lg opacity-0 invisible group-hover:opacity-100 duration-300 group-hover:visible translate-y-10 group-hover:translate-y-0 hidden lg:block"
                  aria-haspopup="true"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="skills"
        className="min-h-screen bg-gray-100 -mx-6 px-6 py-20"
      >
        <RevealHeading className="text-6xl lg:text-10xl mb-12">
          My Beloved Tech Stacks
        </RevealHeading>

        <div className="gap-2 grid grid-cols-2 lg:grid-cols-1">
          <div className="bg-stone-700 p-4">
            <h1 className="text-white text-xl lg:text-4xl font-heading uppercase tracking-wider">
              React JS
            </h1>
            <p className="text-white mt-2">
              The king of components. Making my UI so interactive
            </p>
          </div>
          <div className="bg-stone-700 p-4">
            <h1 className="text-white text-xl lg:text-4xl font-heading uppercase tracking-wider">
              Next JS
            </h1>
            <p className="text-white mt-2">
              My Swiss Army knife for web development. Ready to slice through
              server-side rendering like butter
            </p>
          </div>
          <div className="bg-stone-700 p-4">
            <h1 className="text-white text-xl lg:text-4xl font-heading uppercase tracking-wider">
              TypeScript
            </h1>
            <p className="text-white mt-2">
              Keeping my code type-safe and my sanity intact
            </p>
          </div>
          <div className="bg-stone-700 p-4">
            <h1 className="text-white text-xl lg:text-4xl font-heading uppercase tracking-wider">
              CSS
            </h1>
            <p className="text-white mt-2">
              The magic wand that transforms my ideas into beautiful designs
            </p>
          </div>
          <div className="bg-stone-700 p-4">
            <h1 className="text-white text-xl lg:text-4xl font-heading uppercase tracking-wider">
              TanStack
            </h1>
            <p className="text-white mt-2">
              A utilities for making my web development feel much easier and
              achieve "weekend transquility"
            </p>
          </div>
          <div className="bg-stone-700 p-4">
            <h1 className="text-white text-xl lg:text-4xl font-heading uppercase tracking-wider">
              GoLang
            </h1>
            <p className="text-white mt-2">
              The language that i use for my backend development faster before
              you can say "database optimization"
            </p>
          </div>
          <a
            className="relative bg-stone-700 p-4 w-full max-md:col-span-2 text-left text-white text-xl lg:text-4xl font-heading uppercase tracking-wider flex items-center justify-between group/collection-button overflow-hidden"
            href="/uses"
          >
            <span>All Curated Collection of My Essential Instruments</span>
            <div className="absolute bg-white inset-0 -translate-y-full group-hover/collection-button:translate-y-0 duration-300 flex flex-col justify-center items-center">
              <ExternalLinkIcon className="text-stone-700 size-8" />
            </div>
          </a>
        </div>
      </section>
      <section
        id="writing"
        className="bg-stone-700 px-6 -mx-6 py-20 gap-12 flex flex-col"
      >
        <RevealHeading className="text-6xl lg:text-10xl text-white">
          Latest Articles
        </RevealHeading>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {allUpdates.map((update) => (
            <ArticleCard
              title={update.title}
              description={update.description}
              tag={update.tag}
              date={update.date}
              slug={update._meta.path}
              key={update._meta.path}
            />
          ))}
        </div>
      </section>
    </>
  )
}
