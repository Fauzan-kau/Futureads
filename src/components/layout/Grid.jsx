const Grid = ({
  children,
  className = '',
  cols = 1,
  gap = 'default',
  responsive = true
}) => {
  const colStyles = {
    1: 'grid-cols-1',
    2: responsive ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2',
    3: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
    4: responsive ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4',
  }

  const gapStyles = {
    none: 'gap-0',
    small: 'gap-3 md:gap-4',
    default: 'gap-5 md:gap-6',
    large: 'gap-6 md:gap-8',
  }

  return (
    <div className={`grid ${colStyles[cols]} ${gapStyles[gap]} ${className}`}>
      {children}
    </div>
  )
}

export default Grid
