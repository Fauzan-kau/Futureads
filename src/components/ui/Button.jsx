const Button = ({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 ease-out'

  const variants = {
    primary: 'bg-black text-white border border-black hover:bg-white hover:text-black',
    secondary: 'bg-white text-black border border-black hover:bg-black hover:text-white',
    ghost: 'bg-transparent text-black hover:bg-gray-100',
    link: 'bg-transparent text-black underline underline-offset-4 hover:text-gray-600',
  }

  const sizes = {
    small: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  }

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
