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
    subtitle: 'text-subtitle',
  }

  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  // No tracking-* here on purpose: each fontSize token in tailwind.config.js
  // carries its own letterSpacing, and a utility class would override all of
  // them with a single value.
  return (
    <Component className={`font-display ${sizes[size]} ${weights[weight]} ${className}`}>
      {children}
    </Component>
  )
}

export default Heading
