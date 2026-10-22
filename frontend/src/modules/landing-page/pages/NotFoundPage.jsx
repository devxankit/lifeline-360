import Seo from '@/components/seo/Seo'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import PulseLine from '../components/common/PulseLine'

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" noIndex />

      <section className="relative overflow-hidden bg-linear-to-b from-brand-50 to-white">
        <PulseLine className="absolute top-1/2 left-0 h-32 w-full -translate-y-1/2 opacity-60" />

        <Container className="relative flex min-h-[62vh] flex-col items-center justify-center gap-6 py-24 text-center">
          <p className="text-gradient-brand font-display text-[6rem] leading-none font-extrabold tracking-tight sm:text-[8rem]">
            404
          </p>
          <h1 className="text-display-sm sm:text-display-md">
            We couldn’t find that page
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-ink-500">
            The link may be broken, or the page may have moved. One of these should help.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button to="/" icon="arrowRight">
              Back to home
            </Button>
            <Button to="/services" variant="outline">
              Our services
            </Button>
            <Button to="/contact" variant="ghost">
              Contact us
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
