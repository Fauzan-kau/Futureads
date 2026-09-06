import { Component, useEffect, useRef, useState } from 'react'
import { Text, Button } from '../ui'
import { CONTACT } from '../../config/contact'
import InquiryModal from './InquiryModal'
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

/* A second, tiny key beside the draft. The 'manual' branch's Copy button and
   compose links ARE this deployment's send mechanism — there is no .env, so
   submitInquiry short-circuits at inquiry.js:175 and every submission lands
   there. A modal adds Escape, the close button and a backdrop click as dismiss
   routes the inline disclosure never had, and re-initialising to an empty 'form'
   after any of them would throw away the only screen that can actually send.
   Reopening — or reloading the tab — now lands the visitor back on their compose
   links. Guarded on MANUAL_COPY so a malformed or stale value can never index
   undefined and take the panel down. */
const STAGE_KEY = 'futureads.inquiry.stage'

const readStage = () => {
  try {
    const raw = window.sessionStorage.getItem(STAGE_KEY)
    const stage = raw ? JSON.parse(raw) : null
    return stage && MANUAL_COPY[stage.reason] ? stage : null
  } catch {
    return null
  }
}

const writeStage = (stage) => {
  try {
    window.sessionStorage.setItem(STAGE_KEY, JSON.stringify(stage))
  } catch {
    /* private mode, quota, or a blocked accessor */
  }
}

const clearStage = () => {
  try {
    window.sessionStorage.removeItem(STAGE_KEY)
  } catch {
    /* nothing to do */
  }
}

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

/* The scroller and this band are FLEX SIBLINGS inside the panel, and this one
   carries shrink-0. It was `position: sticky; bottom: 0` inside the scroller
   first, and that measurably did not work: at a 320x400 viewport the band
   rendered 22px below the scrollport, and the overshoot grew 1:1 with every pixel
   the viewport lost — 222px at 320x200 — putting the only submit button
   off-screen. Tall viewports hid it because the content happened to fit.
   Landscape phones are ~390px tall and land squarely in the broken range.
   As a non-shrinking flex row it is visible at every height by layout, with no
   sticky constraint, no containing-block subtleties and nothing to regress.
   On a 1366x768 laptop the form is ~700px inside a ~600px cap, so without this
   the submit opens below the fold of a nested scroller — a fold the inline
   disclosure never had. There is now no scroll position with no visible action.
   No negative margins any more: the band is a direct panel child, so it owns its
   own px-6 rather than cancelling the scroller's.
   pt-5 + pb-[calc(...)] rather than py-5 + pb-[...]: two different properties, so
   there is no emission-order collision between them. */
const ACTION_BAND =
  'inq-g3 inq-actions shrink-0 border-t border-gray-200 bg-white ' +
  'px-6 sm:px-8 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]'

/* px-6 (24px) comfortably absorbs the 4px an outline-offset-4 focus ring needs,
   so no ring is ever clipped. overscroll-contain stops a flick at the end
   chaining out to the locked page. This is the ONLY scroller in the dialog: the
   layer never scrolls, so the site's global gray-100 scrollbar track never paints
   a light stripe down the black scrim — it renders inside a white panel, where it
   reads native. */
const SCROLLER =
  'inq-scroll min-h-0 overflow-y-auto overscroll-contain px-6 pt-8 pb-6 sm:px-8 sm:pt-10'

