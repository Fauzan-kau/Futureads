const Divider = ({
  className = '',
  orientation = 'horizontal',
  color = 'default',
}) => {
  const orientationStyles = {
    horizontal: 'w-full h-px',
    vertical: 'h-full w-px',
  }

  const colorStyles = {
    default: 'bg-gray-200',
    dark: 'bg-gray-400',
    light: 'bg-gray-100',
    black: 'bg-black',
  }

  return (
    <div
      className={`${orientationStyles[orientation]} ${colorStyles[color]} ${className}`}
      role="separator"
    />
  )
}

export default Divider
