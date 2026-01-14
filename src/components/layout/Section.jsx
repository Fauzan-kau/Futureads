const Section = ({
  children,
  className = '',
  id = '',
  padding = 'default',
  background = 'white'
}) => {
  const paddingStyles = {
    none: '',
    small: 'py-12 md:py-16',
    default: 'py-section',
    large: 'py-24 md:py-32 lg:py-40',
  }

  const backgroundStyles = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    black: 'bg-black text-white',
  }

  return (
    <section
      id={id}
      className={`${paddingStyles[padding]} ${backgroundStyles[background]} ${className}`}
    >
      {children}
    </section>
  )
}

export default Section
