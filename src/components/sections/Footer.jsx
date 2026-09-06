import { Container, Section } from '../layout'
import { Heading, Text, Logo } from '../ui'
import { FadeIn } from '../animation'
import { CONTACT, SOCIALS } from '../../config/contact'

/* ---------------------------------------------------------------------------
   COLOUR CONTRACT on #000. Four greys, one job each. Do not add a fifth.

     white      21.0:1   wordmark (inverted), tagline, rules, link hover
     gray-300   14.2:1   links at rest
     gray-400    8.3:1   labels, description, location, copyright, back to top
     gray-800      --    hairlines only. Structure, NEVER text.

   NEVER text-gray-500 on black: #737373 is 4.43:1 and fails AA.
   The tagline, the email and the wordmark need no colour class at all —
   Section background="black" already sets text-white and they inherit it.
   Text's colors.default is text-black, so every <Text> here must pass
   color="dim" or color="inherit"; a className override would depend on
   Tailwind's palette emission order rather than on a rule.
--------------------------------------------------------------------------- */

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Contact', href: '#contact' },
]

// inline-block, NEVER inline-flex: globals.css matches a[href].inline-flex and
// would inflate every one of these to 44px below 640px — the exact regression
// the comment in globals.css documents removing ("a footer nav column 81%
// taller on mobile than on desktop"). Separation comes from gap-4 instead:
// text-body's 1.6 line-height (25.6px) + 16px is a 41.6px row pitch, which
// clears WCAG 2.2 2.5.8's 24px minimum without the dead space.
const FooterLink = ({ href, children, external = false }) => (
  <a
    href={href}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className="group relative inline-block w-fit text-body text-gray-300 hover:text-white transition-colors duration-300 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
  >
    {children}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:scale-x-100 group-focus-visible:scale-x-100"
    />
  </a>
)

