import { useEffect, useState } from 'react'
import useInView from '../../hooks/useInView'

// CSS ease-out — cubic-bezier(0, 0, 0.58, 1), the curve FadeIn.jsx writes into its
// inline transition — fitted to within 0.010 across the domain, so the count and the
// fade it rides in on share one curve without shipping a bezier solver. 0.010 of 50 is
// half a count, so the fit can never display a different integer than the true curve.
const easeOut = (p) => 1 - Math.pow(1 - p, 1.7)

const CountUp = ({ to, suffix = '', duration = 700, delay = 0, threshold = 0.1 }) => {
  // Initialised to `to`, NOT 0, and this is the whole safety story: every path that
  // never starts the loop — reduced motion, an observer that never fires, no
  // IntersectionObserver at all — then falls back to "no animation" rather than "wrong
  // number". A stat stranded on 0+ is the one outcome worse than shipping nothing.
  const [value, setValue] = useState(to)
  const { ref, isInView } = useInView({ threshold })

  // Same read, same guards and same position in the file as FadeIn.jsx — but note it
  // bails to the FINISHED state, not the animated one. A count-up's motion IS its text
  // content, so no stylesheet can override it and this check is the only opt-out there
  // is; the only honest thing to show is the real number.
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReducedMotion || !isInView) return

    // Both handles are effect-locals, not refs. StrictMode runs this mount -> cleanup ->
    // mount in dev, so each invocation must cancel its own frame; a shared ref would let
    // the first run's handle leak. And there is deliberately NO `hasStarted` guard: it
    // would let run 1 start, the cleanup kill it, run 2 skip — frozen in dev, fine in prod.
    let frame = 0
    let start = null

    const tick = (now) => {
      // The clock starts on the first rendered FRAME, not at commit. rAF is parked in a
      // background tab, so timing from commit would let a page opened in one spend its
      // whole duration hidden and be revealed already finished.
      if (start === null) start = now
      // The delay rides this same clock instead of a setTimeout: one timer to cancel, it
      // pauses with the tab — and, the reason it cannot be a timer, it drops the display
      // to 0 on the first frame while FadeIn still has the row at opacity 0. Deferring
      // that would paint the initial `to` for 600ms and then visibly reset to 0.
      const elapsed = now - start - delay
      const p = elapsed <= 0 ? 0 : Math.min(elapsed / duration, 1)
      // Progress from elapsed TIME, never `value += step` — a per-frame increment is
      // silently tuned to the author's refresh rate and runs at half speed on a 120Hz
      // display. Reading `to` through at p === 1 rather than trusting the float is what
      // guarantees the landing: the classic bug is a counter that rests on 49 forever.
      setValue(p === 1 ? to : Math.round(to * easeOut(p)))
      if (p < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isInView, prefersReducedMotion, to, duration, delay])

  const target = `${to}${suffix}`

  // At rest the DOM is one text node — exactly the markup this component replaced, so a
  // late screen reader, a select-all and a crawler all see what they saw before. Reduced
  // motion lands here on the very first paint: no scaffold, no intermediate value, no
  // flash of 0.
  if (value === to) {
    return <span ref={ref} className="tabular-nums">{target}</span>
  }

  return (
    <span ref={ref} className="tabular-nums">
      {/* Two cells in ONE grid area, deliberately not an absolute overlay: the FadeIn
          wrapping this row writes an inline transform and is therefore the containing
          block for any abspos descendant — the exact trap the scroll indicator in
          Hero.jsx documents. Grid items never leave flow, so this is immune to it.
          The invisible copy carries the FINAL string, so the box sits at its resting
          width from the first frame, self-measured in whichever face is actually loaded
          (no `ch` guesswork, survives the webfont swap). justify-self-end pins the right
          edge: the "+" never moves when the count crosses 9 -> 10, the number grows
          leftward into space already reserved for it. visibility:hidden, not
          display:none — the cell still needs an in-flow line box — and it is already out
          of the a11y tree and out of a text selection, so no aria-hidden and no
          "50+50+" on copy. */}
      <span className="inline-grid">
        <span className="invisible col-start-1 row-start-1">{target}</span>
        {/* aria-hidden for the reason InquiryForm.jsx hides its character counter: a
            value changing ~60x a second is noise. It is in no live region so nothing
            announces it — but a reader arriving mid-count would otherwise report
            "Projects 17+" as fact. Never aria-live here; that announces every frame. */}
        <span aria-hidden="true" className="col-start-1 row-start-1 justify-self-end">
          {`${value}${suffix}`}
        </span>
      </span>
      {/* ...so a static node carries the truth at the same reading position. Assistive
          tech gets the identical string the page had before CountUp existed. */}
      <span className="sr-only">{target}</span>
    </span>
  )
}

export default CountUp
