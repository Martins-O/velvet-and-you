function WaitingScreen({ onCancel, partnerConnected }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem 1rem 1rem' }}>
      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }
      `}</style>

      {!partnerConnected ? (
        <>
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.2rem' }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  display: 'inline-block',
                  animation: `dotPulse 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '1.1rem',
              color: 'var(--champagne)',
              margin: '0 0 0.4rem',
              fontWeight: 400,
            }}
          >
            Waiting for your partner to join&hellip;
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', margin: '0 0 1.5rem' }}>
            Room expires in 10 minutes
          </p>

          <button
            onClick={onCancel}
            style={{
              background: 'transparent',
              color: 'var(--text-dim)',
              border: 'none',
              fontSize: '0.82rem',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--ivory)' }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--text-dim)' }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              color: 'var(--gold)',
              margin: '0',
            }}
          >
            Partner connected!
          </h2>
        </>
      )}
    </div>
  )
}

export default WaitingScreen
