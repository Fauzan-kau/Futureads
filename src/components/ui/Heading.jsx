const Heading = ({
  children,
  as: Component = 'h2',
  size = 'headline',
  className = '',
  weight = 'bold',
}) => {
  const sizes = {
    display: 'text-display',
    headline: 'text-headline',
    title: 'text-title',
    subtitle: 'text-xl md:text-2xl',
  }

  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  return (
    <Component className={`${sizes[size]} ${weights[weight]} tracking-tight ${className}`}>
      {children}
    </Component>
  )
}

export default Heading
