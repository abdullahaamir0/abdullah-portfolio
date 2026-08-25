import { useEffect, useRef, useState } from 'react'

/**
 * Returns a [ref, isVisible] pair. Attach `ref` to any element; once it
 * scrolls into view, isVisible flips to true and stays true.
 */
export default function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    io.observe(el)

    // Safety net: reveal anyway after a few seconds in case the observer
    // never fires (very short viewports, edge cases, etc.)
    const fallback = setTimeout(() => setIsVisible(true), 4000)

    return () => {
      io.disconnect()
      clearTimeout(fallback)
    }
  }, [threshold])

  return [ref, isVisible]
}
