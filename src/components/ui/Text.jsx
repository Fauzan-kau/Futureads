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
