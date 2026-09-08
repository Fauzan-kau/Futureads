import { Component, useEffect, useRef, useState } from 'react'
import { Text, Button } from '../ui'
import { CONTACT } from '../../config/contact'
import PanelHeader, { TITLE_ID } from './PanelHeader'
import Field, { LABEL_CLASS, controlClass, outputClass } from './Field'
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
// Single source for the textarea's maxLength AND the counter, so they cannot drift.
const MESSAGE_MAX = 2000

/* sessionStorage, not localStorage: the draft survives a reload and tabbing away
   to a webmail compose window, but dies with the tab — which is what makes the
   privacy line under the form literally true.
   Every access is wrapped, including the accessor itself: reading
   window.sessionStorage throws outright in some privacy configurations.

   There is no companion "stage" key any more. It existed because the form used
   to live in a dialog that Escape, a ✕ and a backdrop click could all dismiss,
   taking the compose links — this deployment's only send mechanism — with them.
   The form is part of the page now: nothing dismisses it, the status survives
   for the whole visit, and a reload deliberately returns the visitor to an
   editable form with their words still in it rather than to a prepared message
   they have already copied. */
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

const ComposeLinks = ({ values }) => (
  <div className="flex flex-wrap gap-3">
    <Button
      variant="secondary"
      size="small"
      href={buildGmailUrl(values)}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open in Gmail
    </Button>
    <Button
      variant="secondary"
      size="small"
      href={buildOutlookUrl(values)}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open in Outlook
    </Button>
    {/* mailto is deliberately last and never the only route: a browser with no
        registered mail handler drops it silently and there is no event to
        detect that, so it can only ever be an extra, not the mechanism. */}
    <Button variant="ghost" size="small" href={buildMailtoUrl(values)}>
      Open my mail app
    </Button>
  </div>
)

/* The card. A 1px black rule is the site's only structural boundary — the same
   object as the process chips in the column beside it — so the form reads as a
   piece of the page rather than as an embedded widget. No shadow and no radius
   anywhere in this codebase; do not start here.
   The action row is a plain flex row at the end of the flow, NOT a sticky band:
   the band existed to keep a submit button on screen inside a dialog's own
   scroller, and there is no scroller now — the page scrolls, and the button is
   simply the last thing in the card. */
const CARD = 'bg-white border border-black p-6 sm:p-8 lg:p-9'

const ACTION_ROW = 'mt-8 pt-6 border-t border-gray-200'

/* Scoped to this form, never the app: an uncaught throw here would otherwise
   unmount the whole marketing site, which is strictly worse than a dead button.
   The fallback is itself a working way to reach the agency — the address and the
   prefilled compose links, which is exactly what the form's own happy path ends
   in on this deployment. */
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
      <div className={CARD}>
        {/* PanelHeader, not a bare Heading, precisely so TITLE_ID survives the
            crash: getDerivedStateFromError swaps the whole children subtree, and
            a header that lived only inside the working form would take
            #inquiry-title with it and leave the region nameless in the one state
            where the user most needs to be told what they are looking at. */}
        <PanelHeader
          eyebrow="Something went wrong"
          size="subtitle"
          title="Email us directly"
          lede="Sorry — this form stopped working. Everything below still does."
        />
        <div className="mt-8 space-y-6">
          <a
            href={`mailto:${CONTACT.email}`}
            className="block text-lg font-medium underline underline-offset-4 hover:text-gray-600 transition-colors duration-300 motion-reduce:transition-none break-all sm:break-normal"
          >
            {CONTACT.email}
          </a>
          <ComposeLinks values={initialValues} />
        </div>
      </div>
    )
  }
}

