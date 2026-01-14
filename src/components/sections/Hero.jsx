import { Container, Section } from '../layout'
import { Heading, Text, Button } from '../ui'
import { FadeIn } from '../animation'

const Hero = () => {
  return (
    <Section padding="none" className="min-h-screen flex items-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 border border-gray-100 rounded-full opacity-50" />
      <div className="absolute bottom-20 left-10 w-64 h-64 border border-gray-200 rounded-full opacity-30" />
      <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-black rounded-full" />
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-gray-400 rounded-full" />

      <Container size="wide" className="py-32 md:py-40 relative z-10">
        <div className="max-w-5xl">
          <FadeIn delay={0}>
            <Text size="caption" color="muted" className="uppercase tracking-[0.3em] mb-8">
              Creative Advertising Agency
            </Text>
          </FadeIn>

          <FadeIn delay={100}>
            <Heading as="h1" size="display" className="mb-10">
              Give your brand
              <span className="block">a future</span>
            </Heading>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="w-24 h-px bg-black mb-10" />
          </FadeIn>

          <FadeIn delay={300}>
            <Text size="large" color="muted" className="max-w-xl mb-12 leading-relaxed">
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
            <div className="mt-20 flex items-center gap-12">
              <div>
                <Text size="caption" color="light" className="uppercase tracking-wider mb-1">
                  Projects
                </Text>
                <Heading as="span" size="title" weight="bold">50+</Heading>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <Text size="caption" color="light" className="uppercase tracking-wider mb-1">
                  Clients
                </Text>
                <Heading as="span" size="title" weight="bold">25+</Heading>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <Text size="caption" color="light" className="uppercase tracking-wider mb-1">
                  Years
                </Text>
                <Heading as="span" size="title" weight="bold">3+</Heading>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>

      {/* Scroll indicator */}
      <FadeIn delay={700}>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <Text size="caption" color="light" className="uppercase tracking-widest text-xs">
            Scroll
          </Text>
          <div className="w-px h-8 bg-gray-300 animate-pulse" />
        </div>
      </FadeIn>
    </Section>
  )
}

export default Hero
