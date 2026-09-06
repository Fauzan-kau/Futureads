import logoMark from '../../assets/logo.svg'

// The mark is a horizontal wordmark (5.97:1), so every size is height-driven
// and the width follows from the intrinsic ratio. The keys are unchanged from
// the old square badge — only what each one measures has been recalibrated.
// That ratio is why the ladder sits lower than a badge's would: one Tailwind
// step of height is SIX steps of width. `default` at the 16px root is 24px
// tall and 143px wide — about a third of the ~400px nav+CTA cluster it faces
// across the 80px masthead, so width is not what constrains it any more, and
// `xlarge` is 32px tall and 191px wide against a footer column that is only
// 340px at md (Footer.jsx says so itself) and 421px at the lg steady state
// — NOT the 512px a col-span-6 would give you; the mark's zone is span-5.
// Measure the WIDTH, not the height, before changing any of these.
//
// This is the floor, and the constraint is WCAG 2.2 SC 2.5.8, not taste. The
// linked mark's target box is exactly as tall as the image. At 640px AND
// BELOW — max-width is inclusive — globals.css floors every a[href].inline-flex
// at 44px, and from 768px `default` is 24px; the 641-767px band has NEITHER,
// so `default` there is h-5 = 20px, under the 24px minimum. min-h-[24px] is
// what covers that band; drop these another step and the mark outgrows the
// guard and the header link fails the target-size floor outright.
const sizes = {
  small: 'h-3 md:h-4',
  default: 'h-5 md:h-6',
  large: 'h-6 md:h-7',
  xlarge: 'h-7 md:h-8',
}

// logo.svg is paths under a single fill="currentColor" on the root <svg>, with
// no other fill and no stroke. Loaded through <img>, that currentColor resolves
// inside the SVG's OWN document to its initial value — black — and cannot
// inherit from the React tree, so the mark is invisible on a dark surface.
// filter:invert(100%) maps that black ink to white. CSS filters operate on
// non-premultiplied colour, so alpha-0 pixels stay alpha-0 (no white box) and
// antialiased edges feather correctly to white.
// Valid ONLY while the asset stays pure black on transparent: a second colour
// or a white counter-shape would flip too, silently. This comment is the guard.
const tones = {
  dark: '',
  light: 'invert',
}

const Logo = ({ size = 'default', className = '', linked = true, tone = 'dark' }) => {
  const mark = (
    <img
      src={logoMark}
      // Named by the anchor when linked, so the name is never announced twice.
      alt={linked ? '' : 'FutureAds'}
      // Reserves the right box before the SVG loads, so the header does not
      // reflow. 2500/419 is the viewBox's 1000/167.6 as exact integers, which
      // the attributes require. object-contain then keeps the ratio if
      // globals.css's `img { max-width: 100% }` ever clamps the width.
      width="2500"
      height="419"
      // The filter goes on the IMAGE, never on the anchor, so a linked mark on
      // a dark surface does not also invert its own focus ring.
      className={`${sizes[size] ?? sizes.default} ${tones[tone] ?? tones.dark} w-auto object-contain`}
    />
  )

  // inline-flex, not block: under 640px globals.css forces a 44px min-height on
  // every a[href], which would strand an 18.75px wordmark at the top of the box.
  if (!linked) {
    return <span className={`inline-flex items-center ${className}`}>{mark}</span>
  }

  return (
    <a
      // #top, not "#": a bare hash appends to the URL and, in App.jsx, now has
      // a real target. outline-current so the ring is black on the white
      // masthead and white wherever the mark sits on a dark surface.
      href="#top"
      aria-label="FutureAds, back to top"
      // min-h-[24px] is WCAG 2.2 SC 2.5.8, and it is load-bearing ONLY between
      // 641px and 767px. At 640px and below globals.css's own 44px floor is
      // larger and wins on specificity (0,2,1 vs 0,1,0); from 768px `default`
      // is 24px and this merely ties it. So in that one 127px-wide band the
      // mark is 20px and this is the only thing holding the target at 24, and
      // everywhere else it is inert. The h-16/h-20 bar is taller than any of
      // the three, so none of them can reflow the row.
      className={`inline-flex items-center min-h-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${className}`}
    >
      {mark}
    </a>
  )
}

export default Logo
