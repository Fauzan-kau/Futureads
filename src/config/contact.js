/**
 * Single source of truth for the agency's contact channels.
 *
 * The address used to be hardcoded in five places (Contact.jsx x3, Footer.jsx x2);
 * the inquiry form would have made a sixth. Change it here and it changes everywhere.
 */
export const CONTACT = {
  email: 'futureads00@gmail.com',
  phone: '+91 98765 43210',
  phoneE164: '+919876543210',
  location: 'Kerala, India',
  replyWindow: 'within two working days',
}

/**
 * The Contact section and the Footer each carried their own hard-coded list,
 * and they disagreed: Contact advertised Instagram / LinkedIn / Behance at
 * href="#", the footer advertised Instagram / Facebook / YouTube with real
 * URLs. Two contradictory answers to the same question, 200px apart.
 */
export const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/future.ads_?igsi=MWI5aGtmZGFqaWJtZQ==' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61585164251234' },
  { label: 'YouTube', href: 'https://www.youtube.com/@Futureads00' },
]

export default CONTACT
