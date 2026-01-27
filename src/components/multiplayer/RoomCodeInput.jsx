import { useState, useRef } from 'react'
import Button from '../ui/Button'

function RoomCodeInput({ onJoin }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const ref = useRef(null)

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (val.length <= 6) setCode(val)
    setError('')
  }

  const handleSubmit = () => {
    if (code.length < 6) {
      setError('Enter a 6-character room code')
      return
    }
    onJoin(code)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <p
        style={{
          color: 'var(--text-dim)',
          fontSize: '0.82rem',
          marginBottom: '1rem',
        }}
      >
        Enter the 6-character code from your partner
      </p>

      <input
        ref={ref}
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="VX9K2M"
        style={{
          background: 'rgba(26,5,9,0.6)',
          border: error
            ? '0.5px solid var(--blush)'
            : '0.5px solid rgba(201,168,76,0.3)',
          color: 'var(--ivory)',
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          letterSpacing: '0.3em',
          textAlign: 'center',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-sm)',
          width: '200px',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--gold)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error
            ? 'var(--blush)'
            : 'rgba(201,168,76,0.3)'
        }}
        maxLength={6}
      />

      {error && (
        <p
          style={{
            color: 'var(--blush)',
            fontSize: '0.78rem',
            marginTop: '0.5rem',
          }}
        >
          {error}
        </p>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          disabled={code.length < 6}
        >
          Join Room
        </Button>
      </div>

      <p
        style={{
          color: 'var(--text-dim)',
          fontSize: '0.72rem',
          marginTop: '0.75rem',
          fontStyle: 'italic',
        }}
      >
        Codes are 6 characters &mdash; letters and numbers.
      </p>
    </div>
  )
}

export default RoomCodeInput
