import { Container, Section, Grid } from '../layout'
import { Heading, Text, Divider } from '../ui'
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
      {/* Decorative line */}
      <div className="absolute left-0 top-0 w-px h-full bg-gray-100" />

      <Container>
        <Grid cols={2} gap="large" className="items-start">
          <div className="sticky top-32">
            <FadeIn>
              <Text size="caption" color="muted" className="uppercase tracking-[0.3em] mb-6">
                About Us
              </Text>
              <Heading as="h2" size="headline" className="mb-8">
                We believe in the power of bold ideas
              </Heading>
              <div className="w-16 h-px bg-black" />
            </FadeIn>
          </div>

          <div>
            <FadeIn delay={100}>
              <Text size="large" color="default" className="mb-8 leading-relaxed">
                FutureAds is a creative advertising agency focused on building
                brands that stand out. We combine strategic thinking with
                creative excellence to deliver campaigns that drive real results.
              </Text>
            </FadeIn>

            <FadeIn delay={150}>
              <Text color="muted" className="mb-12 leading-relaxed">
                Our approach is simple: understand your audience, craft a
                compelling message, and deliver it with precision. We don&apos;t
                follow trends—we set them. Every project is an opportunity to
                create something meaningful and memorable.
              </Text>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="mb-12">
                <Text size="caption" color="muted" className="uppercase tracking-wider mb-6">
                  Our Capabilities
                </Text>
                <div className="grid grid-cols-2 gap-3">
                  {capabilities.map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      <Text size="body">{item}</Text>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </Grid>

        <Divider className="my-20" />

        {/* Stats with more visual impact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <FadeIn delay={0}>
            <div className="text-center md:text-left p-8 border border-gray-100 hover:border-gray-300 transition-colors duration-300">
              <Heading as="span" size="display" className="block mb-4">
                50+
              </Heading>
              <Text color="muted" className="uppercase tracking-wider text-sm">
                Projects Delivered
              </Text>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="text-center md:text-left p-8 border border-gray-100 hover:border-gray-300 transition-colors duration-300">
              <Heading as="span" size="display" className="block mb-4">
                25+
              </Heading>
              <Text color="muted" className="uppercase tracking-wider text-sm">
                Happy Clients
              </Text>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="text-center md:text-left p-8 border border-gray-100 hover:border-gray-300 transition-colors duration-300">
              <Heading as="span" size="display" className="block mb-4">
                3+
              </Heading>
              <Text color="muted" className="uppercase tracking-wider text-sm">
                Years Experience
              </Text>
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  )
}

export default About
