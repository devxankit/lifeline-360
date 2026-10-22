import { useSearchParams } from 'react-router-dom'
import Reveal from '@/components/motion/Reveal'
import StaggerGroup from '@/components/motion/StaggerGroup'
import StaggerItem from '@/components/motion/StaggerItem'
import Seo from '@/components/seo/Seo'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Icon from '@/components/ui/Icon'
import { siteConfig } from '@/config/site'
import supportAgent from '../assets/images/support-agent.webp'
import PageHero from '../components/common/PageHero'
import ContactForm from '../components/forms/ContactForm'

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const topic = searchParams.get('topic') ?? ''
  const { phone, phoneHref, email, emailHref, partnerEmail, partnerEmailHref, address } =
    siteConfig.contact

  const channels = [
    {
      icon: 'phoneCall',
      title: 'Call us',
      value: phone,
      href: phoneHref,
      note: 'Services, bookings and support',
    },
    {
      icon: 'mail',
      title: 'Email us',
      value: email,
      href: emailHref,
      note: 'Questions and feedback',
    },
    {
      icon: 'heartHandshake',
      title: 'Partner enquiries',
      value: partnerEmail,
      href: partnerEmailHref,
      note: 'Pharmacies, carers, drivers, labs, blood banks',
    },
    { icon: 'mapPin', title: 'Office', value: address, note: 'Corporate office' },
  ]

  return (
    <>
      <Seo
        title="Contact us"
        description="Contact the Lifeline 360 team about our healthcare services, membership or partnering with us."
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        eyebrow="Contact"
        title="Talk to the Lifeline 360 team"
        description="Questions about a service, membership or partnering with us? Send a message or reach us directly. We’re glad to help."
        image={supportAgent}
        imageAlt="A smiling support agent wearing a headset"
        imagePosition="50% 35%"
      />

      <section className="pt-4 pb-6">
        <Container width="wide">
          <StaggerGroup
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            stagger={0.06}
          >
            {channels.map((channel) => {
              const content = (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition-colors duration-300 ring-inset group-hover:bg-brand-600 group-hover:text-white">
                    <Icon name={channel.icon} size={21} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-500">{channel.title}</p>
                    <p className="mt-1 font-display text-base font-bold break-words text-ink-900">
                      {channel.value}
                    </p>
                    <p className="mt-1 text-sm text-ink-400">{channel.note}</p>
                  </div>
                </>
              )

              return (
                <StaggerItem key={channel.title} variant="rise" className="h-full">
                  {channel.href ? (
                    <a
                      href={channel.href}
                      className="group flex h-full flex-col gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 transition-[box-shadow,translate] duration-500 ring-inset hover:-translate-y-1 hover:shadow-card-hover"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="group flex h-full flex-col gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 ring-inset">
                      {content}
                    </div>
                  )}
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container width="wide" className="grid gap-8 lg:grid-cols-12">
          <Reveal className="rounded-4xl bg-white p-6 shadow-card ring-1 ring-ink-200/70 sm:p-10 lg:col-span-7">
            <h2 className="text-display-xs sm:text-display-sm">Send us a message</h2>
            <p className="mt-3 mb-8 text-base leading-relaxed text-ink-500">
              Share a few details and the right person on our team will get back to you.
            </p>
            {/* Keyed on topic so ?topic=… links preselect it even when already on the page. */}
            <ContactForm key={topic} defaultTopic={topic} />
          </Reveal>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <Reveal
              delay={0.1}
              className="relative overflow-hidden rounded-4xl bg-linear-to-br from-emergency-700 to-emergency-500 p-8 text-white"
            >
              <div
                aria-hidden="true"
                className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/10 blur-2xl"
              />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Icon name="ambulance" size={24} />
              </span>
              <p className="relative mt-5 font-display text-xl font-bold">
                Need an ambulance now?
              </p>
              <p className="relative mt-2 text-[0.9375rem] leading-relaxed text-white/85">
                Book from the Lifeline 360 app and follow it live. In a life-threatening
                emergency, call {siteConfig.emergencyNumber}.
              </p>
              <Button
                to="/services/ambulance"
                variant="light"
                icon="arrowRight"
                className="relative mt-6"
              >
                How ambulance booking works
              </Button>
            </Reveal>

            <Reveal
              delay={0.15}
              className="rounded-4xl bg-ink-50 p-8 ring-1 ring-ink-100 ring-inset"
            >
              <p className="font-display text-xl font-bold text-ink-900">
                Looking for a quick answer?
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">
                Most questions about services, membership and partnering are answered in
                our FAQs.
              </p>
              <Button to="/faqs" variant="outline" icon="arrowRight" className="mt-6">
                Browse FAQs
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
