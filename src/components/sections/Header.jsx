import { useState } from 'react'
import { Container } from '../layout'
import { Logo } from '../ui'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
      <Container size="wide">
        <div className="flex items-center justify-between py-3">
          <Logo size="xlarge" />

          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </Container>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 top-[60px] bg-white z-40 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <Container>
          <nav className="flex flex-col py-8">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="py-4 text-2xl font-medium text-gray-800 hover:text-black border-b border-gray-100 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={closeMenu}
              className="mt-8 inline-flex justify-center px-6 py-4 text-lg font-medium bg-black text-white border border-black hover:bg-white hover:text-black transition-all duration-300"
            >
              Get in Touch
            </a>
          </nav>
        </Container>
      </div>
    </header>
  )
}

export default Header
