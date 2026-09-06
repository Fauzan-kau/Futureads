import { Container, Section, Grid } from '../layout'
import { Heading, Text } from '../ui'
import { FadeIn } from '../animation'

const capabilities = [
  'Brand Strategy',
  'Visual Identity',
  'Digital Marketing',
  'Social Media',
  'Content Creation',
  'Media Planning',
]

const About = () => {
  return (
    <Section id="about" padding="large" className="relative">
      {/* Decorative line - hidden on mobile */}
      <div className="hidden md:block absolute left-0 top-0 w-px h-full bg-gray-100" />

      <Container>
        <Grid cols={2} gap="large" className="items-start">
          <div className="md:sticky md:top-20">
            <FadeIn>
              <Text size="caption" color="muted" className="uppercase tracking-[0.3em] mb-4">
                About Us
              </Text>
              <Heading as="h2" size="headline" className="mb-4 md:mb-5">
                We believe in the power of bold ideas
              </Heading>
              <div className="w-16 h-px bg-black mb-6 md:mb-0" />
            </FadeIn>
          </div>

          <div>
            <FadeIn delay={100}>
              <Text size="large" color="default" className="mb-5 leading-relaxed">
                FutureAds is a creative advertising agency focused on building
                brands that stand out. We combine strategic thinking with
                creative excellence to deliver campaigns that drive real results.
              </Text>
            </FadeIn>

            <FadeIn delay={150}>
              <Text color="muted" className="mb-8 leading-relaxed">
                Our approach is simple: understand your audience, craft a
                compelling message, and deliver it with precision. We don&apos;t
                follow trends—we set them. Every project is an opportunity to
                create something meaningful and memorable.
              </Text>
            </FadeIn>

            <FadeIn delay={200}>
              <Text size="caption" color="muted" className="uppercase tracking-wider mb-4">
                Our Capabilities
              </Text>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capabilities.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                    <Text size="body">{item}</Text>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </Grid>
      </Container>
    </Section>
  )
}

export default About
