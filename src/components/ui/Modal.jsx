import { useEffect } from 'react'

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'backdropFadeIn 0.2s ease forwards',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div
          style={{
            background: 'var(--deep)',
            border: '0.5px solid rgba(201,168,76,0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            maxWidth: '480px',
            width: '90%',
            position: 'relative',
            animation: 'panelSlideUp 0.25s ease forwards',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              lineHeight: 1,
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--ivory)' }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--text-dim)' }}
          >
            ✕
          </button>

          {title && (
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                color: 'var(--ivory)',
                margin: '0 0 1rem',
              }}
            >
              {title}
            </h2>
          )}

          {children}
        </div>
      </div>
    </>
  )
}

export default Modal
