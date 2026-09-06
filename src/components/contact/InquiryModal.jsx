import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const TABBABLE = 'a[href], button, input, select, textarea, [tabindex]'

/* el.tabIndex, not the [tabindex] attribute. This is the ONLY filter that keeps
   the _gotcha honeypot out of the ring: it is a real, rendered 1x1 input, so the
   "has layout boxes" test below reports getClientRects().length === 1 and waves
   it straight through. Tab would then land on an invisible field and focus
   would appear, to the user, to have vanished — with no visible symptom to
   debug. Do not reorder or "tidy" this. */
const isTabbable = (el) =>
  el.tabIndex >= 0 &&
  !el.hasAttribute('disabled') &&
  !el.closest('[aria-hidden="true"], [inert]') &&
  (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0)

// `inert` is not a React 18 DOM prop; setting it in JSX either warns or does
// nothing useful, so it goes on as an attribute behind a feature test.
const supportsInert = () =>
  typeof HTMLElement !== 'undefined' && 'inert' in HTMLElement.prototype

const lockBackground = () => {
  const html = document.documentElement
  const body = document.body
  const root = document.getElementById('root')
  const hadGutter = window.innerWidth - html.clientWidth > 0

  const prev = {
    htmlOverflowY: html.style.overflowY,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyRight: body.style.right,
    bodyWidth: body.style.width,
    rootHadInert: root ? root.hasAttribute('inert') : false,
    rootAriaHidden: root ? root.getAttribute('aria-hidden') : null,
    scrollY: window.scrollY,
    hadGutter,
  }

  /* NOT body { overflow: hidden }. The root element's overflow is propagated to
     the viewport, and body's is propagated only while html's own overflow
     computes to `visible` — which above 768px it does not, because
     globals.css:172-176 pins html { overflow-y: scroll } there. So the textbook
     body-overflow lock is a SILENT no-op on this site on desktop and works on
     mobile: an inversion you would never catch testing at one width.
     position:fixed is also the only technique that reliably holds iOS Safari,
     where overflow:hidden stops neither touch scroll nor rubber-band.
     Verified before choosing it: every position:absolute in src/ sits inside an
     explicitly `relative` Section or Container, so nothing in the page resolves
     against the initial containing block and nothing moves when body becomes a
     positioned element. globals.css also sets body { margin: 0 }, so body's
     padding box sits at document origin and even a future ICB-relative absolute
     would land in the same place. */
  body.style.position = 'fixed'
  body.style.top = `-${prev.scrollY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'

  /* Only when a gutter was ACTUALLY reserved. Pinning body removes the
     document's scrollable overflow, so below 768px — where globals.css does not
     pin overflow-y — the classic scrollbar would disappear and the page would
     widen by its width behind the scrim. Forcing `scroll` unconditionally has
     the opposite failure: it ADDS a scrollbar on a viewport taller than the
     page. Measuring first is correct at every width, and is a no-op on overlay-
     scrollbar platforms (iOS, macOS default) where the delta is 0. */
  if (hadGutter) html.style.overflowY = 'scroll'

  /* inert removes the background from focus, hit-testing, the accessibility tree
     and find-in-page in one attribute; aria-hidden is the fallback for engines
     without it.
     #root, NEVER document.body: the dialog is a body child, so inerting body
     would take the dialog — and the role="status" live region inside it — with
     it, and would also break the clipboard fallback's scratch textarea. Because
     the dialog lives OUTSIDE the hidden subtree, this is the one arrangement
     where aria-hidden is not an ARIA violation.
     Note this BLURS the trigger — inerting an ancestor of the focused element
     drops focus to <body> — which is why the panel is focused on the very next
     line, and why focus is restored later by id rather than from a captured
     document.activeElement. */
  if (root) {
    if (supportsInert()) root.setAttribute('inert', '')
    root.setAttribute('aria-hidden', 'true')
  }

  return prev
}

const releaseBackground = (prev) => {
  const html = document.documentElement
  const body = document.body
  const root = document.getElementById('root')

  if (root) {
    if (!prev.rootHadInert) root.removeAttribute('inert')
    if (prev.rootAriaHidden === null) root.removeAttribute('aria-hidden')
    else root.setAttribute('aria-hidden', prev.rootAriaHidden)
  }

  body.style.position = prev.bodyPosition
  body.style.top = prev.bodyTop
  body.style.left = prev.bodyLeft
  body.style.right = prev.bodyRight
  body.style.width = prev.bodyWidth
  if (prev.hadGutter) html.style.overflowY = prev.htmlOverflowY

  /* A plain, instant scrollTo. globals.css does not currently set
     scroll-behavior: smooth, so there is nothing to suppress here and no
     behavior:'instant' to hand an engine whose ScrollBehavior enum predates it.
     Do NOT read that absence as a settled decision: the property was removed
     chasing a masthead bug it did not cause (see the note on html in
     globals.css, which names this call). If it ever comes back, this line has
     to be made immune to it — set documentElement.style.scrollBehavior='auto'
     around it and restore after — or the page swoops under a closing dialog. */
  window.scrollTo(0, prev.scrollY)
}

const InquiryModal = ({
  id,
  titleId,
  phase,                    // 'open' | 'closing'
  onRequestClose,
  onExited,
  dismissOnBackdrop = true,
  children,
}) => {
  const panelRef = useRef(null)
  const lockRef = useRef(null)
  const finishedRef = useRef(false)
  const downOnLayer = useRef(false)
  const closing = phase === 'closing'

  // Mirrored into refs so the document-level listeners below depend only on
  // `closing`. Callers pass inline arrows; without this the keydown listener
  // would tear down and re-subscribe on every render.
  const closeRef = useRef(onRequestClose)
  const exitRef = useRef(onExited)
  closeRef.current = onRequestClose
  exitRef.current = onExited

  /* One effect for the whole MOUNTED life — open AND closing — so nothing is
     released while the exit is still playing. StrictMode double-invokes it in
     dev as lock -> release -> lock; that is idempotent because the previous
     inline values are captured and restored and nothing scrolls in between. */
  useEffect(() => {
    lockRef.current = lockBackground()
    // Immediately after the inert above, which blurred whatever had focus.
    // The panel container, not the first input: auto-focusing a text field opens
    // the soft keyboard over the dialog on a phone and skips past the eyebrow,
    // headline and lede a screen-reader user has not heard yet.
    // preventScroll so nothing nudges the panel's own scroller mid-entrance.
    panelRef.current?.focus({ preventScroll: true })
    return () => {
      if (lockRef.current) {
        releaseBackground(lockRef.current)
        lockRef.current = null
      }
    }
  }, [])

  const finish = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    /* Release BEFORE handing control back. The trigger lives inside #root, and
       .focus() on an element inside an inert subtree is a silent no-op — so
       releasing in the unmount cleanup instead would make Contact's focus
       restoration fail and strand focus on <body> the instant the portal is
       removed. This ordering is the whole answer to "never strand focus", and
       there is no error, warning or visual symptom when it regresses. */
    if (lockRef.current) {
      releaseBackground(lockRef.current)
      lockRef.current = null
    }
    exitRef.current()
  }

  useEffect(() => {
    if (!closing) return
    const panel = panelRef.current

    /* Read the RESOLVED exit animation-name, once, after React has committed the
       class swap. Two things fall out of this and neither is optional:
       - The reduced-motion block renames the exit to inqScrimOut, so a hard
         'inqPanelOut' string would never match and the listener would be dead
         for exactly the users least likely to be in a test pass.
       - Swapping .inq-panel-in for .inq-panel-out CANCELS the entrance, which
         fires animationcancel on this same node. Filtering on the exit's name
         is what stops that cancel from unmounting the dialog before its exit has
         played a single frame.
       An animation that resolved to `none` fires no animationend, ever — not
       late, never — so that is checked and finished synchronously. */
    const exitName = panel ? window.getComputedStyle(panel).animationName : 'none'
    if (!panel || exitName === 'none' || exitName === '') {
      finish()
      return
    }

    const onEnd = (e) => {
      // Children's animation events BUBBLE. Only this node's own exit counts.
      if (e.target !== panel || e.animationName !== exitName) return
      finish()
    }
    panel.addEventListener('animationend', onEnd)
    panel.addEventListener('animationcancel', onEnd)
    /* Always armed, never an `else`: a backgrounded tab throttles compositing but
       not timers, and an extension that display:none's the overlay cancels
       rather than ends. 600ms is deliberately unrelated to the 160ms exit so the
       CSS timing and this number can never drift apart. finish() is idempotent,
       so whichever arrives first wins. */
    const t = setTimeout(finish, 600)
    return () => {
      panel.removeEventListener('animationend', onEnd)
      panel.removeEventListener('animationcancel', onEnd)
      clearTimeout(t)
    }
  }, [closing])

  useEffect(() => {
    const onKeyDown = (e) => {
      /* isComposing FIRST: Escape during an IME composition cancels the
         composition, and a capture-phase listener would otherwise steal it and
         close the dialog out from under someone mid-word. keyCode 229 is the
         same sentinel on older Safari. */
      if (e.isComposing || e.keyCode === 229) return

      if (e.key === 'Escape') {
        if (closing) return
        // Capture phase, so the topmost layer wins over Header.jsx:49's own
        // document-level Escape listener if its mobile menu is also open.
        e.stopPropagation()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return

      /* Deliberately NOT gated on `closing`. The panel is still mounted and every
         control in it is still in the tab order for the whole exit —
         pointer-events affects hit-testing, not sequential navigation — so a
         trap switched off here lets Tab walk forward past the portal into
         browser chrome, since the background #root is inert and skipped. In the
         worst case (throttled tab) that window is the full 600ms net. */
      const panel = panelRef.current
      if (!panel) return
      // Recomputed on every Tab, never cached: the tabbable set is completely
      // different in 'form', 'manual' and 'sent', and changes again each time an
      // error <p> appears or the compose links mount.
      const items = Array.from(panel.querySelectorAll(TABBABLE)).filter(isTabbable)
      if (items.length === 0) {
        e.preventDefault()
        panel.focus({ preventScroll: true })
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (e.shiftKey) {
        /* `active === panel` is the load-bearing term. Initial focus is the
           tabIndex={-1} container, and panel.contains(panel) is true, so without
           it the very first Shift+Tab — the most common orienting keystroke in a
           new dialog — walks backwards out: everything before the portal is the
           inert #root, so focus leaves the document into browser chrome. */
        if (active === first || active === panel || !panel.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last || !panel.contains(active)) {
        // Forward Tab from the container itself needs no interception: the
        // browser's own sequential order already lands on `first`.
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [closing])

  /* The Tab handler makes the wrap ordered; THIS is what makes it a trap. Focus
     can enter the background with no Tab keydown ever reaching us — clicking
     browser chrome and shift-tabbing back in, a screen reader's own focus
     commands, an engine with no inert support. */
  useEffect(() => {
    if (closing) return
    const onFocusIn = (e) => {
      const panel = panelRef.current
      if (!panel || panel.contains(e.target)) return
      /* Scoped to #root, NOT to "anything that is not the panel". A password
         manager's inline fill menu and the clipboard fallback's scratch textarea
         are both appended to document.body — siblings of #root and of the
         portal. A blanket recapture would yank focus out of the fill menu the
         instant the user picks an entry (Name and Email are the two most
         autofilled fields on the site), and would blur the scratch textarea
         between .select() and execCommand('copy'), silently breaking the legacy
         copy path on every non-secure origin. This still catches the case the
         guard exists for: focus escaping into the inert page. */
      if (!document.getElementById('root')?.contains(e.target)) return
      panel.focus({ preventScroll: true })
    }
    document.addEventListener('focusin', onFocusIn)
    return () => document.removeEventListener('focusin', onFocusIn)
  }, [closing])

  /* pointerdown + pointerup, never a bare onClick with a target check. Dragging
     a selection out of the readonly "Your message" textarea and releasing over
     the dim fires `click` on the common ancestor — the layer — and the naive
     version dismisses the dialog the instant the user finishes selecting the
     text they were trying to copy. Requiring BOTH ends on the layer itself also
     means a drag that starts on the dim and ends on the panel is ignored. */
  const onPointerDown = (e) => {
    downOnLayer.current = e.button === 0 && e.target === e.currentTarget
  }
  const onPointerUp = (e) => {
    const started = downOnLayer.current
    downOnLayer.current = false
    if (!started || e.target !== e.currentTarget) return
    if (!dismissOnBackdrop || closing) return
    closeRef.current()
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    // z-[100] clears the sticky z-50 Header. sticky is a positioned value, so
    // the header still creates a stacking context and still competes here
    // exactly as it did while it was fixed. #root establishes no stacking
    // context (no z-index, no transform), so both compete in the root context.
    <div
      className="inq-layer z-[100] flex items-center justify-center p-4 sm:p-6"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* The dim is its own child, not the layer's background: on the layer its
          opacity animation would MULTIPLY the panel's. pointer-events:none so
          clicks fall through to the layer and the target test above holds.
          bg-black/70 rather than /60 plus a drop shadow — white composites to
          #4D4D4D under it, which is a 100+ value jump and separation enough.
          Header.jsx:196-198 records deleting the site's only box-shadow because
          it was "a soft blurred grey in a system built from hard 1px lines"; a
          64-80px bloom around a hard-edged card over a dark scrim is the same
          mistake, larger. The 1px black border is the whole boundary. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-black/70 ${closing ? 'inq-scrim-out' : 'inq-scrim-in'}`}
        style={{ pointerEvents: 'none' }}
      />

      {/* No outline-none on this node. Chrome, Safari and Firefox do not match
          :focus-visible on a programmatically focused tabindex="-1" container, so
          there is no ring to suppress — and suppressing one preemptively is how a
          real indicator gets deleted later.
          max-h-full resolves against the layer's content box, i.e. the svh height
          minus its own p-4/sm:p-6. The cap and the padding are therefore ONE
          number by construction and cannot drift apart. */}
      <div
        id={id}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={
          'relative flex max-h-full w-full max-w-[34rem] md:max-w-[38rem] flex-col ' +
          'border border-black bg-white ' +
          (closing ? 'inq-panel-out' : 'inq-panel-in')
        }
      >
        {/* The children own the scroller/action-band split, not this shell.
            The band was originally `position: sticky; bottom: 0` INSIDE a single
            scroller here, and it did not stick: measured in headless Chrome at a
            320x400 viewport the band rendered 22px below the scrollport and the
            overshoot grew 1:1 as the viewport shrank — 222px at 320x200 — so the
            submit button was simply off-screen. It only looked correct at tall
            viewports because the content happened to fit. Landscape phones
            (~390px tall) hit the broken case.
            A flex row that cannot shrink is guaranteed visible at every height by
            layout rather than by a sticky constraint, so the children render
            `.inq-scroll` (min-h-0, overflow-y-auto) and the band as its sibling.
            Keep this element a flex COLUMN with max-h-full and keep min-h-0 on
            the child scroller: a column flex item's min-height:auto resolves to
            its content size, so without it the panel grows past the cap and
            nothing ever scrolls — silently, and only on a short viewport. */}
        {children}

        {/* LAST child on purpose. Absolutely positioned, so its visual place is
            unchanged, but the first Tab inside a form the user just asked to fill
            in now lands on Name rather than on a dismiss control.
            bg-white at rest so scrolled content passes cleanly behind it.
            min-h/min-w in px because h-11/w-11 resolve to 41.25px at the 15px
            root globals.css sets under 640px, and that rule only forces
            min-HEIGHT — Header.jsx:153-157 documents the identical trap.
            The outline is INSET because a corner-anchored control's outward
            outline would be clipped by the panel edge; Header's menu toggle uses
            exactly this offset.
            aria-label "Close dialog", not "Close": the manual branch already has
            a button named Close, and two identical names force Dragon and Voice
            Control into numbered-overlay disambiguation every time. */}
        <button
          type="button"
          onClick={() => closeRef.current()}
          aria-label="Close dialog"
          className="absolute right-2 top-2 sm:right-3 sm:top-3 inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center bg-white text-black transition-colors duration-300 ease-out motion-reduce:transition-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black"
        >
          {/* An inline SVG stroked with currentColor, NOT two rotated
              background-color spans. Windows forced-colors mode remaps color and
              stroke to CanvasText but forces background-color to Canvas, so a
              CSS-drawn glyph renders as an empty 44px square — the dialog's most
              obvious exit made invisible for exactly the cohort that most needs a
              visible one. strokeWidth 2 on a 16 viewBox at h-4 w-4 is the same
              2px bar the burger at Header.jsx:178-180 is built from.
              Fully drawn at frame one: it fades in with the panel and never
              animates on its own — the escape hatch is the last thing that should
              assemble itself in front of someone who opened this by accident. */}
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <path d="M3 3 L13 13 M13 3 L3 13" />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  )
}

export default InquiryModal
