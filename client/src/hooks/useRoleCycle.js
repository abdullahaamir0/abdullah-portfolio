import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

/**
 * Cycles through `words`, scrambling/decoding into each one in turn.
 * Respects prefers-reduced-motion by just showing the first word statically.
 */
export default function useRoleCycle(words, { holdMs = 1800, frameMs = 28, totalFrames = 14 } = {}) {
  const [text, setText] = useState(words[0] || '')
  const textRef = useRef(text)
  textRef.current = text

  useEffect(() => {
    if (!words || words.length === 0) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setText(words[0])
      return
    }

    let idx = 0
    let frameTimer = null
    let holdTimer = null
    let cancelled = false

    function scrambleTo(target, done) {
      let frame = 0
      frameTimer = setInterval(() => {
        let out = ''
        for (let i = 0; i < target.length; i++) {
          if (frame / totalFrames > i / target.length) {
            out += target[i]
          } else {
            out += CHARS[Math.floor(Math.random() * CHARS.length)]
          }
        }
        setText(out)
        frame++
        if (frame > totalFrames) {
          clearInterval(frameTimer)
          setText(target)
          if (!cancelled) done && done()
        }
      }, frameMs)
    }

    function cycle() {
      idx = (idx + 1) % words.length
      scrambleTo(words[idx], () => {
        holdTimer = setTimeout(cycle, holdMs)
      })
    }

    setText('')
    scrambleTo(words[0], () => {
      holdTimer = setTimeout(cycle, holdMs)
    })

    return () => {
      cancelled = true
      clearInterval(frameTimer)
      clearTimeout(holdTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, holdMs, frameMs, totalFrames])

  return text
}
