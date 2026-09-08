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

  // The transition is written as an INLINE style, which no ordinary stylesheet
  // rule can override — so this is the only place a reduced-motion visitor can
  // be opted out of the fade-and-rise. Read once at render; the preference does
  // not change mid-session in practice. Safe because the animated state already
  // resolves to opacity 1, so content snaps visible rather than stranding at 0.
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const baseStyles = prefersReducedMotion
    // translate(0, 0) rather than 'none': equally motion-free, but it keeps
    // FadeIn a containing block for EVERY visitor. Hero documents structural
    // decisions that assume the inline transform is always there; 'none' would
    // quietly make that assumption false for reduced-motion users only — the
    // configuration least likely to be tested.
    ? { opacity: 1, transform: 'translate(0, 0)' }
    : {
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
