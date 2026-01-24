import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import useSessionStore from '../../store/sessionStore'
import { useToast } from '../ui/useToast'

const inputBase = {
  width: '100%',
  background: 'rgba(26,5,9,0.6)',
  border: '0.5px solid rgba(201,168,76,0.3)',
  color: 'var(--ivory)',
  padding: '0.6rem 0.9rem',
  borderRadius: '2px',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  marginBottom: '0.75rem',
}

function PlayerSetupModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [focus, setFocus] = useState(null)

  const setPlayerNames = useSessionStore((s) => s.setPlayerNames)
  const { addToast } = useToast()

  useEffect(() => {
    const complete = localStorage.getItem('velvet_setup_complete')
    if (!complete) setIsOpen(true)
  }, [])

  const handlePlay = () => {
    const trimmed1 = name1.trim() || 'Player 1'
    const trimmed2 = name2.trim() || 'Player 2'
    if (trimmed1.length > 20 || trimmed2.length > 20) {
      addToast('Names must be 20 characters or fewer.')
      return
    }
    setPlayerNames([trimmed1, trimmed2])
    localStorage.setItem('velvet_setup_complete', 'true')
    setIsOpen(false)
  }

  const handleSkip = () => {
    setIsOpen(false)
  }

  const focusedStyle = (field) =>
    focus === field
      ? { ...inputBase, border: '0.5px solid var(--gold)' }
      : inputBase

  return (
    <>
      <style>{`
        .setup-input::placeholder { color: var(--text-dim); }
      `}</style>
      <Modal isOpen={isOpen} onClose={() => {}} title="Welcome to Velvet &amp; You">
        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '0.85rem',
            margin: '0 0 1.25rem',
          }}
        >
          Tell us your names before you play.
        </p>

        <input
          className="setup-input"
          placeholder="Your name"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          onFocus={() => setFocus('p1')}
          onBlur={() => setFocus(null)}
          style={focusedStyle('p1')}
        />

        <input
          className="setup-input"
          placeholder="Partner's name"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          onFocus={() => setFocus('p2')}
          onBlur={() => setFocus(null)}
          style={focusedStyle('p2')}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '0.5rem',
          }}
        >
          <Button variant="primary" size="sm" onClick={handlePlay}>
            Let&rsquo;s play
          </Button>
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--champagne)' }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--text-dim)' }}
          >
            Skip for now
          </button>
        </div>
      </Modal>
    </>
  )
}

export default PlayerSetupModal
