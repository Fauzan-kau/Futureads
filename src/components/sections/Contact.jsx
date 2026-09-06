import { useState } from 'react'
import { Container, Section, Grid } from '../layout'
import { Heading, Text, Button, Divider } from '../ui'
import { FadeIn } from '../animation'
import { InquiryPanel } from '../contact'
import { CONTACT, SOCIALS } from '../../config/contact'

const Contact = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <Section id="contact" padding="large" className="relative">
      <Container className="relative z-10">
        <Grid cols={2} gap="large" className="items-start">
          <div className="relative bg-gray-50 p-6 md:p-8 lg:p-10 -mx-6 md:mx-0 md:-ml-8 lg:-ml-12 md:before:absolute md:before:inset-y-0 md:before:right-full md:before:w-screen md:before:bg-gray-50">
            <FadeIn>
              <Text size="caption" color="muted" className="uppercase tracking-[0.3em] mb-4">
                Get in Touch
              </Text>
              <Heading as="h2" size="headline" className="mb-4">
                Ready to give your brand a future?
              </Heading>
              <div className="w-16 h-px bg-black mb-6" />
              <Text size="large" color="muted" className="mb-6 leading-relaxed">
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
              <div className="mt-8 space-y-4">
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

          <div className="py-2 md:py-4">
            <FadeIn delay={100}>
              <div className="space-y-6 md:space-y-7">
                <div className="group">
                  <Text size="caption" color="muted" className="uppercase tracking-wider mb-3">
                    Email
                  </Text>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium hover:text-gray-600 transition-colors duration-300 inline-flex items-center gap-2 md:gap-4 break-all md:break-normal"
                  >
                    {CONTACT.email}
                    <span className="hidden sm:block w-6 h-px bg-black group-hover:w-10 transition-all duration-300 flex-shrink-0" />
                  </a>
                </div>

                <Divider />

                <div className="group">
                  <Text size="caption" color="muted" className="uppercase tracking-wider mb-3">
                    Phone
                  </Text>
                  <a
                    href={`tel:${CONTACT.phoneE164}`}
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium hover:text-gray-600 transition-colors duration-300 inline-flex items-center gap-2 md:gap-4"
                  >
                    {CONTACT.phone}
                    <span className="hidden sm:block w-6 h-px bg-black group-hover:w-10 transition-all duration-300 flex-shrink-0" />
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
                  <Text size="caption" color="muted" className="uppercase tracking-wider mb-3">
                    Follow Us
                  </Text>
                  {/* Was three dead href="#" anchors naming Instagram /
                      LinkedIn / Behance while the footer named Instagram /
                      Facebook / YouTube with real URLs — two contradictory
                      answers to the same question in one eyeful, and the
                      visible one went nowhere. */}
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    {SOCIALS.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black transition-colors duration-300"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  {/* A disclosure, not a modal: the panel is the trigger's next
                      DOM sibling, so Tab lands in the first field naturally and
                      no focus trap is needed. It also cannot be a fixed overlay
                      here — FadeIn applies an inline transform even at rest,
                      which would make position:fixed resolve against the grid
                      column rather than the viewport. */}
                  <Button
                    id="inquiry-trigger"
                    variant="primary"
                    size="large"
                    onClick={() => setIsFormOpen((open) => !open)}
                    aria-expanded={isFormOpen}
                    aria-controls="inquiry-form"
                  >
                    Start a Project
                  </Button>

                  {isFormOpen && (
                    <InquiryPanel
                      id="inquiry-form"
                      onClose={() => {
                        setIsFormOpen(false)
                        // Button has no forwardRef, so focus returns by id —
                        // otherwise focus falls to <body> and strands keyboard
                        // users at the top of the document.
                        document.getElementById('inquiry-trigger')?.focus()
                      }}
                    />
                  )}
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
