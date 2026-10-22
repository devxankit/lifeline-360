import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import Reveal from '@/components/motion/Reveal'
import Seo from '@/components/seo/Seo'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import FaqAccordion from '../components/common/FaqAccordion'
import PageHero from '../components/common/PageHero'
import { faqCategories } from '../data/faqs'

const ALL = 'all'

export default function FaqPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(ALL)
  const needle = query.trim().toLowerCase()

  const groups = useMemo(
    () =>
      faqCategories
        .filter((group) => category === ALL || group.id === category)
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) =>
              !needle ||
              item.q.toLowerCase().includes(needle) ||
              item.a.toLowerCase().includes(needle)
          ),
        }))
        .filter((group) => group.items.length),
    [category, needle]
  )

  const total = groups.reduce((count, group) => count + group.items.length, 0)
  const filters = [{ id: ALL, label: 'All questions' }, ...faqCategories]

  return (
    <>
      <Seo
        title="FAQs"
        description="Answers to common questions about Lifeline 360 services, ambulance booking, membership, partnering, payments and privacy."
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'FAQs' }]}
        eyebrow="Help centre"
        title="Frequently asked questions"
        description="Answers about our services, ambulance booking, membership, partnering and privacy."
      >
        <label htmlFor="faq-search" className="sr-only">
          Search the FAQs
        </label>
        <div className="relative max-w-xl">
          <Icon
            name="search"
            size={20}
            className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-ink-400"
          />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search, e.g. “prescription” or “masked calling”"
            className="h-14 w-full rounded-full border border-ink-200 bg-white pr-5 pl-13 text-base text-ink-900 shadow-card transition-shadow placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/12 focus:outline-none"
          />
        </div>
      </PageHero>

      <section className="pb-20 sm:pb-28">
        <Container width="wide" className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-28 lg:flex-col">
              {filters.map((filter) => {
                const selected = filter.id === category

                return (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setCategory(filter.id)}
                    className={cn(
                      'relative shrink-0 rounded-2xl px-4 py-2.5 text-left text-[0.9375rem] font-semibold whitespace-nowrap transition-colors',
                      selected ? 'text-brand-700' : 'text-ink-500 hover:text-ink-800'
                    )}
                  >
                    {selected ? (
                      <motion.span
                        layoutId="faq-filter"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                        className="absolute inset-0 rounded-2xl bg-brand-50 ring-1 ring-brand-100 ring-inset"
                      />
                    ) : null}
                    <span className="relative">{filter.label}</span>
                  </button>
                )
              })}
            </div>
          </aside>

          <div className="flex flex-col gap-12 lg:col-span-9">
            <p aria-live="polite" className="sr-only">
              {total} {total === 1 ? 'question' : 'questions'} shown
            </p>

            {groups.length ? (
              groups.map((group) => (
                <section key={group.id} aria-labelledby={`faq-group-${group.id}`}>
                  <h2 id={`faq-group-${group.id}`} className="mb-5 text-display-xs">
                    {group.label}
                  </h2>
                  {/* Re-keyed per search so the first match opens as you type. */}
                  <FaqAccordion
                    key={`${group.id}-${needle}`}
                    items={group.items}
                    defaultOpen={needle ? 0 : null}
                  />
                </section>
              ))
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-4xl bg-ink-50 px-6 py-16 text-center ring-1 ring-ink-100 ring-inset">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ink-400 shadow-card">
                  <Icon name="search" size={22} />
                </span>
                <p className="font-display text-xl font-bold text-ink-900">
                  No questions match “{query.trim()}”
                </p>
                <p className="max-w-sm text-[0.9375rem] text-ink-500">
                  Try a different word, or ask us directly and we’ll answer.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('')
                    setCategory(ALL)
                  }}
                >
                  Clear search
                </Button>
              </div>
            )}

            <Reveal className="flex flex-col items-start justify-between gap-6 rounded-4xl bg-brand-600 p-8 text-white sm:flex-row sm:items-center sm:p-10">
              <div>
                <p className="font-display text-2xl font-bold">
                  Didn’t find your answer?
                </p>
                <p className="mt-1 text-white/80">
                  Our team is happy to help with anything else.
                </p>
              </div>
              <Button
                to="/contact"
                variant="light"
                icon="arrowRight"
                className="shrink-0"
              >
                Contact us
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
