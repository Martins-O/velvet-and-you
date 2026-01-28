import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import RoomCreateScreen from '../components/multiplayer/RoomCreateScreen'
import RoomJoinScreen from '../components/multiplayer/RoomJoinScreen'
import RoomLobby from '../components/multiplayer/RoomLobby'
import PartnerDisconnectedScreen from '../components/multiplayer/PartnerDisconnectedScreen'
import useSocket from '../hooks/useSocket'
import useRoomStore from '../store/roomStore'

function Room() {
  const { roomCode: urlRoomCode } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const roomCode = useRoomStore((s) => s.roomCode)
  const partnerConnected = useRoomStore((s) => s.partnerConnected)

  const { startGame, leaveRoom } = useSocket(roomCode)

  const [pageState, setPageState] = useState('loading')
  const [partnerDisconnected, setPartnerDisconnected] = useState(false)

  useEffect(() => {
    const action = searchParams.get('action')
    if (urlRoomCode) {
      setPageState('join')
    } else if (action === 'create') {
      setPageState('create')
    } else if (action === 'join') {
      setPageState('join')
    } else {
      setPageState('create')
    }
  }, [urlRoomCode, searchParams])

  useEffect(() => {
    if (roomCode && partnerConnected && (pageState === 'create' || pageState === 'join')) {
      setPageState('lobby')
    }
  }, [roomCode, partnerConnected, pageState])

  useEffect(() => {
    if (pageState === 'lobby' && !partnerConnected) {
      setPartnerDisconnected(true)
    }
  }, [pageState, partnerConnected])

  if (pageState === 'loading') {
    return (
      <PageWrapper>
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <p style={{ color: 'var(--text-dim)' }}>Loading...</p>
        </div>
      </PageWrapper>
    )
  }

  if (partnerDisconnected) {
    return (
      <PageWrapper>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem' }}>
          <PartnerDisconnectedScreen />
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              onClick={() => { setPartnerDisconnected(false); navigate('/games') }}
              style={{
                background: 'transparent',
                color: 'var(--text-dim)',
                border: 'none',
                fontSize: '0.82rem',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              Leave room
            </button>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (pageState === 'join') {
    return (
      <PageWrapper>
        <RoomJoinScreen defaultCode={urlRoomCode} />
      </PageWrapper>
    )
  }

  if (pageState === 'lobby' || (roomCode && partnerConnected)) {
    return (
      <PageWrapper>
        <RoomLobby startGame={startGame} leaveRoom={leaveRoom} />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <RoomCreateScreen />
    </PageWrapper>
  )
}

export default Room
