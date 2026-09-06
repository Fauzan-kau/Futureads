const Section = ({
  children,
  className = '',
  id = '',
  padding = 'default',
  background = 'white'
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
  const scrollOffset = id ? 'scroll-mt-20' : ''

  return (
    <section
      id={id}
      className={`${paddingStyles[padding]} ${backgroundStyles[background]} ${scrollOffset} ${className}`}
    >
      {children}
    </section>
  )
}

export default Section
