import { Component, useEffect, useRef, useState } from 'react'
import { Heading, Text, Button } from '../ui'
import { CONTACT } from '../../config/contact'
import {
  MANUAL_COPY,
  buildGmailUrl,
  buildMailtoUrl,
  buildMessage,
  buildOutlookUrl,
  hasEndpoint,
  initialValues,
  submitInquiry,
  validate,
  validateField,
} from '../../lib/inquiry'

const DRAFT_KEY = 'futureads.inquiry.draft'
const PANEL_CHROME = 'mt-8 border border-black bg-white p-6 md:p-8 scroll-mt-28'

/* sessionStorage, not localStorage: the draft survives an accidental Cancel, a
   reload, and tabbing away to a webmail compose window, but dies with the tab —
   which is what makes the privacy line under the form literally true.
   Every access is wrapped, including the accessor itself: reading
   window.sessionStorage throws outright in some privacy configurations. */
const readDraft = () => {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeDraft = (draft) => {
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {
    /* private mode, quota, or a blocked accessor — the form still works */
  }
}

const clearDraft = () => {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    /* nothing to do */
  }
}

/* border-gray-500 (#737373, 4.74:1 on white) is the floor for a control
   boundary under WCAG 1.4.11; gray-300 and gray-400 both fail.
   text-[16px] rather than text-body because globals.css sets html to 15px
   under 640px, and anything under 16px makes iOS Safari zoom on focus.
   An outline rather than a ring: rings are box-shadows and vanish in Windows
   forced-colors mode.
   minHeight is a parameter rather than something callers append, because two
   min-h utilities on one element have equal specificity and the winner is
   decided by Tailwind's emission order — which puts min-h-[44px] last, silently
   flattening any taller floor added on top of it. */
const controlClass = (invalid, minHeight = 'min-h-[44px]') =>
  `w-full ${minHeight} px-4 py-3 bg-white text-black text-[16px] leading-[1.6] ` +
  (invalid ? 'border-2 border-black ' : 'border border-gray-500 ') +
  'focus:border-black ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ' +
  'transition-colors duration-300'

const Field = ({ id, label, error, hint, children }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-caption text-gray-600 uppercase tracking-wider mb-2"
    >
      {label}
    </label>
    {children}
    {hint && !error && <p className="mt-2 text-caption text-gray-600">{hint}</p>}
    {error && (
      /* The palette has no red, so the error carries three non-colour cues:
         the glyph, the semibold weight, and the control's doubled border. */
      <p
        id={`${id}-error`}
        className="mt-2 flex items-start gap-2 text-caption font-semibold text-black"
      >
        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center bg-black text-[11px] leading-none text-white"
        >
          !
        </span>
        {error}
      </p>
    )}
  </div>
)

const ComposeLinks = ({ values }) => (
  <div className="flex flex-wrap gap-3">
    <Button
      variant="secondary"
      href={buildGmailUrl(values)}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open in Gmail
    </Button>
    <Button
      variant="secondary"
      href={buildOutlookUrl(values)}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open in Outlook
    </Button>
    {/* mailto is deliberately last and never the only route: a browser with no
        registered mail handler drops it silently and there is no event to
        detect that, so it can only ever be an extra, not the mechanism. */}
    <Button variant="ghost" href={buildMailtoUrl(values)}>
      Open my mail app
    </Button>
  </div>
)

/* Scoped to this panel, never the app: an uncaught throw here would otherwise
   unmount the whole marketing site, which is strictly worse than a dead button.
   The fallback is itself a working way to reach the agency. */
class InquiryBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <div className={PANEL_CHROME}>
        <Heading as="h3" size="subtitle" className="mb-3">
          Something went wrong here
        </Heading>
        <Text color="muted" className="mb-6">
          Sorry &mdash; please email us directly and we&apos;ll pick it up from there.
        </Text>
        <div className="mb-6">
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-lg font-medium underline underline-offset-4 hover:text-gray-600 transition-colors duration-300 break-all sm:break-normal"
          >
            {CONTACT.email}
          </a>
        </div>
        <ComposeLinks values={initialValues} />
      </div>
    )
  }
}

