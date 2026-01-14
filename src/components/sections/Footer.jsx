import { Container, Section } from '../layout'
import { Text, Divider, Logo } from '../ui'
import { FadeIn } from '../animation'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' },
  ]

  const socials = [
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Behance', href: '#' },
  ]

  return (
    <Section padding="default" background="gray">
      <Container>
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 mb-16">
            {/* Brand */}
            <div className="flex items-start gap-6">
              <Logo size="xlarge" />
              <div>
                <Text as="span" size="large" weight="bold" className="block mb-1">
                  FutureAds
                </Text>
                <Text size="caption" color="muted" className="mb-4">
                  Give your brand a future
                </Text>
                <Text size="caption" color="light" className="max-w-xs">
                  Creative advertising agency crafting bold, impactful campaigns.
                </Text>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap gap-12 lg:gap-16">
              <div>
                <Text size="caption" color="muted" className="uppercase tracking-wider mb-4">
                  Navigation
                </Text>
                <nav className="flex flex-col gap-3">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-black transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div>
                <Text size="caption" color="muted" className="uppercase tracking-wider mb-4">
                  Social
                </Text>
                <nav className="flex flex-col gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="text-sm text-gray-600 hover:text-black transition-colors duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div>
                <Text size="caption" color="muted" className="uppercase tracking-wider mb-4">
                  Contact
                </Text>
                <div className="space-y-3">
                  <a
                    href="mailto:hello@futureads.agency"
                    className="block text-sm text-gray-600 hover:text-black transition-colors duration-300"
                  >
                    hello@futureads.agency
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="block text-sm text-gray-600 hover:text-black transition-colors duration-300"
                  >
                    +91 98765 43210
                  </a>
                  <Text size="caption" color="muted">
                    Kerala, India
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <Divider className="mb-8" />

        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <Text size="caption" color="muted">
              &copy; {currentYear} FutureAds. All rights reserved.
            </Text>

            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors duration-300">
                Terms of Service
              </a>
            </div>

            {/* Back to top */}
            <a
              href="#"
              className="group inline-flex items-center gap-2 text-xs text-gray-500 hover:text-black transition-colors duration-300"
            >
              Back to top
              <span className="w-4 h-4 border border-current rounded-full flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
                ↑
              </span>
            </a>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
}

export default Footer