/* Scoped to this panel, never the app: an uncaught throw here would otherwise
   unmount the whole marketing site, which is strictly worse than a dead button.
   The fallback is itself a working way to reach the agency.
   Rendered INSIDE the shell (see the composition at the bottom), so its fallback
   inherits the dialog frame, the close button, Escape, the focus trap and — above
   all — the effect cleanup that un-inerts #root and unpins the body. */
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
      // Same scroller + non-shrinking band column as the working panel, so the
      // fallback's Close button is on screen at every viewport height too.
      <div className="flex min-h-0 flex-col">
        <div className={SCROLLER}>
          {/* PanelHeader, not a bare Heading, precisely so TITLE_ID survives the
              crash. getDerivedStateFromError swaps the whole children subtree, so
              a hoisted header that lived inside InquiryPanelInner would take
              #inquiry-title with it and leave the dialog nameless in the one state
              where the user most needs to be told what they are looking at. */}
          <PanelHeader
            eyebrow="Something went wrong"
            size="subtitle"
            title="Email us directly"
            lede="Sorry — this form stopped working. Everything below still does."
          />
          <div className="inq-g2 mt-8 space-y-6">
            <a
              href={`mailto:${CONTACT.email}`}
              className="block text-lg font-medium underline underline-offset-4 hover:text-gray-600 transition-colors duration-300 motion-reduce:transition-none break-all sm:break-normal"
            >
              {CONTACT.email}
            </a>
            <ComposeLinks values={initialValues} />
          </div>
        </div>
        <div className={ACTION_BAND}>
          <Button type="button" variant="ghost" onClick={this.props.onClose}>
            Close
          </Button>
        </div>
      </div>
    )
  }
}