const InquiryPanelInner = ({ id, onClose }) => {
  const [values, setValues] = useState(() => {
    const draft = readDraft()
    return draft ? { ...initialValues, ...draft, _gotcha: '' } : initialValues
  })
  const [restored, setRestored] = useState(() => Boolean(readDraft()))
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [attempted, setAttempted] = useState(false)
  // No 'error' status by design: every failure resolves into 'manual' with a
  // reason, so the UI can never dead-end.
  const [status, setStatus] = useState('form')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  const panelRef = useRef(null)
  const outputRef = useRef(null)
  const fieldRefs = useRef({})
  const copyTimer = useRef(null)

  /* The panel mounts below the trigger, and Grid cols={2} collapses to one
     column under 768px — so on a phone a tap near the fold would otherwise
     render this entirely off-screen and reproduce the exact "nothing happened"
     symptom. block:'nearest' no-ops when it is already fully visible. */
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current
      if (!panel) return
      try {
        panel.scrollIntoView({
          block: 'nearest',
          // 'instant', not 'auto': 'auto' defers to the scrolling box's computed
          // scroll-behavior, and globals.css sets html { scroll-behavior: smooth }
          // unconditionally, so 'auto' would animate for someone who asked it not to.
          behavior: reduced ? 'instant' : 'smooth',
        })
      } catch {
        // An engine whose ScrollBehavior enum predates 'instant' rejects the
        // whole dictionary; scrolling at all matters more than how it scrolls.
        panel.scrollIntoView(true)
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (status === 'sent') {
      clearDraft()
      return
    }
    const { _gotcha, ...rest } = values
    if (!rest.name && !rest.email && !rest.company && !rest.message) {
      clearDraft()
      return
    }
    writeDraft(rest)
  }, [values, status])

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const setField = (field) => (e) => {
    const next = { ...values, [field]: e.target.value }
    setValues(next)
    // Reward early, punish late: only re-check a field that is already flagged.
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, next) }))
    }
  }

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values) }))
  }

  const visibleErrors = {}
  for (const field of ['name', 'email', 'message']) {
    if ((attempted || touched[field]) && errors[field]) {
      visibleErrors[field] = errors[field]
    }
  }

  const fieldProps = (field, fieldId) => ({
    id: fieldId,
    value: values[field],
    onChange: setField(field),
    onBlur: handleBlur(field),
    ref: (el) => {
      fieldRefs.current[field] = el
    },
    'aria-invalid': visibleErrors[field] ? true : undefined,
    'aria-describedby': visibleErrors[field] ? `${fieldId}-error` : undefined,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    setAttempted(true)
    const { errors: next, firstInvalid, count } = validate(values)
    setErrors(next)

    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus()
      setAnnouncement(`${count} field${count > 1 ? 's need' : ' needs'} attention.`)
      return
    }

    /* A tripped honeypot goes to the manual panel, never to a fabricated
       'sent'. Browser autofill can populate an off-screen field, and telling a
       real visitor their message was sent when it was not is the reported bug
       wearing a disguise. A bot still triggers no POST. */
    if (values._gotcha) {
      setResult({ mode: 'manual', reason: 'no-endpoint' })
      setStatus('manual')
      setAnnouncement('Your message is ready to copy.')
      return
    }

    setStatus('sending')
    setAnnouncement('Sending your message…')

    const r = await submitInquiry(values)
    setResult(r)
    setStatus(r.mode)
    setAnnouncement(r.mode === 'sent' ? 'Message sent.' : 'Your message is ready to copy.')
  }

  const markCopied = () => {
    setCopied(true)
    setAnnouncement('Message copied to clipboard.')
    clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopied(false), 2000)
  }

  /* Three layers: navigator.clipboard genuinely throws outside a secure
     context — file://, plain http, `vite --host` over a LAN IP — and an
     unhandled rejection there would produce a dead-looking button inside the
     fix for a dead button. */
  const handleCopy = async () => {
    const text = buildMessage(values)

    try {
      await navigator.clipboard.writeText(text)
      markCopied()
      return
    } catch {
      /* fall through to the legacy path */
    }

    try {
      const scratch = document.createElement('textarea')
      scratch.value = text
      scratch.setAttribute('readonly', '')
      scratch.style.position = 'fixed'
      scratch.style.top = '-9999px'
      document.body.appendChild(scratch)
      scratch.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(scratch)
      if (ok) {
        markCopied()
        return
      }
    } catch {
      /* fall through to select-in-place */
    }

    outputRef.current?.focus()
    outputRef.current?.select()
    setAnnouncement(
      'Copy is blocked in this browser. The message is selected — press Control C.'
    )
  }

  const startOver = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setAttempted(false)
    setRestored(false)
    clearDraft()
  }

  const isSending = status === 'sending'

  return (
    <div id={id} ref={panelRef} className={PANEL_CHROME}>
      {/* Mounted unconditionally: a live region only announces if it existed in
          the DOM before its text changed, which is also why none of the result
          panels below carry aria-live themselves. */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {(status === 'form' || isSending) && (
        <form onSubmit={handleSubmit} noValidate aria-busy={isSending} className="space-y-6">
          <div>
            <Heading as="h3" size="subtitle" className="mb-2">
              Tell us about your project
            </Heading>
            <Text color="muted">
              A few details are enough to get us started &mdash; we reply {CONTACT.replyWindow}.
            </Text>
          </div>

          {restored && (
            <div className="flex flex-wrap items-center gap-3">
              <Text size="caption" color="muted">
                Draft restored.
              </Text>
              <Button type="button" variant="ghost" size="small" onClick={startOver}>
                Start over
              </Button>
            </div>
          )}

          <Field id="iq-name" label="Name" error={visibleErrors.name}>
            <input
              {...fieldProps('name', 'iq-name')}
              name="name"
              type="text"
              required
              autoComplete="name"
              className={controlClass(Boolean(visibleErrors.name))}
            />
          </Field>

          <Field id="iq-email" label="Email" error={visibleErrors.email}>
            <input
              {...fieldProps('email', 'iq-email')}
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              className={controlClass(Boolean(visibleErrors.email))}
            />
          </Field>

          <Field id="iq-company" label="Company (optional)">
            <input
              {...fieldProps('company', 'iq-company')}
              name="organization"
              type="text"
              autoComplete="organization"
              className={controlClass(false)}
            />
          </Field>

          <Field
            id="iq-message"
            label="Project details"
            error={visibleErrors.message}
            hint="What you are building, roughly when, and anything else worth knowing."
          >
            <textarea
              {...fieldProps('message', 'iq-message')}
              name="message"
              required
              rows={5}
              maxLength={2000}
              className={controlClass(Boolean(visibleErrors.message), 'min-h-[140px]') + ' resize-y'}
            />
          </Field>

          {/* Off-screen rather than display:none — naive bots skip hidden
              fields. aria-hidden + tabIndex=-1 keep it away from anyone real. */}
          <div aria-hidden="true" className="absolute left-[-9999px] w-px h-px overflow-hidden">
            <label htmlFor="iq-gotcha">Leave this field empty</label>
            <input
              id="iq-gotcha"
              name="_gotcha"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values._gotcha}
              onChange={setField('_gotcha')}
            />
          </div>

          {!hasEndpoint && (
            <Text size="caption" color="muted">
              We&apos;ll compose your message and give you one-click ways to send it.
            </Text>
          )}
          <Text size="caption" color="muted">
            Your draft stays in this browser tab until you send it.
          </Text>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* aria-disabled, not the real disabled attribute: a disabled button
                drops focus mid-interaction and explains nothing to a keyboard user. */}
            <Button
              type="submit"
              variant="primary"
              aria-disabled={isSending || undefined}
              className="aria-disabled:opacity-60 aria-disabled:cursor-wait"
            >
              {isSending ? 'Sending…' : hasEndpoint ? 'Send message' : 'Prepare my message'}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {status === 'manual' && result && (
        <div className="space-y-6">
          <div>
            <Heading as="h3" size="subtitle" className="mb-2">
              {MANUAL_COPY[result.reason].heading}
              {result.reason === 'http' ? ` (${result.status})` : ''}
            </Heading>
            <Text color="muted">{MANUAL_COPY[result.reason].intro}</Text>
          </div>

          <Button variant="primary" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy message'}
          </Button>

          <div className="space-y-3">
            <Text size="caption" color="muted">
              Or open a compose window:
            </Text>
            {/* Plain https URLs — these always open a real page with the message
                prefilled, which is the actual fix for a machine with no mail
                handler registered. */}
            <ComposeLinks values={values} />
          </div>

          <div>
            <label
              htmlFor="iq-output"
              className="block text-caption text-gray-600 uppercase tracking-wider mb-2"
            >
              Your message
            </label>
            {/* readOnly, never disabled: disabled text cannot be selected and is
                skipped in the accessibility tree. */}
            <textarea
              id="iq-output"
              ref={outputRef}
              readOnly
              rows={8}
              value={buildMessage(values)}
              onFocus={(e) => e.target.select()}
              className={controlClass(false, 'min-h-[180px]')}
            />
          </div>

          <Text size="caption" color="muted">
            or email{' '}
            <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4">
              {CONTACT.email}
            </a>{' '}
            directly
          </Text>

          <div className="flex flex-wrap items-center gap-4">
            <Button type="button" variant="ghost" onClick={() => setStatus('form')}>
              Edit message
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}

      {status === 'sent' && (
        <div className="space-y-6">
          <div>
            <Heading as="h3" size="subtitle" className="mb-2">
              Thanks &mdash; message sent
            </Heading>
            <Text color="muted">
              We&apos;ll reply to {values.email} {CONTACT.replyWindow}.
            </Text>
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>
            Done
          </Button>
        </div>
      )}
    </div>
  )
}

const InquiryPanel = (props) => (
  <InquiryBoundary>
    <InquiryPanelInner {...props} />
  </InquiryBoundary>
)

export default InquiryPanel
