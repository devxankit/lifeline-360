import { useEffect, useState } from 'react'
import Seo from '@/components/seo/Seo'
import Badge from '@/components/ui/Badge'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { legalLastUpdated } from '../../data/legal'
import PageHero from './PageHero'

/**
 * Long-form legal page with a contents list that highlights the section
 * being read. Carries a visible draft notice until legal review is done.
 *
 * @param {{title: string, intro: string, sections: Array}} props.doc
 */
export default function LegalDocument({ doc, description }) {
  const [activeId, setActiveId] = useState(doc.sections[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-110px 0px -65% 0px' }
    )

    for (const section of doc.sections) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }

    return () => observer.disconnect()
  }, [doc])

  return (
    <>
      <Seo title={doc.title} description={description} />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: doc.title }]}
        eyebrow="Legal"
        title={doc.title}
        description={doc.intro}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="neutral">
            <Icon name="clock" size={13} />
            Last updated {legalLastUpdated}
          </Badge>
          <Badge variant="warning">
            <Icon name="info" size={13} />
            Draft: to be finalised with legal counsel before launch
          </Badge>
        </div>
      </PageHero>

      <section className="pb-20 sm:pb-28">
        <Container width="wide" className="grid gap-12 lg:grid-cols-12">
          <nav aria-label="Contents" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
                Contents
              </p>
              <ol className="flex flex-col gap-0.5 border-l border-ink-200">
                {doc.sections.map((section) => {
                  const active = section.id === activeId

                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className={cn(
                          '-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors',
                          active
                            ? 'border-brand-600 font-semibold text-brand-700'
                            : 'border-transparent text-ink-500 hover:border-ink-300 hover:text-ink-800'
                        )}
                      >
                        {section.title}
                      </a>
                    </li>
                  )
                })}
              </ol>
            </div>
          </nav>

          <div className="flex max-w-3xl flex-col gap-12 lg:col-span-8 lg:col-start-5">
            {doc.sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="flex items-baseline gap-3 text-display-xs">
                  <span className="font-sans text-sm font-semibold text-brand-600 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </h2>
                <div className="mt-4 flex flex-col gap-4 text-base leading-relaxed text-ink-600">
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.list ? (
                    <ul className="flex flex-col gap-2.5">
                      {section.list.map((entry) => (
                        <li key={entry} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua-500"
                          />
                          <span>{entry}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