// The label is deliberately not a heading element: each column is a <nav> whose
// aria-label carries the same string, so assistive tech already gets the
// structure and the document outline is not polluted with 14px headings
// standing beside the sections' real ones.
const FooterColumn = ({ label, children }) => (
  <div className="min-w-0">
    <Text size="caption" weight="medium" color="dim" className="uppercase tracking-[0.3em]">
      {label}
    </Text>
    {/* 32px white rule — the same measure as the Services cards', one step down
        from the statement column's 64px. gray-800 here would be 1.36:1. */}
    <div className="mt-3 mb-5 h-px w-8 bg-white" />
    <nav aria-label={label} className="flex flex-col items-start gap-4">
      {children}
    </nav>
  </div>
)

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    // background="black", not "gray". gray-50 on white is 1.04:1 — below the
    // threshold of perception — and Services is ALSO background="gray", so
    // gray-50 here meant "another content section", not "the end of the page".
    // Black needs no border-t: it is a 21:1 step against both halves of the
    // Contact section above, so that asymmetric bleeding-gray join stops
    // reading as a rendering artifact. padding="large" matches Contact; the
    // footer previously had LESS padding than the section above it.
    <Section as="footer" padding="large" background="black">
      <Container>
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-6 md:gap-y-0 lg:gap-x-8">

          {/* ---- Statement zone: the site's own opening stack, used to close
                  the page. Identity -> tagline -> hairline -> body, exactly as
                  Hero, About, Services, Work, Philosophy and Contact do. ---- */}
          <FadeIn className="md:col-span-6 lg:col-span-5">
            {/* tone="light" applies filter:invert to the <img>. See Logo.jsx —
                the mark is currentColor inside an <img>, so it is black and
                would otherwise be invisible here. */}
            <Logo size="xlarge" linked={false} tone="light" className="mb-6 md:mb-8" />

            {/* The site's own H1, returned to a size that means something — it
                was 14px gray-600, one grey step away from the boilerplate under
                it. as="p" keeps the heading outline clean; weight="medium" so
                it supports the wordmark rather than fighting it. No tracking-*:
                the title token carries its own -0.015em and a utility would
                silently override it. Inherits white from the Section. */}
            <Heading as="p" size="title" weight="medium" className="text-balance mb-5 md:mb-6">
              Give your brand a future
            </Heading>

            <div className="w-16 h-px bg-white mb-5 md:mb-6" />

            <Text color="dim" className="leading-relaxed max-w-sm mb-7 md:mb-8">
              Creative advertising agency crafting bold, impactful campaigns.
            </Text>

            {/* One promoted channel rather than a half-size reprint of the
                Contact card 200px above. The hairline-grow is that section's
                own gesture, mirrored for a dark surface. The address is ~231px
                at text-body-lg inside a 340px column at the tightest
                breakpoint, so break-all is gone and it can no longer shatter
                mid-word at any width. */}
            <a
              href={`mailto:${CONTACT.email}`}
              className="group inline-flex items-center gap-3 md:gap-4 text-body-lg font-medium hover:text-gray-300 transition-colors duration-300 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {CONTACT.email}
              <span
                aria-hidden="true"
                className="hidden sm:block w-6 h-px bg-white flex-shrink-0 transition-all duration-300 ease-out motion-reduce:transition-none group-hover:w-10"
              />
            </a>

            {/* Prose, not a bare string styled identically to the links above
                it, so a static line can no longer advertise itself as
                clickable. */}
            <Text size="caption" color="dim" className="mt-3">
              {CONTACT.location} &mdash; available worldwide
            </Text>
          </FadeIn>

          {/* ---- Wayfinding zone: exactly two columns at every width, down to
                  320px. Three columns in a 2-track grid is what orphaned
                  "Contact" and left a ~154x130px hole on every phone; two fit
                  side by side even at 320px (the widest strings are ~83px in a
                  ~148px cell), which keeps the mobile footer about 200px
                  shorter than a single stacked list.
                  From lg the columns become content-width and the block is
                  pushed to the rail with justify-self-end, so the lists close
                  on the same right edge as the back-to-top control below them
                  instead of trailing ~160px of nothing. ---- */}
          <FadeIn delay={100} className="md:col-span-6 lg:col-span-6 lg:col-start-7 lg:justify-self-end">
            <div className="grid grid-cols-2 gap-x-6 sm:gap-8 lg:flex lg:gap-16 xl:gap-20">
              <FooterColumn label="Navigate">
                {navLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </FooterColumn>

              <FooterColumn label="Follow">
                {SOCIALS.map((social) => (
                  <FooterLink key={social.label} href={social.href} external>
                    {social.label}
                  </FooterLink>
                ))}
              </FooterColumn>
            </div>
          </FadeIn>
        </div>

        {/* ---- Closing bar. The rule is a border on this block, INSIDE the
                FadeIn, rather than a standalone <Divider> sitting between the
                two: previously it was the one element with no entrance
                animation, so scrolling in showed a bare hairline on an empty
                slab before anything faded up around it. Two groups under
                justify-between means one gap and no nearly-centred middle
                child, so the old 249px voids and the 73px-off-centre legal pair
                are structurally impossible. Zero order-* utilities: DOM order
                is visual order at every width. ---- */}
        <FadeIn delay={150} className="mt-12 md:mt-16">
          <div className="pt-6 md:pt-8 border-t border-gray-800 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <Text size="caption" color="dim">
              &copy; {currentYear} FutureAds. All rights reserved.
            </Text>

            {/* The house square outline chip — the same object as the Contact
                section's numbered process steps, at the same 32px — inverting
                to solid white on hover, which is the site's signature gesture.
                Replaces a 16px rounded badge whose 14px content box was SMALLER
                than the 16px line box of the text arrow inside it, and whose
                hover translate was the only vertical hover-move in the
                codebase. A real SVG, so the accessible name is exactly "Back to
                top". href="#top", not "#". inline-flex is deliberate here:
                globals.css gives this anchor 44px below 640px and it IS a real
                control, unlike the text links above. */}
            <a
              href="#top"
              className="group inline-flex items-center gap-3 self-start md:self-auto text-caption uppercase tracking-widest text-gray-400 hover:text-white transition-colors duration-300 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Back to top
              <span
                aria-hidden="true"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-current transition-colors duration-300 ease-out motion-reduce:transition-none group-hover:bg-white group-hover:text-black"
              >
                <svg
                  viewBox="0 0 12 12"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="square"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M6 10.5V1.5M1.75 5.75 6 1.5l4.25 4.25" />
                </svg>
              </span>
            </a>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
}

export default Footer
