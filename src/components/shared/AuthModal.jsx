import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import useSessionStore from '../../store/sessionStore'
import { useToast } from '../ui/useToast'
import { useAuth } from '../../hooks/useAuth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputStyle = {
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
  marginBottom: '0.5rem',
}

const labelStyle = {
  fontSize: '0.72rem',
  color: 'var(--text-dim)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  marginBottom: '0.25rem',
}

const tabBase = {
  flex: 1,
  padding: '0.75rem 0',
  background: 'none',
  border: 'none',
  borderBottom: '2px solid transparent',
  fontFamily: 'var(--font-body)',
  fontSize: '0.82rem',
  letterSpacing: '0.06em',
  cursor: 'pointer',
  transition: 'border-color 0.2s ease, color 0.2s ease',
  textAlign: 'center',
}

const tabActive = {
  borderBottom: '2px solid var(--gold)',
  color: 'var(--gold)',
}

const tabInactive = {
  color: 'var(--text-dim)',
}

function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, register, syncData } = useAuth()
  const playerNames = useSessionStore((s) => s.playerNames)
  const setPlayerNames = useSessionStore((s) => s.setPlayerNames)
  const { addToast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab)
      setPlayer1(playerNames[0])
      setPlayer2(playerNames[1])
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setError('')
      setLoading(false)
    }
  }, [isOpen, initialTab])

  const switchTab = (newTab) => {
    setTab(newTab)
    setError('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const validateRegister = () => {
    if (!email.trim()) return 'Email is required.'
    if (!EMAIL_RE.test(email)) return 'Please enter a valid email address.'
    if (!password) return 'Password is required.'
    if (password.length < 8) return 'Password must be at least 8 characters.'
    if (password !== confirmPassword) return 'Passwords do not match.'
    if (!player1.trim()) return 'Player 1 name is required.'
    if (!player2.trim()) return 'Player 2 name is required.'
    return null
  }

  const validateLogin = () => {
    if (!email.trim()) return 'Email is required.'
    if (!password) return 'Password is required.'
    return null
  }

  const handleSubmit = async () => {
    setError('')
    const validationError = tab === 'register' ? validateRegister() : validateLogin()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      if (tab === 'register') {
        const names = [player1.trim(), player2.trim()]
        await register({ email: email.trim(), password, playerNames: names })
        setPlayerNames(names)
        localStorage.setItem('velvet_setup_complete', 'true')
        await syncData()
        addToast('Welcome! Your account is ready.')
      } else {
        const data = await login(email.trim(), password)
        if (data.playerNames) {
          setPlayerNames(data.playerNames)
        }
        await syncData()
        addToast('Welcome back!')
      }
      onClose()
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    addToast('Password reset coming soon')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={null}>
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(201,168,76,0.15)', marginBottom: '1.5rem' }}>
        <button
          onClick={() => switchTab('login')}
          style={{ ...tabBase, ...(tab === 'login' ? tabActive : tabInactive) }}
        >
          Sign in
        </button>
        <button
          onClick={() => switchTab('register')}
          style={{ ...tabBase, ...(tab === 'register' ? tabActive : tabInactive) }}
        >
          Create account
        </button>
      </div>

      {tab === 'register' && (
        <>
          <p style={labelStyle}>Your name</p>
          <input
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            placeholder="Your name"
            style={inputStyle}
          />
          <p style={labelStyle}>Partner's name</p>
          <input
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            placeholder="Partner's name"
            style={inputStyle}
          />
          <div style={{ height: '0.5rem' }} />
        </>
      )}

      <p style={labelStyle}>Email</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={inputStyle}
      />

      <p style={labelStyle}>Password</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Min. 8 characters"
        style={inputStyle}
      />

      {tab === 'register' && (
        <>
          <p style={labelStyle}>Confirm password</p>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            style={inputStyle}
          />
        </>
      )}

      {error && (
        <p style={{ color: 'var(--rose)', fontSize: '0.78rem', margin: '0.5rem 0 0' }}>
          {error}
        </p>
      )}

      {tab === 'login' && (
        <div style={{ textAlign: 'right', margin: '0.4rem 0 0' }}>
          <button
            onClick={handleForgotPassword}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              padding: 0,
            }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--ivory)' }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--text-dim)' }}
          >
            Forgot password?
          </button>
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        {tab === 'register' ? (
          <Button
            variant="primary"
            disabled={loading}
            onClick={handleSubmit}
            style={{ width: '100%' }}
          >
            {loading ? 'Creating account\u2026' : 'Create account'}
          </Button>
        ) : (
          <Button
            variant="primary"
            disabled={loading}
            onClick={handleSubmit}
            style={{ width: '100%' }}
          >
            {loading ? 'Signing in\u2026' : 'Sign in'}
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default AuthModal
