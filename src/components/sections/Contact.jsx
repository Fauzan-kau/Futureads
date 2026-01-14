import { Container, Section, Grid } from '../layout'
import { Heading, Text, Button, Divider } from '../ui'
import { FadeIn } from '../animation'

const Contact = () => {
  return (
    <Section id="contact" padding="large" className="relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gray-50" />

      <Container className="relative z-10">
        <Grid cols={2} gap="large" className="items-start">
          <div className="bg-gray-50 p-12 lg:p-16 -ml-6 lg:-ml-12">
            <FadeIn>
              <Text size="caption" color="muted" className="uppercase tracking-[0.3em] mb-6">
                Get in Touch
              </Text>
              <Heading as="h2" size="headline" className="mb-6">
                Ready to give your brand a future?
              </Heading>
              <div className="w-16 h-px bg-black mb-8" />
              <Text size="large" color="muted" className="mb-8 leading-relaxed">
                Let&apos;s discuss how we can help elevate your brand and create
                campaigns that make a lasting impact.
              </Text>
              <Text color="muted" className="leading-relaxed">
                Whether you&apos;re looking to refresh your brand identity,
                launch a new campaign, or build a stronger digital presence,
                we&apos;re here to help you succeed.
              </Text>
            </FadeIn>

            {/* Process steps */}
            <FadeIn delay={200}>
              <div className="mt-12 space-y-6">
                <Text size="caption" color="muted" className="uppercase tracking-wider">
                  Our Process
                </Text>
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 flex items-center justify-center border border-black text-sm font-medium">1</span>
                  <Text>Discovery Call</Text>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 flex items-center justify-center border border-black text-sm font-medium">2</span>
                  <Text>Strategy & Proposal</Text>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 flex items-center justify-center border border-black text-sm font-medium">3</span>
                  <Text>Creative Execution</Text>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 flex items-center justify-center border border-black text-sm font-medium">4</span>
                  <Text>Launch & Optimize</Text>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="py-12 lg:py-16">
            <FadeIn delay={100}>
              <div className="space-y-10">
                <div className="group">
                  <Text size="caption" color="muted" className="uppercase tracking-wider mb-3">
                    Email
                  </Text>
                  <a
                    href="mailto:hello@futureads.agency"
                    className="text-2xl md:text-3xl font-medium hover:text-gray-600 transition-colors duration-300 inline-flex items-center gap-4"
                  >
                    hello@futureads.agency
                    <span className="w-6 h-px bg-black group-hover:w-10 transition-all duration-300" />
                  </a>
                </div>

                <Divider />

                <div className="group">
                  <Text size="caption" color="muted" className="uppercase tracking-wider mb-3">
                    Phone
                  </Text>
                  <a
                    href="tel:+919876543210"
                    className="text-2xl md:text-3xl font-medium hover:text-gray-600 transition-colors duration-300 inline-flex items-center gap-4"
                  >
                    +91 98765 43210
                    <span className="w-6 h-px bg-black group-hover:w-10 transition-all duration-300" />
                  </a>
                </div>

                <Divider />

                <div>
                  <Text size="caption" color="muted" className="uppercase tracking-wider mb-3">
                    Location
                  </Text>
                  <Text size="large" className="mb-2">
                    Kerala, India
                  </Text>
                  <Text color="muted">
                    Available for remote collaboration worldwide
                  </Text>
                </div>

                <Divider />

                <div>
                  <Text size="caption" color="muted" className="uppercase tracking-wider mb-4">
                    Follow Us
                  </Text>
                  <div className="flex gap-6">
                    <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">
                      Instagram
                    </a>
                    <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">
                      LinkedIn
                    </a>
                    <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">
                      Behance
                    </a>
                  </div>
                </div>

                <div className="pt-6">
                  <Button href="mailto:hello@futureads.agency" variant="primary" size="large">
                    Start a Project
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </Grid>
      </Container>
    </Section>
  )
}

export default Contact
