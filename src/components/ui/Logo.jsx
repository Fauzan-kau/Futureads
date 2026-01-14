import logoImage from '../../assets/logo.png'

const Logo = ({ size = 'default', className = '' }) => {
  const sizes = {
    small: 'h-10 w-10',
    default: 'h-14 w-14',
    large: 'h-20 w-20',
    xlarge: 'h-24 w-24',
  }

  return (
    <a href="#" className={`block ${className}`}>
      <img
        src={logoImage}
        alt="FutureAds"
        className={`${sizes[size]} object-contain`}
      />
    </a>
  )
}

export default Logo
