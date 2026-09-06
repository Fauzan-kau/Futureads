const Text = ({
  children,
  as: Component = 'p',
  size = 'body',
  color = 'default',
  className = '',
  weight = 'normal',
}) => {
  const sizes = {
    large: 'text-body-lg',
    body: 'text-body',
    caption: 'text-caption',
  }

  const colors = {
    default: 'text-black',
    muted: 'text-gray-600',
    light: 'text-gray-500',
    // For dark surfaces. gray-400 is 8.3:1 on black; gray-500 is only 4.43:1
    // and fails AA there. Overriding the default text-black from className
    // works today only because Tailwind emits the named greys after `black`
    // in the resolved palette — an emission-order dependency, not a rule.
    dim: 'text-gray-400',
    inherit: 'text-inherit',
  }

  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
  }

  return (
    <Component className={`${sizes[size]} ${colors[color]} ${weights[weight]} ${className}`}>
      {children}
    </Component>
  )
}

export default Text
