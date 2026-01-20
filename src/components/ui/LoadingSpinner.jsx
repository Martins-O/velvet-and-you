const sizes = { sm: 28, md: 40, lg: 56 }

function LoadingSpinner({ size = 'md', message }) {
  const px = sizes[size] || sizes.md

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '3rem 1rem',
        }}
      >
        <div
          style={{
            width: `${px}px`,
            height: `${px}px`,
            borderRadius: '50%',
            border: '2px solid rgba(201,168,76,0.2)',
            borderTopColor: 'var(--gold)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        {message && (
          <p
            style={{
              color: 'var(--text-dim)',
              fontSize: '0.82rem',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            {message}
          </p>
        )}
      </div>
    </>
  )
}

export default LoadingSpinner
