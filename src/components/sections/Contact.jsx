import { useCallback, useState } from 'react'
import { Container, Section, Grid } from '../layout'
import { Heading, Text, Button, Divider } from '../ui'
import { FadeIn } from '../animation'
import { InquiryPanel } from '../contact'
import { CONTACT, SOCIALS } from '../../config/contact'

const Contact = () => {
  const [modalPhase, setModalPhase] = useState('closed') // 'closed' | 'open' | 'closing'

  const openModal = () => setModalPhase('open')
  // Guarded, so a second Escape during the exit cannot restart it.
  const requestClose = useCallback(() => setModalPhase((p) => (p === 'open' ? 'closing' : p)), [])
  const handleExited = useCallback(() => {
    setModalPhase('closed')
    // Unchanged. Button has no forwardRef, so focus returns by id — otherwise
    // focus falls to <body> and strands keyboard users at the top of the
    // document. It works here because InquiryModal released `inert` from #root
    // synchronously, immediately before calling this: .focus() on an element
    // inside an inert subtree is a silent no-op.
    document.getElementById('inquiry-trigger')?.focus()
  }, [])

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
                  {/* A modal, and therefore necessarily a PORTAL. FadeIn wraps
                      this whole column and applies an inline transform even at
                      rest (FadeIn.jsx keeps it there deliberately, for exactly
                      the components that depend on it), which makes this div a
                      containing block: a position:fixed overlay rendered here
                      would resolve against the grid column, not the viewport, and
                      land as a small box in the right-hand third of the page.
                      InquiryModal escapes that with createPortal(document.body).
                      Do not "simplify" the portal away.
                      aria-haspopup, not aria-expanded/aria-controls: "expanded"
                      promises content adjacent in the reading order, and the
                      content is now a portalled sibling of #root the user can
                      only reach because focus was moved there. aria-controls
                      would also dangle for the 99% of the time the dialog is
                      closed and its id does not exist. */}
                  <Button
                    id="inquiry-trigger"
                    variant="primary"
                    size="large"
                    onClick={openModal}
                    aria-haspopup="dialog"
                  >
                    Start a Project
                  </Button>

                  {/* Not a bare boolean: `{open && …}` removes the node in the
                      same commit that flips the flag, so there is no frame in
                      which an exit animation can run. 'closing' is that frame. */}
                  {modalPhase !== 'closed' && (
                    <InquiryPanel
                      id="inquiry-form"
                      phase={modalPhase}
                      onRequestClose={requestClose}
                      onExited={handleExited}
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
