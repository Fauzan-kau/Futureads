import useInView from '../../hooks/useInView'

const FadeIn = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 600,
  distance = 10,
  threshold = 0.1,
}) => {
  const { ref, isInView } = useInView({ threshold })

  const directions = {
    up: `translate-y-[${distance}px]`,
    down: `translate-y-[-${distance}px]`,
    left: `translate-x-[${distance}px]`,
    right: `translate-x-[-${distance}px]`,
    none: 'translate-y-0',
  }

  const baseStyles = {
    opacity: isInView ? 1 : 0,
    transform: isInView ? 'translate(0, 0)' : getTransform(direction, distance),
    transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
  }

  return (
    <div ref={ref} style={baseStyles} className={className}>
      {children}
    </div>
  )
}

const getTransform = (direction, distance) => {
  switch (direction) {
    case 'up':
      return `translateY(${distance}px)`
    case 'down':
      return `translateY(-${distance}px)`
    case 'left':
      return `translateX(${distance}px)`
    case 'right':
      return `translateX(-${distance}px)`
    default:
      return 'translate(0, 0)'
  }
}

export default FadeIn
