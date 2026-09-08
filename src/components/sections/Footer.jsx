import { Container, Section } from '../layout'
import { Heading, Text, Logo } from '../ui'
import { FadeIn } from '../animation'
import { CONTACT, SOCIALS } from '../../config/contact'

/* ---------------------------------------------------------------------------
   COLOUR CONTRACT on #000. Four greys, one job each. Do not add a fifth.

     white      21.0:1   wordmark (inverted), statement, rules, link hover
     gray-300   14.2:1   links at rest
     gray-400    8.3:1   labels, description, location, copyright, back to top
     gray-800      --    hairlines only. Structure, NEVER text.

   NEVER text-gray-500 on black: #737373 is 4.43:1 and fails AA.
   The statement, the email and the wordmark need no colour class at all —
   Section background="black" already sets text-white and they inherit it.
   Text's colors.default is text-black, so every <Text> here must pass
   color="dim" or color="inherit"; a className override would depend on
   Tailwind's palette emission order rather than on a rule.

   LAYOUT. Four blocks on one 12-track grid: the brand statement on 1-5, then
   three equal lists on 6-12. The previous arrangement pushed two lists to the
   right rail with justify-self-end and let the middle of the footer fall open —
   a ~160px hole at lg between a half-empty left column and two narrow lists
   clinging to the edge. Even tracks and one shared gutter mean the columns line
   up with the sections above instead of drifting toward the corners.
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
// text-body's 1.7 line-height (~29px) + 16px is a 45px row pitch, which clears
// WCAG 2.2 2.5.8's 24px minimum without the dead space.
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

/* The label is deliberately not a heading element: a list column's aria-label
   carries the same string, so assistive tech already gets the structure and the
   document outline is not polluted with 14px headings standing beside the
   sections' real ones.
   `nav` is a PROP, not the default. Two of these columns are navigation and one
   is contact information; wrapping a phone number and an address in a <nav>
   would advertise a set of destinations that is not there. */
const FooterColumn = ({ label, nav = false, children }) => {
  const Body = nav ? 'nav' : 'div'
  return (
    <div className="min-w-0">
      <Text size="caption" weight="medium" color="dim" className="uppercase tracking-[0.3em]">
        {label}
      </Text>
      {/* 32px white rule — the same measure as the Services cards', one step down
          from the statement column's 64px. gray-800 here would be 1.36:1. */}
      <div aria-hidden="true" className="mt-3 mb-5 h-px w-8 bg-white" />
      <Body
        {...(nav ? { 'aria-label': label } : {})}
        className="flex flex-col items-start gap-4"
      >
        {children}
      </Body>
    </div>
  )
}

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    // background="black", not "gray". gray-50 on white is 1.04:1 — below the
    // threshold of perception — and Services is ALSO background="gray", so
    // gray-50 here meant "another content section", not "the end of the page".
    // Black needs no border-t: it is a 21:1 step against the Contact section
    // above. padding="large" matches Contact; the footer previously had LESS
    // padding than the section above it.
    <Section as="footer" padding="large" background="black">
      <Container>
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">

          {/* ---- Statement column: the site's own opening stack, used to close
                  the page. Identity -> statement -> hairline -> body -> the one
                  promoted channel, exactly as Hero, About, Services, Work,
                  Philosophy and Contact do. ---- */}
          <FadeIn className="lg:col-span-5">
            {/* tone="light" applies filter:invert to the <img>. See Logo.jsx —
                the mark is currentColor inside an <img>, so it is black and
                would otherwise be invisible here. */}
            <Logo size="xlarge" linked={false} tone="light" className="mb-6 md:mb-8" />

            {/* The site's own headline, returned to a size that means something —
                it was 14px gray-600 here once, one grey step away from the
                boilerplate under it. as="p" keeps the heading outline clean;
                weight="medium" so it supports the wordmark rather than fighting
                it. FUTURE is capitalised to match the hero, where the word now
                carries its emphasis in the case rather than under a black bar.
                No tracking-*: the title token carries its own -0.015em and a
                utility would silently override it. */}
            <Heading as="p" size="title" weight="medium" className="text-balance mb-5 md:mb-6">
              Give your brand a FUTURE
            </Heading>

            <div aria-hidden="true" className="w-16 h-px bg-white mb-5 md:mb-6" />

            <Text color="dim" className="max-w-sm mb-7 md:mb-8">
              Creative advertising agency crafting bold, impactful campaigns.
            </Text>

            {/* One promoted channel rather than a half-size reprint of the
                Contact section's whole card. The hairline-grow is that section's
                own gesture, mirrored for a dark surface. The address is ~200px
                at text-body-lg; the narrowest box it ever sits in is the 272px
                content width of a 320px phone (the column is 421px at the lg
                steady state), so break-all is gone and it can no longer shatter
                mid-word. */}
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
          </FadeIn>

          {/* ---- Three columns on tracks 6-12. Two at 320px (the widest string
                  is ~83px in a ~148px cell), three from sm, and they stay three
                  all the way up rather than collapsing to a right-hand island.
                  "Contact" carries the channels the statement column does not,
                  so nothing in this footer is printed twice. ---- */}
          <FadeIn delay={100} className="lg:col-span-7 lg:col-start-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-8 lg:gap-x-8">
              <FooterColumn label="Navigate" nav>
                {navLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </FooterColumn>

              <FooterColumn label="Follow" nav>
                {SOCIALS.map((social) => (
                  <FooterLink key={social.label} href={social.href} external>
                    {social.label}
                  </FooterLink>
                ))}
              </FooterColumn>

              <FooterColumn label="Contact">
                <FooterLink href={`tel:${CONTACT.phoneE164}`}>{CONTACT.phone}</FooterLink>
                {/* Prose, not a bare string styled identically to the link above
                    it, so a static line can no longer advertise itself as
                    clickable. */}
                <Text color="dim">
                  {CONTACT.location}
                  <br />
                  Available worldwide
                </Text>
                <Text size="caption" color="dim">
                  We reply {CONTACT.replyWindow}.
                </Text>
              </FooterColumn>
            </div>
          </FadeIn>
        </div>

        {/* ---- Closing bar. The rule is a border on this block, INSIDE the
                FadeIn, rather than a standalone <Divider> sitting between the
                two: as a separate element it was the one thing with no entrance
                animation, so scrolling in showed a bare hairline on an empty
                slab before anything faded up around it. Two groups under
                justify-between means one gap and no nearly-centred middle child.
                Zero order-* utilities: DOM order is visual order at every
                width. ---- */}
        <FadeIn delay={150} className="mt-12 md:mt-16">
          <div className="pt-6 md:pt-8 border-t border-gray-800 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <Text size="caption" color="dim">
              &copy; {currentYear} FutureAds. All rights reserved.
            </Text>

            {/* The house square outline chip — the same object as the Contact
                section's numbered process steps, at the same 32px — inverting to
                solid white on hover, which is the site's signature gesture. A
                real SVG, so the accessible name is exactly "Back to top".
                href="#top", not "#". inline-flex is deliberate here: globals.css
                gives this anchor 44px below 640px and it IS a real control,
                unlike the text links above. */}
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
