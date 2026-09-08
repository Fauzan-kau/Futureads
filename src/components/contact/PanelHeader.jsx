import { Heading, Text } from '../ui'

/* Exported so the four content states and the boundary fallback cannot drift.
   Miss it on one heading and the form loses the accessible name its status
   region points at, only after the state machine advances — i.e. only in the
   flows least likely to be manually tested, with no console warning. */
export const TITLE_ID = 'inquiry-title'

/* One header, rendered ABOVE the branch switch and never inside it, so the card
   reads as one object changing its contents rather than as a new panel: on the
   only path this deployment actually takes (no endpoint -> always 'manual') the
   swap is instantaneous, and a header that blanked and re-cascaded would give
   the user ~700ms of "did anything happen?" straight after their click.
   The eyebrow / headline / w-16 hairline block is the motif the Contact column
   beside it uses verbatim, which is what makes the card read as part of the
   section rather than as an embedded widget.
   The pr-14 that used to sit here reserved room for the dialog's ✕. The form is
   inline now — there is no close button and nothing to clear. */
const PanelHeader = ({ eyebrow, title, size = 'title', lede, note }) => (
  <header>
    <Text size="caption" color="muted" className="uppercase tracking-[0.3em] mb-4">
      {eyebrow}
    </Text>

    {/* h2, not h3: this is a top-level heading in the Contact section, a peer of
        the column heading beside it.
        Deliberately NOT the focus target after a status swap — the wrapper in
        InquiryForm is, because focusing the h2 itself made Chrome match
        :focus-visible and paint a full-width black rectangle around the
        headline. The wrapper's accessible name is this heading either way.
        No tracking-* class: text-title and text-subtitle carry their own
        letterSpacing on the fontSize token. */}
    <Heading as="h2" size={size} id={TITLE_ID} className="mb-4">
      {title}
    </Heading>

    <div aria-hidden="true" className="w-16 h-px bg-black mb-6" />

    {lede && <Text color="muted">{lede}</Text>}
    {/* An HTTP status is a diagnostic, not a headline. It never goes in the h2. */}
    {note && <Text size="caption" color="light" className="mt-2">{note}</Text>}
  </header>
)

export default PanelHeader
