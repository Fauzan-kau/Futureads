import { useEffect, useState } from 'react'

/**
 * Which nav target is currently in view, for the header's masthead rule.
 *
 * Purely cosmetic: if this is removed, the header falls back to hover-only
 * behaviour and no other class in it changes.
 */
const useActiveSection = (ids) => {
  const [active, setActive] = useState('')
  // `ids` is a fresh array literal on every render of the caller, so keying the
  // effect on it directly would tear down and re-observe on each one.
  const key = ids.join('|')

  useEffect(() => {
    const els = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!els.length) return

    // A ~10vh detection band 30% down the viewport. A section becomes active
    // when it crosses that band and stays active until the next one does, so
    // Hero, Philosophy and Contact — which are not nav targets — leave the last
    // choice standing rather than clearing it.
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting)
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [key])

  return active
}

export default useActiveSection
