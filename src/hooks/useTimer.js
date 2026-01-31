import { useState, useEffect, useCallback, useRef } from 'react'

export default function useTimer(duration, onExpire) {
  const [remaining, setRemaining] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const onExpireRef = useRef(onExpire)
  const startRef = useRef(null)

  onExpireRef.current = onExpire

  const start = useCallback(() => {
    setRemaining(duration)
    setIsRunning(true)
    startRef.current = Date.now()
  }, [duration])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setRemaining(duration)
    setIsRunning(false)
    startRef.current = null
  }, [duration])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000
      const left = Math.max(0, duration - elapsed)
      setRemaining(left)

      if (left <= 0) {
        clearInterval(interval)
        setIsRunning(false)
        onExpireRef.current?.()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, duration])

  useEffect(() => {
    const onVisChange = () => {
      if (document.hidden && isRunning) {
        pause()
      }
    }
    document.addEventListener('visibilitychange', onVisChange)
    return () => document.removeEventListener('visibilitychange', onVisChange)
  }, [isRunning, pause])

  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0

  return { remaining, progress, isRunning, start, pause, reset }
}
