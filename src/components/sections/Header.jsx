import { Container } from '../layout'
import { Logo } from '../ui'

const Header = () => {
  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
      <Container size="wide">
        <div className="flex items-center justify-between py-3">
          <Logo size="xlarge" />

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group relative text-base font-medium text-gray-600 hover:text-black transition-colors duration-300 py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="hidden md:inline-flex px-6 py-2.5 text-base font-medium bg-black text-white border border-black hover:bg-white hover:text-black transition-all duration-300"
          >
            Get in Touch
          </a>
        </div>
      </Container>
    </header>
  )
}

export default Header
