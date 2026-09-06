import { Heading, Text } from '../ui'

/* Exported so the four content states and the boundary fallback cannot drift.
   Miss it on one heading and the dialog loses its accessible name only after the
   state machine advances — i.e. only in the flows least likely to be manually
   tested, with no console warning. */
export const TITLE_ID = 'inquiry-title'

/* One header, rendered ABOVE the branch switch and never inside it, so the panel
   reads as one object changing its contents rather than as a new dialog: on the
   only path this deployment actually takes (no endpoint -> always 'manual') the
   swap is instantaneous, and a header that blanked and re-cascaded would give
   the user ~700ms of "did anything happen?" straight after their click.
   The eyebrow / headline / w-16 hairline block is Contact.jsx:17-23's motif
   verbatim. It is deliberately NOT split into a chrome bar above a rule: that
   turns an editorial eyebrow into an OS window title, spends the site's loudest
   tracking tier on chrome, and costs ~60px at the top of a panel that has none
   to spare.
   pr-14 sm:pr-16 reserves the 44px ✕ so a long headline can never run under it. */
const PanelHeader = ({ eyebrow, title, size = 'title', lede, note }) => (
  <header className="inq-g1 pr-14 sm:pr-16">
    <Text size="caption" color="muted" className="uppercase tracking-[0.3em] mb-4">
      {eyebrow}
    </Text>

    {/* h2, not h3: aria-modal takes the dialog out of the page outline, so this
        is a top-level heading in its own context.
        Deliberately NOT a tabIndex={-1} focus target. It carries the dialog's
        accessible name via aria-labelledby, and focusing it after a branch swap
        made Chrome match :focus-visible and paint its default ring — a black
        rectangle spanning the full panel width around the headline, two lines
        above a readonly textarea with an almost identical box. The post-swap
        focus goes to the dialog container instead (see the effect in
        InquiryPanel): same re-announcement, since the container's name IS this
        heading, and no ring, since no engine matches :focus-visible on a
        programmatically focused container.
        No tracking-* class: text-title and text-subtitle carry their own
        letterSpacing on the fontSize token. */}
    <Heading as="h2" size={size} id={TITLE_ID} className="mb-4">
      {title}
    </Heading>

    <div aria-hidden="true" className="w-16 h-px bg-black mb-6" />

    {lede && <Text color="muted" className="leading-relaxed">{lede}</Text>}
    {/* An HTTP status is a diagnostic, not a headline. It never goes in the h2. */}
    {note && <Text size="caption" color="light" className="mt-2">{note}</Text>}
  </header>
)

export default PanelHeader