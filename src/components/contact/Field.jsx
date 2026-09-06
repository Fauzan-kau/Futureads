export const LABEL_CLASS = 'block text-caption text-gray-600 uppercase tracking-wider'

/* border-gray-500 (#737373, 4.74:1 on white) is the floor for a control boundary
   under WCAG 1.4.11; gray-300 (1.6:1) and gray-400 (2.5:1) both fail. On an
   underline field this bottom rule IS the boundary, so it may never go lighter.
   text-[16px] rather than text-body because globals.css sets html to 15px under
   640px, and anything under 16px makes iOS Safari zoom the page on focus.
   An outline rather than a ring: rings are box-shadows and vanish in Windows
   forced-colors mode. offset-4 rather than offset-2 because px-0 puts the
   outline right against the glyphs; 4px still sits inside the scroller's 24px.
   minHeight is a parameter rather than something callers append, because two
   min-h utilities on one element have equal specificity and the winner is
   decided by Tailwind's emission order — which puts min-h-[44px] last, silently
   flattening any taller floor added on top of it.
   `border-x-0 border-t-0 border-b`, never `border-0 border-b`: the latter is two
   rules of equal specificity setting the same property, decided by that same
   emission order. These three touch three different longhands and cannot collide.
   px-0 puts the value on the same rail as its label, which is what makes an
   underline field read as editorial rather than as a stripped box. py-3 with a
   16px/1.6 line box gives 49.6px, clearing the 44px floor before min-h applies.
   `block` is load-bearing: a control is inline-block by default, which leaves a
   ~4px descender gap under its border box inside the relative wrapper — enough
   to float the absolutely-positioned focus bar off the bottom edge entirely, and
   enough to break the space-y rhythm the layout was measured against. */
export const controlClass = (invalid, minHeight = 'min-h-[44px]') =>
  `peer block w-full ${minHeight} px-0 py-3 bg-white text-black text-[16px] leading-[1.6] ` +
  'border-x-0 border-t-0 border-b ' +
  (invalid ? 'border-black ' : 'border-gray-500 ') +
  'focus:border-black ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black ' +
  'transition-colors duration-300 motion-reduce:transition-none'

/* The manual branch's readonly output is a block of text to COPY, not a rail to
   type on, and the two must not wear the same affordance — a padding-less,
   box-less 180px run of text under three identical-looking input rails reads as
   a fourth field that silently swallows every keystroke. It gets a real box and
   no focus bar. Still readOnly, never disabled: disabled text cannot be selected
   and is skipped in the accessibility tree, which would break the third
   clipboard tier whose whole job is select-in-place. */
export const outputClass =
  'block w-full min-h-[180px] p-4 bg-gray-50 text-black text-[16px] leading-[1.6] ' +
  'border border-gray-500 resize-y ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black'

const Field = ({ id, label, error, hint, hintId, meta, children }) => (
  <div>
    {/* The counter rides the label's baseline opposite the label — a folio number
        opposite a running head. Below the control it would share a row with a
        two-to-four-line hint at identical size and colour and orphan itself. */}
    <div className="mb-2 flex items-baseline justify-between gap-4">
      <label htmlFor={id} className={LABEL_CLASS}>{label}</label>
      {meta}
    </div>

    {/* relative wraps ONLY the control, so the bar tracks a resized textarea
        instead of detaching from it. `peer` is on the control inside
        controlClass; peer-* requires a preceding sibling, which it is. */}
    <div className="relative">
      {children}
      {/* Decorative reinforcement only — the guaranteed indicator is the
          focus-visible OUTLINE, which is why this can be a background at all.
          h-0.5 (2px) over a 1px gray-500 rule so the sweep is actually legible;
          1px black over 1px grey is very nearly no change.
          duration-200, not 300: this bar travels the full field width (~480px),
          and at 300ms the user has typed two characters before the indicator
          arrives — and a blur retracting leftward while the next field's bar
          draws rightward reads as two things crossing.
          Invalid parks the SAME bar at full width and the control's own border
          stays 1px: doubling the border to 2px black would make the bar and the
          border one object and delete the focus cue exactly where it is needed.
          Because the bar is out of flow, switching it on adds no height, so
          nothing below it jumps.
          scale-x from origin-left, never w-0 -> w-full: a transform, not a
          layout animation — Header.jsx:111-116's technique.
          peer-focus, not peer-focus-visible, so pointer users get the sweep too. */}
      <span
        aria-hidden="true"
        className={
          'inq-focus-bar pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-black ' +
          'transition-transform duration-200 ease-out motion-reduce:transition-none ' +
          (error ? 'scale-x-100' : 'scale-x-0 peer-focus:scale-x-100')
        }
      />
    </div>

    {/* The id is what makes aria-describedby able to point at this at all — it
        had none before, so the hint was never announced. It is dropped from the
        DOM when an error replaces it, which is why fieldProps drops the id from
        aria-describedby at the same moment: the reference can never dangle. */}
    {hint && !error && <p id={hintId} className="mt-2 text-caption text-gray-600">{hint}</p>}

    {error && (
      /* The palette has no red, so the error carries three non-colour cues: this
         glyph, the semibold weight, and the 2px black bar parked under the
         control. Unchanged from the original. */
      <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-caption font-semibold text-black">
        <span aria-hidden="true" className="mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center bg-black text-[11px] leading-none text-white">
          !
        </span>
        {error}
      </p>
    )}
  </div>
)

export default Field