const InquiryPanelInner = ({ dialogId, onClose, onStageChange }) => {
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
  const [status, setStatus] = useState(() => (readStage() ? 'manual' : 'form'))
  const [result, setResult] = useState(() => {
    const stage = readStage()
    return stage ? { mode: 'manual', reason: stage.reason, status: stage.status } : null
  })
  const [copied, setCopied] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [messageFocused, setMessageFocused] = useState(false)

  /* panelRef and the mount-time scrollIntoView effect are DELETED. That effect
     existed only because the panel rendered inline below the trigger and could
     land off-screen on a phone. Inside a position:fixed overlay it is actively
     wrong: it would scroll the page BEHIND the dialog, fight the body lock, and
     on iOS cause exactly the scroll bleed the lock exists to prevent. Its job is
     now done by three things a modal owes anyway — initial focus on the dialog,
     the entrance animation as the "something happened" signal, and the lock's
     exact scrollY restore on close. Do not reach for scrollIntoView again. */
  const contentRef = useRef(null)
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

  useEffect(() => {
    if (status === 'manual' && result) writeStage({ reason: result.reason, status: result.status })
    else clearStage()
  }, [status, result])

  // Reported up so the shell can refuse a BACKDROP dismiss from the two states
  // where an accidental click costs something. Escape and the labelled buttons
  // stay live everywhere: a dialog that refuses Escape is worse than a
  // re-prepared message, and the draft plus the persisted stage survive both.
  useEffect(() => {
    onStageChange(status)
  }, [status, onStageChange])

  /* The control the user just activated is unmounted by every branch swap — the
     submit button by 'sent'/'manual', "Edit message" by the return to 'form' —
     and removing the focused element resets focus to <body> in every engine
     while firing NO focus event, so nothing notices. That leaves focus outside a
     role="dialog" aria-modal="true" element, next to an inert, aria-hidden
     #root: NVDA and JAWS park the virtual cursor at a document root whose entire
     content is hidden. Focusing the heading rather than the container
     re-announces the dialog and its new contents in one move.
     The CONTAINER, not the heading: the container's accessible name is the
     heading (aria-labelledby), so the announcement is the same, but no engine
     matches :focus-visible on a programmatically focused container — whereas
     focusing the h2 made Chrome paint its default ring as a full-width black
     rectangle around the headline.
     By id, not by ref: this is the convention Header.jsx:47 and Contact.jsx:158
     already use. Skipped on mount, where the shell has just focused the same
     container on purpose. */
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    document.getElementById(dialogId)?.focus({ preventScroll: true })
  }, [status, dialogId])

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
       error replaces the hint in the DOM, so the reference can never dangle.
       This is what finally makes the hint and the character limit reach a screen
       reader at all: before it, aria-describedby was the error's slot alone and
       the hint was announced to nobody. */
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
    /* Clears even when the dialog was dismissed mid-POST. setState on an
       unmounted component is a SILENT no-op in React 18 — not even a warning —
       so the [values, status] effect that normally clears on 'sent' would never
       run, and the next open would restore the draft and offer to send a message
       the server has already accepted. A failure deliberately keeps the draft. */
    if (r.mode === 'sent') {
      clearDraft()
      clearStage()
    }
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
      /* Inside the dialog, not document.body. It is position:fixed so its parent
         is cosmetically irrelevant, but being a descendant of the panel makes it
         correct by construction for three separate mechanisms: the focus guard's
         containment test, aria-modal's virtual-buffer filtering, and any future
         inert change. Appended to body it sat outside all three. */
      const host = contentRef.current || document.body
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
    clearDraft()
    clearStage()
  }

  const isSending = status === 'sending'
  const messageCount = values.message.length
  const showCount = messageFocused || messageCount > 0

  const head = (() => {
    if (status === 'manual' && result) {
      const copy = MANUAL_COPY[result.reason]
      return {
        /* Not 'One more step': MANUAL_COPY's no-endpoint heading is literally
           'One last step', and eyebrow-over-headline read as a stutter. This one
           is true of all five reasons — the message is composed either way. */
        eyebrow: 'Ready to send',
        /* subtitle, not title. text-title is up to 32px of Space Grotesk, and
           "We could not send that automatically" at 32px in a 512px measure is
           two lines of display type shouting a server fault at a visitor. */
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
    /* One <form> for every status, and it is the panel's flex column: the
       scroller and the action band are its two children, so the band is a
       non-shrinking row that layout keeps on screen at any height. Wrapping the
       manual and sent screens in a form too costs nothing — neither submits —
       and it keeps the submit button of the 'form' state inside its own form
       element, which a band hoisted out of the branch switch would otherwise
       have needed a `form="…"` attribute to reach. */
    <form
      ref={contentRef}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isSending}
      className="flex min-h-0 flex-col"
    >
      {/* Mounted unconditionally: a live region only announces if it existed in
          the DOM before its text changed, which is also why none of the result
          panels below carry aria-live themselves. It sits INSIDE role="dialog" on
          purpose — aria-modal filters the virtual buffer to the dialog on some AT
          stacks — and outside #root, so the background's inert/aria-hidden cannot
          silence it. */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div className={SCROLLER}>
        <PanelHeader {...head} />

        {(status === 'form' || isSending) && (
          <div className="inq-g2 mt-8 space-y-5">
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

            {/* 2-up at md, not sm. At sm the panel is 34rem: a 480px content box
                gives 228px columns, about 28 characters of 16px Inter, and
                firstname.lastname@company.co.uk is 32 — a real business email
                would scroll inside its own field. At md the panel is 38rem, the
                content box 544px and the columns 260px. There is no vertical
                pressure at 640-767px that would justify pairing them anyway; the
                panel is short of width there, not of height. */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-6">
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
                   (Services index, Work counter); JetBrains Mono is loaded in
                   index.html. tabular-nums stops the digits jittering.
                   Rendered always but transparent until the field is focused or
                   has content, so the label row's height never jumps and an empty
                   form is not greeted by a bureaucratic "0/2000".
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
                rows={4}
                maxLength={MESSAGE_MAX}
                onFocus={() => setMessageFocused(true)}
                onBlur={(e) => {
                  setMessageFocused(false)
                  handleBlur('message')(e)
                }}
                /* 112px is still four visible lines at 16px/1.6 and buys back
                   ~28px of the ~120px this panel needs to trim to clear the fold
                   on a 1366x768 laptop. */
                className={controlClass(Boolean(visibleErrors.message), 'min-h-[112px]') + ' resize-y'}
              />
            </Field>
            <span id="iq-message-limit" className="sr-only">
              Up to {MESSAGE_MAX} characters.
            </span>

            {/* Off-screen, but NOT left:-9999px any more, and NOT absolute. The
                old idiom needed a positioned ancestor it inherited nine levels up
                from FadeIn's inline transform; inside a modal it would resolve
                against the panel and sit inside a scroller whose overflow-y:auto
                forces overflow-x to auto — one stylesheet edit away from a
                horizontal scrollbar inside the dialog. A 1x1 clipped box at its
                STATIC position cannot overflow in any direction, needs no
                containing block at all, and is still a real, rendered, fillable
                input — the only property naive bots actually test. Outside every
                .inq-g* group so it never acquires a transform, and kept out of the
                tab ring by the trap's tabIndex >= 0 filter. */}
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

            {/* One line, not two. The two fine-print paragraphs said the same
                thing twice and cost 50px in a panel that needs the height. */}
            <Text size="caption" color="muted">
              Your draft stays in this browser tab until you send it
              {!hasEndpoint &&
                ' — we’ll compose your message and give you one-click ways to send it'}
              .
            </Text>
          </div>
        )}

        {status === 'manual' && result && (
          <div className="inq-g2 mt-8 space-y-6">
            <div>
              <label htmlFor="iq-output" className={`${LABEL_CLASS} mb-2`}>
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
                className={outputClass}
              />
            </div>

            <div className="space-y-3">
              <Text size="caption" color="muted">
                Or open a compose window:
              </Text>
              {/* Plain https URLs — these always open a real page with the message
                  prefilled, which is the actual fix for a machine with no mail
                  handler registered. mailto is last inside ComposeLinks and never
                  the only route. */}
              <ComposeLinks values={values} />
            </div>

            <Text size="caption" color="muted">
              or email{' '}
              <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4">
                {CONTACT.email}
              </a>{' '}
              directly.{' '}
              {/* A link, not a button: the primary weight on this screen belongs
                  to Copy, and "Edit message" is a way back, not the task. */}
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
          <div className="inq-g2 mt-8 border-l-2 border-black pl-4">
            <p className={LABEL_CLASS}>Replying to</p>
            <p className="mt-1 text-body font-medium break-all sm:break-normal">{values.email}</p>
          </div>
        )}
      </div>

      {/* One band, outside the scroller, its contents switched by status.
          Rendered for every state so the panel always ends on the same rule
          and the same 20px band — the alternative re-lays the panel's bottom
          edge on each swap. */}
      <div className={ACTION_BAND}>
        {(status === 'form' || isSending) && (
          <div className="flex flex-wrap items-center gap-4">
            {/* aria-disabled, not the real disabled attribute: a disabled button
                drops focus mid-interaction — inside a focus trap that means
                focus falls to <body> and Tab restarts from nowhere — and it
                explains nothing to a keyboard user. */}
            <Button
              type="submit"
              variant="primary"
              aria-disabled={isSending || undefined}
              className="aria-disabled:opacity-60 aria-disabled:cursor-wait"
            >
              {isSending ? 'Sending…' : hasEndpoint ? 'Send message' : 'Prepare my message'}
            </Button>
            {/* Kept alongside the corner close button: a labelled exit costs
                nothing and is the one route a user who has not noticed the
                corner glyph will find. */}
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        )}
        {status === 'manual' && result && (
          <div className="flex flex-wrap items-center gap-4">
            <Button type="button" variant="primary" onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy message'}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
        {status === 'sent' && (
          <Button type="button" variant="primary" onClick={onClose}>
            Done
          </Button>
        )}
      </div>
    </form>
  )
}

const InquiryPanel = ({ id, phase, onRequestClose, onExited }) => {
  const [stage, setStage] = useState('form')

  return (
    <InquiryModal
      id={id}
      titleId={TITLE_ID}
      phase={phase}
      onRequestClose={onRequestClose}
      onExited={onExited}
      /* An accidental click on the dim must not abandon an in-flight POST, nor
         throw away the compose links that are this deployment's only send
         mechanism. Escape and the labelled buttons stay live at every status. */
      dismissOnBackdrop={stage !== 'sending' && stage !== 'manual'}
    >
      {/* The boundary sits INSIDE the shell. A throw in the form must not be able
          to take away the dialog frame, the close button, Escape, the focus trap
          — or, above all, the effect cleanup that removes inert from #root and
          unpins the body. Wrapped the other way round, a render-phase throw would
          unmount the shell and render the fallback into a page that is inert and
          unscrollable: a dead site instead of a dead form, which is the precise
          outcome this boundary was written to prevent. */}
      <InquiryBoundary onClose={onRequestClose}>
        <InquiryPanelInner dialogId={id} onClose={onRequestClose} onStageChange={setStage} />
      </InquiryBoundary>
    </InquiryModal>
  )
}

export default InquiryPanel
