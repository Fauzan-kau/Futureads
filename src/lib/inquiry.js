/**
 * Project-inquiry transport and message building.
 *
 * CONTRACT: submitInquiry() never throws and never rejects. Every failure
 * resolves as { mode: 'manual', reason } so the UI always has somewhere to go.
 * That is what makes the "Start a Project" click impossible to turn back into
 * a silent no-op — all of the guarantees live here, once.
 *
 * This is the only module that knows about transport. Plugging in a backend
 * later means setting VITE_INQUIRY_ENDPOINT; nothing else changes.
 */
import { CONTACT } from '../config/contact'

// Written as full literals on purpose: Vite does static text replacement at
// build time, so import.meta.env[someKey] silently yields undefined in a build.
export const ENDPOINT = import.meta.env.VITE_INQUIRY_ENDPOINT || ''
export const ACCESS_KEY = import.meta.env.VITE_INQUIRY_ACCESS_KEY || ''
export const hasEndpoint = Boolean(ENDPOINT)

// _gotcha is the honeypot — the field name Formspree, Basin and Getform expect.
export const initialValues = {
  name: '',
  email: '',
  company: '',
  message: '',
  _gotcha: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * @returns {{ errors: Record<string,string>, firstInvalid: string|null, count: number }}
 * firstInvalid is in DOM order so focus can jump to the right control.
 */
export function validate(values) {
  const errors = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Please tell us your name.'
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = 'We need an email address to reply to.'
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'That email address does not look right.'
  }

  const message = values.message.trim()
  if (!message) {
    errors.message = 'Tell us a little about the project.'
  } else if (message.length < 20) {
    errors.message = 'A sentence or two more would help — 20 characters minimum.'
  }

  const order = ['name', 'email', 'message']
  const firstInvalid = order.find((field) => errors[field]) || null

  return { errors, firstInvalid, count: Object.keys(errors).length }
}

// One copy of every rule — field-level validation reads the same function.
export function validateField(field, values) {
  return validate(values).errors[field]
}

export function buildSubject(values) {
  const who = values.name.trim() || 'Website visitor'
  const co = values.company.trim()
  return `New project inquiry — ${who}${co ? ` (${co})` : ''}`
}

export function buildMessage(values) {
  return [
    'New project inquiry — FutureAds',
    '',
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    `Company: ${values.company.trim() || '—'}`,
    '',
    'Project details:',
    values.message.trim(),
    '',
    'Sent from futureads.agency',
  ].join('\n')
}

const TRUNC_NOTE =
  '\n\n[Message shortened here. The full text is on the page — use “Copy message”.]'

/**
 * Keep a compose URL under a client's length limit.
 * A silently truncated URL fails in a way that looks identical to a missing
 * mail handler, so trim the body deliberately and say so in the body itself.
 */
function capped(make, limit, full) {
  try {
    const whole = make(full)
    if (whole.length <= limit) return whole

    /* Cut on code points, never on UTF-16 code units. Slicing mid-surrogate —
       which any emoji in the brief makes likely — leaves a lone high surrogate,
       and encodeURIComponent throws URIError on it. These builders run during
       render, so that throw would take the whole panel down with it. */
    const points = Array.from(full)
    let count = points.length
    while (count > 0) {
      count = Math.max(0, count - 50)
      const url = make(points.slice(0, count).join('') + TRUNC_NOTE)
      if (url.length <= limit) return url
    }
    return make('')
  } catch {
    // A compose link with an empty body still opens a real window; one that
    // throws would unmount the panel holding the visitor's message.
    return make('')
  }
}

// 1800: Windows shells and several mail clients quietly refuse longer mailto URLs.
export function buildMailtoUrl(values) {
  const subject = encodeURIComponent(buildSubject(values))
  return capped(
    (body) =>
      `mailto:${CONTACT.email}?subject=${subject}&body=${encodeURIComponent(body)}`,
    1800,
    buildMessage(values)
  )
}

export function buildGmailUrl(values) {
  const to = encodeURIComponent(CONTACT.email)
  const su = encodeURIComponent(buildSubject(values))
  return capped(
    (body) =>
      `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${encodeURIComponent(body)}`,
    6000,
    buildMessage(values)
  )
}

export function buildOutlookUrl(values) {
  const to = encodeURIComponent(CONTACT.email)
  const subject = encodeURIComponent(buildSubject(values))
  return capped(
    (body) =>
      `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${subject}&body=${encodeURIComponent(body)}`,
    6000,
    buildMessage(values)
  )
}

// One flat payload that Formspree, Basin, Getform and Web3Forms all accept.
// `subject` is Web3Forms' key, `_subject` the Formspree family's — sending both
// is harmless and is what makes the endpoint genuinely drop-in.
function buildPayload(values) {
  const subject = buildSubject(values)
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    company: values.company.trim(),
    message: values.message.trim(),
    subject,
    _subject: subject,
    _source: 'futureads.agency',
    ...(ACCESS_KEY ? { access_key: ACCESS_KEY } : {}),
  }
}

/**
 * @returns {Promise<{ mode: 'sent'|'manual', reason: string|null, status?: number }>}
 * Only an HTTPS POST that comes back res.ok may ever report 'sent'.
 */
export async function submitInquiry(values) {
  if (!hasEndpoint) return { mode: 'manual', reason: 'no-endpoint' }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { mode: 'manual', reason: 'offline' }
  }

  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, 12000)

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      // Accept: application/json is load-bearing — it is what makes Formspree
      // answer with JSON instead of a 302 to its own thank-you page.
      // Never use mode: 'no-cors': an opaque response cannot tell us whether
      // the message arrived, which would make the success screen a lie.
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(buildPayload(values)),
      signal: controller.signal,
    })

    if (res.ok) return { mode: 'sent', reason: null }
    return { mode: 'manual', reason: 'http', status: res.status }
  } catch {
    return { mode: 'manual', reason: timedOut ? 'timeout' : 'network' }
  } finally {
    clearTimeout(timer)
  }
}

export const MANUAL_COPY = {
  'no-endpoint': {
    heading: 'One last step',
    intro: `Your message is ready. Send it to ${CONTACT.email} using any option below — we reply ${CONTACT.replyWindow}.`,
  },
  offline: {
    heading: 'You appear to be offline',
    intro: 'We could not send it. Copy your message and send it once you are back online.',
  },
  timeout: {
    heading: 'That took too long',
    intro: 'We could not confirm it was sent. Send it directly using any option below.',
  },
  http: {
    heading: 'The form service returned an error',
    intro: 'We could not send it automatically. Send it directly using any option below.',
  },
  network: {
    heading: 'We could not send that automatically',
    intro: 'Send it directly using any option below — nothing you typed is lost.',
  },
}
