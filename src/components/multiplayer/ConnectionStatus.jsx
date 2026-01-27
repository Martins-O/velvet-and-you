function ConnectionStatus({ state }) {
  if (!state || state === 'idle') return null

  const isPulsing = state === 'reconnecting'
  const label = {
    connected: 'Connected',
    reconnecting: 'Reconnecting\u2026',
    disconnected: 'Disconnected',
  }[state] || ''

  return (
    <>
      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.7rem',
          color: 'var(--text-dim)',
          letterSpacing: '0.04em',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background:
              state === 'disconnected'
                ? 'var(--text-dim)'
                : 'var(--gold)',
            animation: isPulsing ? 'pulseDot 1.2s ease-in-out infinite' : 'none',
          }}
        />
        {label}
      </div>
    </>
  )
}

export default ConnectionStatus
