const Button = ({
  children,
  href,
  onClick,
  // Without an explicit type, a <button> inside a <form> defaults to submit —
  // which would make Cancel, Copy and Close all submit the inquiry form.
  type = 'button',
  variant = 'primary',
  size = 'default',
  className = '',
  ...props
}) => {
  // An outline rather than a ring: rings are box-shadows and are stripped in
  // Windows forced-colors mode, and the primary variant's hover inversion makes
  // the UA default focus ring ambiguous.
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

  // The ring colour belongs to the variant, not the base: welded into
  // baseStyles it could not be overridden from className without relying on
  // stylesheet order, so a Button on a dark surface would get an invisible
  // black ring. No existing call site changes appearance.
  const variants = {
    primary: 'bg-black text-white border border-black hover:bg-white hover:text-black focus-visible:outline-black',
    secondary: 'bg-white text-black border border-black hover:bg-black hover:text-white focus-visible:outline-black',
    ghost: 'bg-transparent text-black hover:bg-gray-100 focus-visible:outline-black',
    link: 'bg-transparent text-black underline underline-offset-4 hover:text-gray-600 focus-visible:outline-black',
  }

  const sizes = {
    small: 'px-4 py-2 text-sm',
    default: 'px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base',
    large: 'px-6 py-3 md:px-8 md:py-4 text-base md:text-lg',
  }

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    // onClick used to be dropped on this branch, so <Button href onClick>
    // compiled, rendered, and silently never fired.
    return (
      <a href={href} onClick={onClick} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
