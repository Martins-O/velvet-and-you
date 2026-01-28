import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useRoomStore from '../../store/roomStore'
import useSessionStore from '../../store/sessionStore'
import { socket } from '../../hooks/useSocket'
import ConnectionStatus from './ConnectionStatus'
import WaitingScreen from './WaitingScreen'
import LoadingSpinner from '../ui/LoadingSpinner'
import { useToast } from '../ui/useToast'
import { apiFetch } from '../../utils/api'

function RoomCreateScreen() {
  const navigate = useNavigate()
  const setRoom = useRoomStore((s) => s.setRoom)
  const setMode = useRoomStore((s) => s.setMode)
  const roomCode = useRoomStore((s) => s.roomCode)
  const inviteUrl = useRoomStore((s) => s.inviteUrl)
  const playerNames = useSessionStore((s) => s.playerNames)
  const partnerConnected = useRoomStore((s) => s.partnerConnected)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    if (roomCode) return

    setLoading(true)
    setMode('online')

    socket.connect()

    const doCreate = async () => {
      try {
        const data = await apiFetch('/api/rooms/create', {
          method: 'POST',
          body: JSON.stringify({ playerName: playerNames[0] || 'Player 1' }),
        })
        if (!data.roomCode) throw new Error('No room code')
        const newCode = data.roomCode
        setRoom({ roomCode: newCode, inviteUrl: data.inviteUrl, isHost: true })
        const join = () => socket.emit('join-room', { roomCode: newCode, playerName: playerNames[0] || 'Player 1' })
        if (socket.connected) { join() } else { socket.once('connect', join) }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    doCreate()
  }, [])

  const handleCopyCode = async () => {
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
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
    } catch {
      const el = document.createElement('textarea')
      el.value = inviteUrl
      el.style.position = 'fixed'
      el.style.opacity = 0
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url: inviteUrl })
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopyLink()
    }
  }

  const handleCancel = () => {
    if (roomCode) {
      socket.emit('leave-room', { roomCode })
    }
    socket.disconnect()
    setRoom({ roomCode: null, inviteUrl: null, isHost: false })
    navigate('/games')
  }

  if (loading) {
    return <LoadingSpinner size="md" message="Creating your room\u2026" />
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
          Couldn't create room. Try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'var(--gold)',
            color: 'var(--deep)',
            border: 'none',
            padding: '0.75rem 2rem',
            fontSize: '0.82rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  if (!roomCode) return null

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--ivory)', margin: 0 }}>
          Your Room
        </h1>
        <ConnectionStatus />
      </div>

      <div className="room-sharing" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center', minWidth: '200px', flex: 1 }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            Share your room code
          </p>
          <div style={{
            display: 'inline-block',
            background: 'rgba(26,5,9,0.6)',
            border: '0.5px solid rgba(201,168,76,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.2rem 2rem',
            marginBottom: '0.75rem',
          }}>
            <span className="room-code-display" style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--gold)', letterSpacing: '0.3em' }}>
              {roomCode}
            </span>
          </div>
          <div>
            <button
              onClick={handleCopyCode}
              style={{
                background: 'transparent',
                color: 'var(--gold)',
                border: '0.5px solid rgba(201,168,76,0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 1rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(201,168,76,0.1)' }}
              onMouseLeave={(e) => { e.target.style.background = 'transparent' }}
            >
              {codeCopied ? 'Copied!' : 'Copy code'}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', minWidth: '200px', flex: 1 }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            Or share the link
          </p>
          <input
            readOnly
            value={inviteUrl}
            style={{
              width: '100%',
              background: 'rgba(26,5,9,0.4)',
              border: '0.5px solid rgba(201,168,76,0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.7rem',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              color: 'var(--text-dim)',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '0.6rem',
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button
              onClick={handleCopyLink}
              style={{
                background: 'transparent',
                color: 'var(--gold)',
                border: '0.5px solid rgba(201,168,76,0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 1rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(201,168,76,0.1)' }}
              onMouseLeave={(e) => { e.target.style.background = 'transparent' }}
            >
              {linkCopied ? 'Copied!' : 'Copy link'}
            </button>
            <button
              onClick={handleShare}
              style={{
                background: 'var(--gold)',
                color: 'var(--deep)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 1rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => { e.target.style.background = 'var(--gold-light)' }}
              onMouseLeave={(e) => { e.target.style.background = 'var(--gold)' }}
            >
              Share
            </button>
          </div>
        </div>
      </div>

      <WaitingScreen onCancel={handleCancel} partnerConnected={partnerConnected} />
    </div>
  )
}

export default RoomCreateScreen
