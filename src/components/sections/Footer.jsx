import { Container, Section } from '../layout'
import { Text, Divider, Logo } from '../ui'
import { FadeIn } from '../animation'
import { CONTACT } from '../../config/contact'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' },
  ]

  const socials = [
    { label: 'Instagram', href: 'https://www.instagram.com/future.ads_?igsi=MWI5aGtmZGFqaWJtZQ==' },
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61585164251234' },
    { label: 'YouTube', href: 'https://www.youtube.com/@Futureads00' },
  ]

  return (
    <Section padding="default" background="gray">
      <Container>
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 md:gap-12 mb-12 md:mb-16">
            {/* Brand. The mark spells the name itself, so it sits above the
                copy rather than beside a repeat of it. */}
            <div className="max-w-xs">
              <Logo size="large" linked={false} className="mb-4 md:mb-5" />
              <Text size="caption" color="muted" className="mb-2 md:mb-3">
                Give your brand a future
              </Text>
              <Text size="caption" color="light">
                Creative advertising agency crafting bold, impactful campaigns.
              </Text>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
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
                    href={`mailto:${CONTACT.email}`}
                    className="block text-sm text-gray-600 hover:text-black transition-colors duration-300 break-all sm:break-normal"
                  >
                    {CONTACT.email}
                  </a>
                  <a
                    href={`tel:${CONTACT.phoneE164}`}
                    className="block text-sm text-gray-600 hover:text-black transition-colors duration-300"
                  >
                    {CONTACT.phone}
                  </a>
                  <Text size="caption" color="muted">
                    {CONTACT.location}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <Divider className="mb-6 md:mb-8" />

        <FadeIn>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
            <Text size="caption" color="muted" className="order-3 md:order-1 text-center md:text-left">
              &copy; {currentYear} FutureAds. All rights reserved.
            </Text>

            <div className="flex items-center justify-center gap-4 md:gap-6 order-2">
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
              className="group inline-flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-black transition-colors duration-300 order-1 md:order-3"
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
