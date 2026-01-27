function RoomCodeDisplay({ roomCode }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
    } catch {
      const el = document.createElement('textarea')
      el.value = roomCode
      el.style.position = 'fixed'
      el.style.opacity = 0
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  }

  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <p
        style={{
          color: 'var(--text-dim)',
          fontSize: '0.78rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}
      >
        Share this room code
      </p>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(26,5,9,0.6)',
          border: '0.5px solid rgba(201,168,76,0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem 1.5rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--gold)',
            letterSpacing: '0.2em',
          }}
        >
          {roomCode}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: 'var(--gold)',
            color: 'var(--deep)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem 0.8rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => { e.target.style.background = 'var(--gold-light)' }}
          onMouseLeave={(e) => { e.target.style.background = 'var(--gold)' }}
        >
          Copy
        </button>
      </div>
    </div>
  )
}

export default RoomCodeDisplay
