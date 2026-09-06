const Section = ({
  children,
  className = '',
  id = '',
  padding = 'default',
  background = 'white',
  // So the Footer can be a real <footer>/contentinfo landmark rather than an
  // eighth <section>. Same pattern as Text.jsx and Heading.jsx.
  as: Component = 'section',
}) => {
  const paddingStyles = {
    none: '',
    small: 'py-8 md:py-10',
    default: 'py-section',
    large: 'py-14 md:py-16 lg:py-20',
  }

  const backgroundStyles = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    black: 'bg-black text-white',
  }

  // The header is fixed with nothing reserving its height, so an anchor jump
  // parks the section's heading underneath it. Every nav target is a Section
  // with an id, which makes this the one place the offset has to exist.
  // 5rem / 6rem against a 61 / 65 / 81px header (Header's h-16 md:h-20 plus its
  // 1px border-b) leaves 14 / 15 / 15px of clearance at every band. rem is
  // right HERE precisely because the header's height is also rem: both shrink
  // together at the 15px root globals.css sets below 640px. If the header ever
  // gets a px height, this has to follow it.
  const scrollOffset = id ? 'scroll-mt-20 md:scroll-mt-24' : ''

  return (
    <Component
      id={id}
      className={`${paddingStyles[padding]} ${backgroundStyles[background]} ${scrollOffset} ${className}`}
    >
      {children}
    </Component>
  )
}

export default Section
