const Container = ({ children, className = '', size = 'default' }) => {
  const sizes = {
    narrow: 'max-w-3xl',
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
    full: 'max-w-full',
  }

  return (
    <div className={`mx-auto px-6 md:px-8 lg:px-12 ${sizes[size]} ${className}`}>
      {children}
    </div>
  )
}

export default Container
