import logoMark from '../../assets/logo.svg'

// The mark is a horizontal wordmark (5.97:1), so every size is height-driven
// and the width follows from the intrinsic ratio. The keys are unchanged from
// the old square badge — only what each one measures has been recalibrated.
const sizes = {
  small: 'h-5 md:h-6',
  default: 'h-7 md:h-8',
  large: 'h-8 md:h-10',
  xlarge: 'h-10 md:h-12',
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
  // every a[href], which would strand a 28px wordmark at the top of the box.
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
      className={`inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${className}`}
    >
      {mark}
    </a>
  )
}

export default Logo
