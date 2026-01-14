import { Container, Section, Grid } from '../layout'
import { Heading, Text } from '../ui'
import { FadeIn } from '../animation'

const principles = [
  {
    number: '01',
    title: 'Clarity Over Complexity',
    description: 'The best ideas are often the simplest. We strip away the noise to find the core message that resonates with your audience.',
  },
  {
    number: '02',
    title: 'Bold by Design',
    description: 'We create work that demands attention. Safe doesn\'t get remembered. We push boundaries while staying true to your brand.',
  },
  {
    number: '03',
    title: 'Results Matter',
    description: 'Beautiful work means nothing without impact. Every campaign is built to deliver measurable outcomes that grow your business.',
  },
  {
    number: '04',
    title: 'Partnership First',
    description: 'We don\'t just work for you—we work with you. Your success is our success, and we\'re invested in the long term.',
  },
]

const Philosophy = () => {
  return (
    <Section id="philosophy" background="black" padding="large" className="relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-900/50 to-transparent" />
      <div className="absolute bottom-20 right-20 w-64 h-64 border border-gray-800 rounded-full opacity-30" />
      <div className="absolute top-40 right-40 w-32 h-32 border border-gray-700 rounded-full opacity-20" />

      <Container className="relative z-10">
        <Grid cols={2} gap="large" className="items-start">
          <div className="lg:sticky lg:top-32">
            <FadeIn>
              <Text size="caption" className="uppercase tracking-[0.3em] mb-6 text-gray-500">
                Our Philosophy
              </Text>
              <Heading as="h2" size="headline" className="text-white mb-8">
                We don&apos;t just make ads.
                <span className="block text-gray-400">We build brands that last.</span>
              </Heading>
              <div className="w-16 h-px bg-white mb-8" />
              <Text className="text-gray-400 leading-relaxed">
                Our philosophy is rooted in the belief that great advertising
                is more than just beautiful visuals—it&apos;s about creating
                meaningful connections that drive real business results.
              </Text>
            </FadeIn>

            {/* Large decorative number */}
            <FadeIn delay={200}>
              <div className="mt-16 hidden lg:block">
                <span className="text-[8rem] font-bold text-gray-800/30 leading-none">
                  FA
                </span>
              </div>
            </FadeIn>
          </div>

          <div className="space-y-0">
            {principles.map((principle, index) => (
              <FadeIn key={principle.number} delay={index * 100}>
                <div className="group py-10 border-b border-gray-800 hover:bg-white/5 transition-colors duration-300 px-6 -mx-6">
                  <div className="flex items-start gap-8">
                    <Text size="caption" className="text-gray-600 font-mono mt-1">
                      {principle.number}
                    </Text>
                    <div>
                      <Heading as="h3" size="title" className="text-white mb-4 group-hover:translate-x-2 transition-transform duration-300">
                        {principle.title}
                      </Heading>
                      <Text className="text-gray-400 leading-relaxed">
                        {principle.description}
                      </Text>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Grid>

        {/* Bottom CTA */}
        <FadeIn>
          <div className="mt-24 pt-16 border-t border-gray-800 text-center">
            <Heading as="h3" size="title" className="text-white mb-4">
              Ready to transform your brand?
            </Heading>
            <Text className="text-gray-400 mb-8">
              Let&apos;s create something extraordinary together.
            </Text>
            <a
              href="#contact"
              className="inline-flex px-8 py-4 bg-white text-black font-medium border border-white hover:bg-black hover:text-white transition-all duration-300"
            >
              Start a Conversation
            </a>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
}

export default Philosophy
