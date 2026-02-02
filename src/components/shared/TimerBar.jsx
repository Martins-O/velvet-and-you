import { useState, useEffect } from 'react'
import useGameStore from '../../store/gameStore'

function TimerBar({ onExpire }) {
  const timerEnabled = useGameStore((s) => s.timerEnabled)
  const timerDuration = useGameStore((s) => s.timerDuration)
  const [elapsed, setElapsed] = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!timerEnabled) return
    setActive(true)
    setElapsed(0)
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= timerDuration) {
          clearInterval(interval)
          setActive(false)
          if (onExpire) onExpire()
          return timerDuration
        }
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timerEnabled, timerDuration, onExpire])

  if (!timerEnabled || timerDuration <= 0) return null

  const pct = Math.min((elapsed / timerDuration) * 100, 100)

  return (
    <div
      style={{
        width: '100%',
        height: '3px',
        background: 'rgba(201,168,76,0.15)',
        borderRadius: '2px',
        marginTop: '1rem',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${100 - pct}%`,
          height: '100%',
          background: !active ? 'var(--text-dim)' : 'var(--gold)',
          borderRadius: '2px',
          transition: 'width 1s linear',
        }}
      />
    </div>
  )
}

export default TimerBar
