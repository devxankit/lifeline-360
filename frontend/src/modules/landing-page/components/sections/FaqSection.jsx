import Reveal from '@/components/motion/Reveal'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import SectionHeading from '@/components/ui/SectionHeading'
import { siteConfig } from '@/config/site'
import { featuredFaqs } from '../../data/faqs'
import FaqAccordion from '../common/FaqAccordion'

export default function FaqSection() {
  const { phone, phoneHref, email, emailHref } = siteConfig.contact

  return (
    <section className="py-20 sm:py-28">
      <Container width="wide" className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-8 lg:col-span-4">
          <SectionHeading
            eyebrow="FAQs"
            title="Questions, answered"
            description="The things families ask us most about Lifeline 360."
          />

          <Reveal
            delay={0.1}
            className="flex flex-col gap-5 rounded-3xl bg-brand-50 p-6 ring-1 ring-brand-100 ring-inset"
          >
            <p className="font-display text-lg font-bold text-ink-900">
              Still have a question?
            </p>
            <div className="flex flex-col gap-2.5 text-[0.9375rem]">
              <a
                href={phoneHref}
                className="flex items-center gap-2.5 font-medium text-ink-700 hover:text-brand-700"
              >
                <Icon name="phone" size={17} className="text-brand-600" />
                {phone}
              </a>
              <a
                href={emailHref}
                className="flex items-center gap-2.5 font-medium text-ink-700 hover:text-brand-700"
              >
                <Icon name="mail" size={17} className="text-brand-600" />
                {email}
              </a>
            </div>
            <Button to="/faqs" variant="outline" icon="arrowRight" className="self-start">
              See all FAQs
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-8">
          <FaqAccordion items={featuredFaqs} />
        </Reveal>
      </Container>
    </section>
  )
}
