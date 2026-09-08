import { Container, Section } from '../layout'
import { Heading, Text, Divider } from '../ui'
import { FadeIn } from '../animation'
import { InquiryForm } from '../contact'
import { CONTACT, SOCIALS } from '../../config/contact'

/* One row of the contact list: a tracked caption label over the value, with a
   hairline between rows. The label markup was repeated five times inline before
   and drifted — two rows had mb-3, one had mb-2 — which is exactly the kind of
   half-pixel inconsistency a column of aligned labels makes visible. */
const Detail = ({ label, children }) => (
  <div>
    <Text size="caption" color="muted" className="uppercase tracking-wider mb-3">
      {label}
    </Text>
    {children}
  </div>
)

/* The hairline that grows on hover is this section's own gesture, and it is
   shared by the two channels that are actually links. hidden below sm because
   at that width the address already wraps and a 24px rule tacked onto the end
   of a wrapped line reads as a stray mark. */
const ChannelLink = ({ href, children }) => (
  <a
    href={href}
    className="group inline-flex items-center gap-3 md:gap-4 text-xl sm:text-2xl font-medium hover:text-gray-600 transition-colors duration-300 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black break-all sm:break-normal"
  >
    {children}
    <span
      aria-hidden="true"
      className="hidden sm:block w-6 h-px bg-black flex-shrink-0 transition-all duration-300 ease-out motion-reduce:transition-none group-hover:w-10"
    />
  </a>
)

const process = [
  'Discovery Call',
  'Strategy & Proposal',
  'Creative Execution',
  'Launch & Optimize',
]

const Contact = () => {
  return (
    /* Two columns with one job each: everything the visitor needs to KNOW on the
       left, the one thing they can DO on the right.
       The form used to be behind a "Start a Project" button that opened a modal
       — a dialog, a portal, a focus trap, a body-scroll lock and an
       inert-ing of #root, all so that a five-field form could be reached by a
       second click. It is simply on the page now: no trigger, no overlay, no
       focus to restore, and nothing to dismiss.
       An explicit 12-track grid rather than <Grid cols={2}>, because a 50/50
       split gives the form the same width as the prose and the fields need more.
       Stacked until lg, not md: at 768-1023px a 2-up split leaves ~350px per
       column, which is under the measure the name/email pair inside the card
       needs. */
    <Section id="contact" padding="large">
      <Container>
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">

          {/* ---- Left: the invitation, then every way to reach a human ---- */}
          <div className="lg:col-span-5">
            <FadeIn>
              <Text size="caption" color="muted" className="uppercase tracking-[0.3em] mb-4">
                Get in Touch
              </Text>
              <Heading as="h2" size="headline" className="mb-4 text-balance">
                Ready to give your brand a FUTURE?
              </Heading>
              <div className="w-16 h-px bg-black mb-6" />
              <Text size="large" color="muted" className="mb-4">
                Let&apos;s discuss how we can help elevate your brand and create
                campaigns that make a lasting impact.
              </Text>
              <Text color="muted">
                Whether you&apos;re looking to refresh your brand identity,
                launch a new campaign, or build a stronger digital presence,
                we&apos;re here to help you succeed.
              </Text>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="mt-10 space-y-6">
                <Detail label="Email">
                  <ChannelLink href={`mailto:${CONTACT.email}`}>{CONTACT.email}</ChannelLink>
                </Detail>

                <Divider />

                <Detail label="Phone">
                  <ChannelLink href={`tel:${CONTACT.phoneE164}`}>{CONTACT.phone}</ChannelLink>
                </Detail>

                <Divider />

                <Detail label="Location">
                  {/* CONTACT.location, not a second hard-coded "Kerala, India".
                      The footer reads the same field, so the two can no longer
                      disagree. */}
                  <Text size="large" className="mb-1">
                    {CONTACT.location}
                  </Text>
                  <Text color="muted">Available for remote collaboration worldwide</Text>
                </Detail>

                <Divider />

                <Detail label="Follow Us">
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    {SOCIALS.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black transition-colors duration-300 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                </Detail>
              </div>
            </FadeIn>

          </div>

          {/* ---- Right: the form itself ----
                  lg:sticky is deliberately absent. The card is ~720px tall and a
                  1080p laptop viewport is ~830px minus a 81px header: a sticky
                  element taller than its scrollport pins to the WRONG edge and
                  the submit button would sit permanently just below the fold. */}
          <div className="lg:col-span-7">
            <FadeIn delay={100}>
              <InquiryForm />
            </FadeIn>
          </div>
        </div>

        {/* ---- The process, as a full-width strip under BOTH columns rather
                than a fifth block in the left one. Stacked inside the column it
                ran ~270px past the bottom of the form card and left that much
                dead space beside it; across the foot of the section the two
                columns end within ~50px of each other and the four steps get a
                ~250px cell each, which is what stops "Strategy & Proposal"
                wrapping. The numbered square is the house chip — the same object
                as the footer's back-to-top control, at the same 32px. ---- */}
        <FadeIn delay={150}>
          <div className="mt-14 md:mt-16 pt-8 md:pt-10 border-t border-gray-200">
            <Text size="caption" color="muted" className="uppercase tracking-[0.3em] mb-6">
              Our Process
            </Text>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
              {process.map((step, index) => (
                <li key={step} className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="w-8 h-8 flex-none flex items-center justify-center border border-black text-caption font-medium"
                  >
                    {index + 1}
                  </span>
                  <Text>{step}</Text>
                </li>
              ))}
            </ol>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
}

export default Contact
