import { useState, useEffect } from 'react'
import { Container } from '../layout'
import { Logo, Button } from '../ui'
import useActiveSection from '../../hooks/useActiveSection'

const navLinks = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Work', href: '#work', id: 'work' },
]

// text-caption is the type scale's own token; text-base was a stock Tailwind
// size from outside it. tracking-widest (0.1em) is the navigational tier —
// between tracking-wider (0.05em, in-content labels) and tracking-[0.3em]
// (section eyebrows). Precedent: Hero.jsx's scroll indicator.
const navLinkBase =
  'group relative flex items-center text-caption font-medium uppercase tracking-widest transition-colors duration-300 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // Derived from navLinks, not a hand-maintained copy: a new nav item would
  // otherwise navigate fine but be silently excluded from the active state.
  // The hook keys its effect on ids.join('|'), so a fresh array each render is free.
  const activeId = useActiveSection(navLinks.map((link) => link.id))

  const toggleMenu = () => setIsMenuOpen((open) => !open)
  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    if (!isMenuOpen) return
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setIsMenuOpen(false)
      // The toggle has no forwardRef, so focus returns by id — the same way
      // Contact.jsx returns it to #inquiry-trigger.
      document.getElementById('menu-toggle')?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  return (
    // Opaque, not bg-white/90: the opacity was the bug, not the colour.
    // rgba(255,255,255,.9) over Philosophy's bg-black composites to #E5E5E5 —
    // literally the gray-200 token — so the bar changed colour mid-scroll.
    // backdrop-blur-sm is gone too: 4px could not dissolve the hero's 88px
    // display type, it only smeared it. No scrolled state and no scroll
    // listener: a bar identical at every scroll position is the whole point.
    // Container, not a bespoke max-w-7xl, so the mark finally sits on the same
    // rail as every heading on the page.
    <header className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-200">
      <Container>
        {/* Do NOT add py-* to this row or to the Container. The nav rule below
            lands on the header's own border-b, which is only true while the
            row's bottom edge IS the header's content-box bottom edge. */}
        <div className="flex h-16 md:h-20 items-center justify-between gap-6">
          <Logo className="shrink-0" />

          {/* One right-hand object rather than two islands drifting inside
              justify-between. self-stretch makes the cluster full bar height so
              the nav links can reach the border. */}
          <div className="hidden md:flex md:self-stretch md:items-stretch md:gap-6 lg:gap-8">
            <nav aria-label="Primary" className="flex items-stretch gap-6 lg:gap-10">
              {navLinks.map((link) => {
                const isActive = activeId === link.id
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={`${navLinkBase} ${isActive ? 'text-black' : 'text-gray-600 hover:text-black'}`}
                  >
                    {link.label}
                    {/* -bottom-px puts this 1px segment exactly on top of the
                        header's 1px border-b, so hover and the active state
                        blacken the segment of the masthead rule under this
                        item instead of floating a hairline 8px below a word.
                        right-[0.1em] cancels tracking-widest's trailing
                        letter-space so the rule ends at the last glyph.
                        scale-x from origin-left, never w-0 -> w-full: a
                        transform, not a layout animation. */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute -bottom-px left-0 right-[0.1em] h-px origin-left bg-black transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:scale-x-100 group-focus-visible:scale-x-100 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </a>
                )
              })}
            </nav>

            {/* Short and centred, not self-stretch: a full-height rule dies at
                the viewport's top edge with nothing above it and reads as an
                artifact. Same material as the hero's stat separators. */}
            <span aria-hidden="true" className="hidden lg:block w-px h-5 self-center bg-gray-200" />

            <div className="flex items-center">
              {/* secondary, NOT primary. primary's hover:bg-white on a white
                  bar deletes the button's entire weight — hover reads as
                  switching it off. secondary gains weight on hover, matches the
                  hero's own "Get in Touch", and stops a second black slab
                  competing with the wordmark. size="small" is 38px (text-sm's
                  line box is an absolute 1.25rem, plus py-2 and the border) =
                  47.5% of the 80px bar; don't invent a fourth size. text-sm and
                  text-caption are both 0.875rem, so the className collides with
                  nothing. */}
              <Button
                href="#contact"
                variant="secondary"
                size="small"
                className="uppercase tracking-widest"
              >
                Get in Touch
              </Button>
            </div>
          </div>

          {/* min-h/min-w in px because h-11/w-11 resolve to 41.25px at the 15px
              root, and globals.css only forces min-HEIGHT. This is a true 44x44
              square, not the 36x44 the old w-9 h-9 actually rendered. -mr-3
              pulls the box's transparent padding into the gutter so the icon's
              ink lands 22.0px from the viewport against the logo's 22.5px. */}
          <button
            id="menu-toggle"
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            // A stable name: aria-expanded already reports open/closed, so a
            // label that flips announces the state twice in contradictory forms
            // and leaves voice control without one reliable target.
            aria-label="Menu"
            className="md:hidden -mr-3 flex h-11 w-11 min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black"
          >
            {/* Do NOT retune translate-y-2. h-0.5 + gap-1.5 puts the bar centres
                exactly 7.5px apart at the 15px root and exactly 8px apart at
                16px, and translate-y-2 is 7.5px / 8px respectively — exact at
                both roots. scale-x-[1.414] is 1/cos45: Tailwind composes
                translate -> rotate -> skew -> scale, so the bar lengthens
                22.5px -> 31.8px BEFORE rotating and the X measures
                31.8 * cos45 = 22.5px, the same width as the burger, instead of
                deflating 30%. Don't "simplify" it to scale-x-150 (23.9px). */}
            <span className={`block h-0.5 w-6 bg-black transition-transform duration-300 ease-out motion-reduce:transition-none ${isMenuOpen ? 'translate-y-2 rotate-45 scale-x-[1.414]' : ''}`} />
            <span className={`block h-0.5 w-6 bg-black transition-opacity duration-300 ease-out motion-reduce:transition-none ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-black transition-transform duration-300 ease-out motion-reduce:transition-none ${isMenuOpen ? '-translate-y-2 -rotate-45 scale-x-[1.414]' : ''}`} />
          </button>
        </div>
      </Container>

      {/* Dismiss layer. MUST precede the panel in the DOM: both are positioned
          children of the same stacking context, so the later one paints above.
          absolute + top-full rather than fixed + a magic offset, so it tracks
          the header's height on its own. */}
      {isMenuOpen && (
        <div
          className="md:hidden absolute inset-x-0 top-full mt-px h-screen"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* top: 100% resolves against the PADDING box, so top-full alone would
          cover the header's own border-b. mt-px starts the panel 1px below it:
          the masthead rule survives and the panel closes with its own.
          shadow-lg is gone — it was the only box-shadow in src/, a soft blurred
          grey in a system built from hard 1px lines — and so is
          border-t border-gray-100, which was #F5F5F5 on #FFFFFF and invisible,
          which is why the shadow was carrying the panel.
          LEAVE the opacity/visible/translate transition as it is: CSS
          interpolates visibility with visible-wins, so the close animation
          plays in full and visibility:hidden then correctly removes the panel
          from the tab order. Conditional rendering would lose that. */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute inset-x-0 top-full mt-px bg-white border-b border-gray-200 transition-all duration-300 ease-out motion-reduce:transition-none ${
          isMenuOpen
            ? 'visible translate-y-0 opacity-100'
            // pointer-events-none is load-bearing: CSS interpolates visibility
            // with visible-wins, so for the full 300ms of the close animation the
            // panel is still `visible` and still hittable over the page beneath.
            // pointer-events is a discrete property and is not transitioned, so it
            // flips on the same frame as the state.
            : 'pointer-events-none invisible -translate-y-2 opacity-0'
        }`}
      >
        <Container>
          <nav aria-label="Mobile" className="flex flex-col divide-y divide-gray-200">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="touch-target flex items-center text-caption font-medium uppercase tracking-widest text-gray-600 hover:text-black transition-colors duration-300 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black"
              >
                {link.label}
              </a>
            ))}
          </nav>
          {/* py-5, not the old mt-2 (7.5px): the CTA no longer crushes the last
              link. Same Button, variant, size, easing and focus ring as the
              desktop one — one object at both breakpoints, instead of a
              hover:bg-gray-800 darken that exists nowhere else on the site and
              sticks after tap on iOS.
              touch-target is explicit, NOT inherited: globals.css's 44px floor
              stops at 640px, but this panel is the only navigation all the way to
              767px — large phones in landscape, small tablets, and a 1366px laptop
              at 200% zoom — where size="small" alone is 38px. */}
          <div className="border-t border-gray-200 py-5">
            <Button
              href="#contact"
              onClick={closeMenu}
              variant="secondary"
              size="small"
              className="touch-target w-full uppercase tracking-widest"
            >
              Get in Touch
            </Button>
          </div>
        </Container>
      </div>
    </header>
  )
}

export default Header
