import { useEffect } from 'react'

export default function useEscapeKey(onEscape, active = true) {
  useEffect(() => {
    if (!active) return undefined
    const handleKeyDown = (event) => { if (event.key === 'Escape') onEscape() }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active, onEscape])
}
