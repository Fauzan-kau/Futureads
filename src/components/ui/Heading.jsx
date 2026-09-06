const Heading = ({
  children,
  as: Component = 'h2',
  size = 'headline',
  className = '',
  weight = 'bold',
  // Spread, exactly as Button.jsx already does. Without it the `id` that
  // aria-labelledby points at is silently swallowed and the dialog has no
  // accessible name — a failure with no console warning and no visual symptom.
  ...props
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
    <Component className={`font-display ${sizes[size]} ${weights[weight]} ${className}`} {...props}>
      {children}
    </Component>
  )
}

export default Heading
