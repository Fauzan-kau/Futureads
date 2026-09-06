import { Container, Section } from '../layout'
import { Heading, Text, Button } from '../ui'
import { FadeIn } from '../animation'

const Hero = () => {
  return (
    <Section padding="none" className="min-h-[100svh] flex items-center relative overflow-hidden">
      {/* Decorative elements - hidden on small screens */}
      <div className="hidden md:block absolute top-20 right-0 w-64 lg:w-96 h-64 lg:h-96 border border-gray-100 rounded-full opacity-50" />
      <div className="hidden md:block absolute bottom-20 left-10 w-32 lg:w-64 h-32 lg:h-64 border border-gray-200 rounded-full opacity-30" />
      <div className="hidden sm:block absolute top-1/2 right-1/4 w-2 h-2 bg-black rounded-full" />
      <div className="hidden sm:block absolute top-1/3 right-1/3 w-1 h-1 bg-gray-400 rounded-full" />

      <Container className="py-20 md:py-24 relative z-10">
        <div className="max-w-5xl">
          <FadeIn delay={0}>
            <Text size="caption" color="muted" className="uppercase tracking-[0.3em] mb-5">
              Creative Advertising Agency
            </Text>
          </FadeIn>

          <FadeIn delay={100}>
            <Heading as="h1" size="display" className="mb-6">
              Give your brand
              <span className="block">
                a{' '}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative">future</span>
                  {/* Marker sweep: wipes a black bar across the word, inverting it to white */}
                  <span
                    aria-hidden="true"
                    className="highlight-wipe absolute inset-x-[-0.1em] inset-y-[-0.08em] bg-black"
                  >
                    <span className="absolute left-[0.1em] top-[0.08em] text-white">
                      future
                    </span>
                  </span>
                </span>
              </span>
            </Heading>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="w-24 h-px bg-black mb-7" />
          </FadeIn>

          <FadeIn delay={300}>
            <Text size="large" color="muted" className="max-w-xl mb-8 leading-relaxed">
              We craft bold, impactful campaigns that transform how audiences
              perceive and connect with your brand. Strategy meets creativity.
            </Text>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="flex flex-wrap gap-4">
              <Button href="#work" variant="primary" size="large">
                View Our Work
              </Button>
              <Button href="#contact" variant="secondary" size="large">
                Get in Touch
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={500}>
            <div className="mt-10 md:mt-12 grid grid-cols-3 gap-4 md:gap-8 lg:gap-10">
              <div className="text-center md:text-left">
                <Text size="caption" color="light" className="uppercase tracking-wider mb-1">
                  Projects
                </Text>
                <Heading as="span" size="title" weight="bold">50+</Heading>
              </div>
              <div className="text-center md:text-left border-l border-gray-200 pl-4 md:pl-8">
                <Text size="caption" color="light" className="uppercase tracking-wider mb-1">
                  Clients
                </Text>
                <Heading as="span" size="title" weight="bold">25+</Heading>
              </div>
              <div className="text-center md:text-left border-l border-gray-200 pl-4 md:pl-8">
                <Text size="caption" color="light" className="uppercase tracking-wider mb-1">
                  Years
                </Text>
                <Heading as="span" size="title" weight="bold">3+</Heading>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>

      {/* Scroll indicator - hidden on mobile. The absolute positioning has to
          live on a plain wrapper: FadeIn always writes an inline transform, so
          IT would become the containing block and park this at the right edge
          of the hero's flex row, mid-height, instead of bottom-centre. */}
      <div className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <FadeIn delay={700}>
          <div className="flex flex-col items-center gap-2">
            <Text size="caption" color="light" className="uppercase tracking-widest text-xs">
              Scroll
            </Text>
            <div className="w-px h-8 bg-gray-300 animate-pulse" />
          </div>
        </FadeIn>
      </div>
    </Section>
  )
}

export default Hero
