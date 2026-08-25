import { useEffect, useState } from 'react'

/**
 * Watches the given section ids and returns whichever one is currently
 * scrolled to the top of the viewport (offset by `offset` px).
 */
export default function useScrollSpy(ids, offset = 140) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    function onScroll() {
      const scrollPos = window.scrollY + offset
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollPos) {
          current = id
        }
      }
      setActive(current)
    }

    document.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => document.removeEventListener('scroll', onScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(','), offset])

  return active
}
