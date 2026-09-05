/**
 * Single source of truth for the agency's contact channels.
 *
 * The address used to be hardcoded in five places (Contact.jsx x3, Footer.jsx x2);
 * the inquiry form would have made a sixth. Change it here and it changes everywhere.
 */
export const CONTACT = {
  email: 'hello@futureads.agency',
  phone: '+91 98765 43210',
  phoneE164: '+919876543210',
  location: 'Kerala, India',
  replyWindow: 'within two working days',
}

export default CONTACT
