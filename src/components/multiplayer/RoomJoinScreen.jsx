import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import LoadingSpinner from '../ui/LoadingSpinner'
import useRoomStore from '../../store/roomStore'
import useSessionStore from '../../store/sessionStore'
import { useToast } from '../ui/useToast'
import { socket } from '../../hooks/useSocket'
import { apiFetch } from '../../utils/api'

function RoomJoinScreen({ defaultCode }) {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const setMode = useRoomStore((s) => s.setMode)
  const setRoom = useRoomStore((s) => s.setRoom)
  const setSyncedState = useRoomStore((s) => s.setSyncedState)
  const roomCode = useRoomStore((s) => s.roomCode)
  const playerNames = useSessionStore((s) => s.playerNames)

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const doJoin = useCallback(async (inputCode) => {
    setJoining(true)
    setJoinError(null)
    setMode('online')

    try {
      const data = await apiFetch(`/api/rooms/${inputCode}`)
      if (!data.valid) {
        const msg = data.expired ? 'Room has expired' : 'Room not found'
        if (defaultCode) {
          setJoinError(msg)
          setJoining(false)
          return
        }
        setError(msg)
        setJoining(false)
        return
      }
      if (data.full) {
        const msg = 'Room is full'
        if (defaultCode) {
          setJoinError(msg)
          setJoining(false)
          return
        }
        setError(msg)
        setJoining(false)
        return
      }
    } catch {
      const msg = 'Could not connect to server'
      setError(msg)
      setJoining(false)
      return
    }

    socket.connect()

    const emitJoin = () => {
      socket.emit('join-room', { roomCode: inputCode, playerName: playerNames[1] || 'Player 2' }, (res) => {
        if (res?.error) {
          addToast(res.error)
          socket.disconnect()
          setJoining(false)
          return
        }
        setRoom({ roomCode: inputCode, inviteUrl: null, isHost: false })
        if (res?.playerNames) {
          setSyncedState({ playerNames: res.playerNames })
        }
        setJoining(false)
      })
    }

    if (socket.connected) {
      emitJoin()
    } else {
      socket.once('connect', emitJoin)
    }
  }, [playerNames, setMode, setRoom, setSyncedState, addToast, defaultCode])

  useEffect(() => {
    if (defaultCode) {
      setCode(defaultCode)
      doJoin(defaultCode)
    }
  }, [defaultCode])

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').trim()
    if (val.length <= 6) setCode(val)
    if (error) setError('')
  }

  const handleSubmit = () => {
    if (code.length < 6) {
      setError('Enter a 6-character room code')
      return
    }
    doJoin(code)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  if (joining || (defaultCode && !roomCode && !joinError)) {
    return <LoadingSpinner size="md" message="Joining room\u2026" />
  }

  if (joinError) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--rose)', marginBottom: '1.5rem' }}>{joinError}</p>
        <Button variant="primary" onClick={() => navigate('/room?action=create')}>
          Create your own room
        </Button>
      </div>
    )
  }

  if (roomCode) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-dim)' }}>Connected! Waiting for host to start&hellip;</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem' }}>
      <button
        onClick={() => navigate('/games')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-dim)',
          fontSize: '0.78rem',
          cursor: 'pointer',
          marginBottom: '2rem',
        }}
        onMouseEnter={(e) => { e.target.style.color = 'var(--ivory)' }}
        onMouseLeave={(e) => { e.target.style.color = 'var(--text-dim)' }}
      >
        &larr; Back to games
      </button>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.6rem',
          color: 'var(--ivory)',
          textAlign: 'center',
          marginBottom: '0.5rem',
        }}
      >
        Join a Room
      </h1>

      <p
        style={{
          color: 'var(--text-dim)',
          fontSize: '0.82rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}
      >
        Enter the 6-character code your partner shared.
      </p>

      <div style={{ textAlign: 'center' }}>
        <input
          ref={inputRef}
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="VX9K2M"
          maxLength={6}
          style={{
            background: 'rgba(26,5,9,0.6)',
            border: error
              ? '0.5px solid var(--rose)'
              : '0.5px solid rgba(201,168,76,0.3)',
            color: 'var(--ivory)',
            fontFamily: 'var(--font-display)',
            fontSize: '1.8rem',
            letterSpacing: '0.3em',
            textAlign: 'center',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            width: '200px',
            outline: 'none',
            textTransform: 'uppercase',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--gold)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error
              ? 'var(--rose)'
              : 'rgba(201,168,76,0.3)'
          }}
        />

        {error && (
          <p style={{ color: 'var(--rose)', fontSize: '0.78rem', marginTop: '0.5rem' }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: '1.5rem' }}>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={code.length < 6}
            style={{ width: '100%' }}
          >
            Join Room
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RoomJoinScreen
