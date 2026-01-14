import { useState } from 'react'
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
      <div className="mx-auto px-3 sm:px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="flex items-center justify-between py-1.5 md:py-3">
          <Logo size="default" className="md:hidden" />
          <Logo size="xlarge" className="hidden md:block" />

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
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
        }`}
      >
        <nav className="flex flex-col py-2 px-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={closeMenu}
            className="mt-2 mb-1 inline-flex justify-center px-4 py-2 text-sm font-medium bg-black text-white hover:bg-gray-800 transition-all duration-200"
          >
            Get in Touch
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