const InquiryFormInner = () => {
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
  const [messageFocused, setMessageFocused] = useState(false)

  const formRef = useRef(null)
  const headRef = useRef(null)
  const outputRef = useRef(null)
  const fieldRefs = useRef({})
  const copyTimer = useRef(null)
  const didMount = useRef(false)

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

  /* The control the user just activated is unmounted by every branch swap — the
     submit button by 'sent'/'manual', "Edit message" by the return to 'form' —
     and removing the focused element resets focus to <body> in every engine
     while firing NO focus event, so nothing notices and a keyboard user
     restarts from the top of the document. Moving focus to the region wrapper
     instead re-announces the heading and the new contents in one move.
     The WRAPPER, not the h2: its accessible name IS the heading
     (aria-labelledby) so the announcement is identical, but no engine matches
     :focus-visible on a programmatically focused container — whereas focusing
     the h2 made Chrome paint its default ring as a black rectangle around the
     headline.
     preventScroll because the card is on screen by definition at the moment the
     status changes; without it the page can jump under the user. */
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    headRef.current?.focus({ preventScroll: true })
  }, [status])

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

  const fieldProps = (field, fieldId, extraDescribedBy) => ({
    id: fieldId,
    value: values[field],
    onChange: setField(field),
    onBlur: handleBlur(field),
    ref: (el) => {
      fieldRefs.current[field] = el
    },
    'aria-invalid': visibleErrors[field] ? true : undefined,
    /* Error first — describedby is read in listed order and the problem should
       be heard before the guidance. The extra ids are dropped the moment an
       error replaces the hint in the DOM, so the reference can never dangle. */
    'aria-describedby':
      [
        visibleErrors[field] ? `${fieldId}-error` : null,
        visibleErrors[field] ? null : extraDescribedBy,
      ]
        .filter(Boolean)
        .join(' ') || undefined,
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
    if (r.mode === 'sent') clearDraft()
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
      const host = formRef.current || document.body
      host.appendChild(scratch)
      scratch.select()
      const ok = document.execCommand('copy')
      host.removeChild(scratch)
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
    setResult(null)
    setStatus('form')
    clearDraft()
  }

  const isSending = status === 'sending'
  const messageCount = values.message.length
  const showCount = messageFocused || messageCount > 0

  const head = (() => {
    if (status === 'manual' && result) {
      const copy = MANUAL_COPY[result.reason]
      return {
        eyebrow: 'Ready to send',
        /* subtitle, not title. text-title is up to 32px of Space Grotesk, and
           "We could not send that automatically" at 32px in this measure is two
           lines of display type shouting a server fault at a visitor. */
        size: 'subtitle',
        title: copy.heading,
        lede: copy.intro,
        note: result.reason === 'http' ? `The service responded ${result.status}.` : null,
      }
    }
    if (status === 'sent') {
      return {
        eyebrow: 'Message sent',
        size: 'title',
        title: 'Thanks — we have it',
        lede: `We'll reply to ${values.email} ${CONTACT.replyWindow}.`,
      }
    }
    return {
      eyebrow: 'Start a project',
      size: 'title',
      title: 'Tell us about your project',
      lede: `A few details are enough to get us started — we reply ${CONTACT.replyWindow}.`,
    }
  })()

  return (
    /* One <form> for every status. Wrapping the manual and sent screens in a
       form too costs nothing — neither submits — and it keeps the submit button
       of the 'form' state inside its own form element. */
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={isSending} className={CARD}>
      {/* Mounted unconditionally: a live region only announces if it existed in
          the DOM before its text changed, which is also why none of the result
          panels below carry aria-live themselves. */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {/* A labelled group, so the post-swap focus move announces "Tell us about
          your project, group" rather than a bare container. outline-none is safe
          here and only here: focus only ever arrives programmatically (tabIndex
          is -1, so this is not in the tab ring), and every control inside keeps
          its own visible ring. */}
      <div
        ref={headRef}
        tabIndex={-1}
        role="group"
        aria-labelledby={TITLE_ID}
        className="outline-none"
      >
        <PanelHeader {...head} />
      </div>

      {(status === 'form' || isSending) && (
        <div className="mt-8 space-y-5">
          {restored && (
            <div className="flex flex-wrap items-center gap-3">
              <Text size="caption" color="muted">
                Draft restored.
              </Text>
              <Button
                type="button"
                variant="link"
                size="small"
                onClick={startOver}
                className="px-0 py-0"
              >
                Start over
              </Button>
            </div>
          )}

          {/* 2-up from sm rather than md: inline, the card is a page-width block
              below lg and a ~600px grid column above it, so both columns clear
              the ~32 characters a real business email needs at every width the
              pair is actually shown. */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6">
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
          </div>

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
            hintId="iq-message-hint"
            hint="What you are building, roughly when, and anything else worth knowing."
            meta={
              /* aria-hidden on purpose: wired to a live region this would speak
                 on every keystroke and flood the single role="status" node.
                 Screen readers get the limit once, from #iq-message-limit in
                 aria-describedby, read on focus.
                 font-mono is the treatment the site already gives numerals
                 (Services index, Work counter). tabular-nums stops the digits
                 jittering. Transparent until the field is focused or has
                 content, so the label row's height never jumps and an empty form
                 is not greeted by a bureaucratic "0/2000".
                 Weight and value at the threshold, never colour — the palette
                 has no red, which is the same reason the error uses a glyph. */
              <span
                aria-hidden="true"
                className={
                  'shrink-0 font-mono text-[11px] tabular-nums transition-opacity duration-300 ease-out motion-reduce:transition-none ' +
                  (showCount ? 'opacity-100 ' : 'opacity-0 ') +
                  (messageCount >= 1900 ? 'font-medium text-black' : 'text-gray-500')
                }
              >
                {messageCount}/{MESSAGE_MAX}
              </span>
            }
          >
            <textarea
              {...fieldProps('message', 'iq-message', 'iq-message-hint iq-message-limit')}
              name="message"
              required
              rows={5}
              maxLength={MESSAGE_MAX}
              onFocus={() => setMessageFocused(true)}
              onBlur={(e) => {
                setMessageFocused(false)
                handleBlur('message')(e)
              }}
              className={controlClass(Boolean(visibleErrors.message), 'min-h-[128px]') + ' resize-y'}
            />
          </Field>
          <span id="iq-message-limit" className="sr-only">
            Up to {MESSAGE_MAX} characters.
          </span>

          {/* Off-screen, but NOT left:-9999px and NOT absolute: a 1x1 clipped box
              at its STATIC position cannot overflow in any direction, needs no
              containing block, and is still a real, rendered, fillable input —
              the only property naive bots actually test. */}
          <div
            aria-hidden="true"
            className="h-px w-px overflow-hidden whitespace-nowrap [clip:rect(0,0,0,0)] [clip-path:inset(50%)]"
          >
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

          <Text size="caption" color="muted">
            Your draft stays in this browser tab until you send it
            {!hasEndpoint &&
              ' — we’ll compose your message and give you one-click ways to send it'}
            .
          </Text>
        </div>
      )}

      {status === 'manual' && result && (
        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="iq-output" className={`${LABEL_CLASS} mb-2`}>
              Your message
            </label>
            {/* readOnly, never disabled: disabled text cannot be selected and is
                skipped in the accessibility tree, which would break the third
                clipboard tier whose whole job is select-in-place. */}
            <textarea
              id="iq-output"
              ref={outputRef}
              readOnly
              rows={8}
              value={buildMessage(values)}
              onFocus={(e) => e.target.select()}
              className={outputClass}
            />
          </div>

          <div className="space-y-3">
            <Text size="caption" color="muted">
              Or open a compose window:
            </Text>
            {/* Plain https URLs — these always open a real page with the message
                prefilled, which is the actual fix for a machine with no mail
                handler registered. */}
            <ComposeLinks values={values} />
          </div>

          <Text size="caption" color="muted">
            or email{' '}
            <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4">
              {CONTACT.email}
            </a>{' '}
            directly.{' '}
            {/* A link, not a button: the primary weight on this screen belongs to
                Copy, and "Edit message" is a way back, not the task. */}
            <Button
              type="button"
              variant="link"
              size="small"
              onClick={() => setStatus('form')}
              className="px-0 py-0"
            >
              Edit message
            </Button>
          </Text>
        </div>
      )}

      {status === 'sent' && (
        <div className="mt-8 border-l-2 border-black pl-4">
          <p className={LABEL_CLASS}>Replying to</p>
          <p className="mt-1 text-body font-medium break-all sm:break-normal">{values.email}</p>
        </div>
      )}

      <div className={ACTION_ROW}>
        {(status === 'form' || isSending) && (
          <div className="flex flex-wrap items-center gap-4">
            {/* aria-disabled, not the real disabled attribute: a disabled button
                drops focus mid-interaction and explains nothing to a keyboard
                user. */}
            {/* The button alone. A "we reply within two working days" caption
                beside it said exactly what the lede four rows above already
                says, and at 1024px — where this column is ~450px — it wrapped
                to its own line and left the action row looking like two
                unrelated things. */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              aria-disabled={isSending || undefined}
              className="aria-disabled:opacity-60 aria-disabled:cursor-wait"
            >
              {isSending ? 'Sending…' : hasEndpoint ? 'Send message' : 'Prepare my message'}
            </Button>
          </div>
        )}
        {status === 'manual' && result && (
          <div className="flex flex-wrap items-center gap-4">
            <Button type="button" variant="primary" size="large" onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy message'}
            </Button>
            <Button type="button" variant="ghost" onClick={startOver}>
              Start over
            </Button>
          </div>
        )}
        {status === 'sent' && (
          <Button type="button" variant="secondary" size="large" onClick={startOver}>
            Send another message
          </Button>
        )}
      </div>
    </form>
  )
}

/* The boundary is the exported shell. Its fallback wears the same card, so a
   crash costs the visitor the form and nothing else — the section, the page and
   every other route to the agency stay exactly where they were. */
const InquiryForm = () => (
  <InquiryBoundary>
    <InquiryFormInner />
  </InquiryBoundary>
)

export default InquiryForm
