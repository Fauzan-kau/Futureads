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

const Logo = ({ size = 'default', className = '', linked = true }) => {
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
      className={`${sizes[size] ?? sizes.default} w-auto object-contain`}
    />
  )

  // inline-flex, not block: under 640px globals.css forces a 44px min-height on
  // every a[href], which would strand a 28px wordmark at the top of the box.
  if (!linked) {
    return <span className={`inline-flex items-center ${className}`}>{mark}</span>
  }

  return (
    <a
      href="#"
      aria-label="FutureAds, back to top"
      className={`inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black ${className}`}
    >
      {mark}
    </a>
  )
}

export default Logo
