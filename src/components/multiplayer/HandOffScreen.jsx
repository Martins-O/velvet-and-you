function HandOffScreen({ playerName, onConfirm }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,5,9,0.98)',
        zIndex: 150,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div style={{ fontSize: '3rem' }}>
        &#x1F4F1;
      </div>

      <p
        style={{
          color: 'var(--text-dim)',
          fontSize: '0.9rem',
          margin: 0,
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
        }}
      >
        Pass the device to
      </p>

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          color: 'var(--ivory)',
          margin: 0,
        }}
      >
        {playerName}
      </h2>

      <p
        style={{
          color: 'var(--text-dim)',
          fontSize: '0.85rem',
          fontStyle: 'italic',
          margin: 0,
        }}
      >
        Don't let them peek yet.
      </p>

      <button
        onClick={onConfirm}
        style={{
          background: 'var(--gold)',
          color: 'var(--deep)',
          border: 'none',
          padding: '0.85rem 2.2rem',
          fontSize: '0.82rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 700,
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { e.target.style.background = 'var(--gold-light)' }}
        onMouseLeave={(e) => { e.target.style.background = 'var(--gold)' }}
      >
        {playerName}'s turn &mdash; I'm ready
      </button>
    </div>
  )
}

export default HandOffScreen
