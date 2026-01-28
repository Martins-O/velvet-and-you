import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import useRoomStore from '../../store/roomStore'
import useGameStore from '../../store/gameStore'
import { socket } from '../../hooks/useSocket'

const games = [
  { id: 'truth', title: 'Truth or Dare' },
  { id: 'rather', title: 'Would You Rather' },
  { id: 'bottle', title: 'Spin the Bottle' },
  { id: 'quiz', title: 'Naughty Quiz' },
  { id: 'challenge', title: 'Couples Challenges' },
  { id: 'fantasy', title: 'Fantasy Scenarios' },
]

const intensities = [
  { id: 'romantic', label: 'Romantic' },
  { id: 'playful', label: 'Playful' },
  { id: 'spicy', label: 'Spicy' },
]

const chipBase = {
  padding: '0.4rem 0.9rem',
  fontSize: '0.72rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  borderRadius: '2px',
  border: '0.5px solid rgba(201,168,76,0.22)',
  cursor: 'pointer',
  transition: 'border-color 0.2s ease, background 0.2s ease, color 0.2s ease',
  fontFamily: 'var(--font-body)',
}

const pulseKeyframes = `
@keyframes connectedPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
@keyframes waitingPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
`

function RoomLobby({ startGame, leaveRoom }) {
  const navigate = useNavigate()
  const roomCode = useRoomStore((s) => s.roomCode)
  const isHost = useRoomStore((s) => s.isHost)
  const syncedPlayerNames = useRoomStore((s) => s.syncedState?.playerNames) || []
  const syncedState = useRoomStore((s) => s.syncedState)
  const setActiveGame = useGameStore((s) => s.setActiveGame)
  const setIntensity = useGameStore((s) => s.setIntensity)

  const [selectedGame, setSelectedGame] = useState('truth')
  const [selectedIntensity, setSelectedIntensity] = useState('romantic')

  const playerNames = syncedPlayerNames.length >= 2
    ? syncedPlayerNames
    : [syncedPlayerNames[0] || 'Host', null]

  const bothConnected = playerNames[0] && playerNames[1]

  const handleStartGame = () => {
    if (!roomCode || !bothConnected) return
    setActiveGame(selectedGame)
    setIntensity(selectedIntensity)
    startGame(selectedGame, selectedIntensity)
    navigate(`/games/${selectedGame}`)
  }

  const handleDisconnect = () => {
    if (roomCode) leaveRoom()
    socket.disconnect()
    navigate('/games')
  }

  const handleIntensityClick = (intId) => {
    setSelectedIntensity(intId)
    setIntensity(intId)
    if (roomCode) {
      socket.emit('game:intensity-changed', { roomCode, intensity: intId })
    }
  }

  return (
    <>
      <style>{pulseKeyframes}</style>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--ivory)', margin: '0 0 0.25rem' }}>
              Room {roomCode}
            </h1>
            {bothConnected ? (
              <p style={{ color: 'var(--champagne)', fontSize: '0.82rem', margin: 0 }}>
                {playerNames[0]} &amp; {playerNames[1]}
              </p>
            ) : (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', margin: 0 }}>
                Waiting for partner&hellip;
              </p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--gold)',
                animation: 'connectedPulse 2s ease-in-out infinite',
              }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
              Connected
            </span>
          </div>
        </div>

        <div className="room-player-cards" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                maxWidth: '180px',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: playerNames[i]
                  ? 'rgba(26,5,9,0.5)'
                  : 'rgba(26,5,9,0.2)',
                border: playerNames[i]
                  ? '0.5px solid rgba(201,168,76,0.22)'
                  : '0.5px solid rgba(201,168,76,0.1)',
                textAlign: 'center',
                opacity: playerNames[i] ? 1 : 0.5,
              }}
            >
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--ivory)', margin: '0 0 0.25rem' }}>
                {playerNames[i] || 'Waiting\u2026'}
              </p>
              <p style={{ fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>
                {i === 0 ? 'Host' : 'Guest'}
              </p>
              {playerNames[i] && (
                <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>&#10003;</span>
              )}
            </div>
          ))}
        </div>

        {isHost ? (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Choose a game
              </p>
              <div className="room-game-chips" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {games.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGame(g.id)}
                    style={{
                      ...chipBase,
                      background: selectedGame === g.id ? 'rgba(201,168,76,0.12)' : 'rgba(26,5,9,0.5)',
                      borderColor: selectedGame === g.id ? 'var(--gold)' : 'rgba(201,168,76,0.22)',
                      color: selectedGame === g.id ? 'var(--gold)' : 'var(--ivory)',
                    }}
                  >
                    {g.title}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Intensity
              </p>
              <div className="room-game-chips" style={{ display: 'flex', gap: '0.5rem' }}>
                {intensities.map((int) => (
                  <button
                    key={int.id}
                    onClick={() => handleIntensityClick(int.id)}
                    style={{
                      ...chipBase,
                      background: selectedIntensity === int.id ? 'rgba(201,168,76,0.12)' : 'rgba(26,5,9,0.5)',
                      borderColor: selectedIntensity === int.id ? 'var(--gold)' : 'rgba(201,168,76,0.22)',
                      color: selectedIntensity === int.id ? 'var(--gold)' : 'var(--ivory)',
                    }}
                  >
                    {int.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button variant="primary" onClick={handleStartGame} disabled={!bothConnected}>
                Start Game
              </Button>
              <Button variant="ghost" onClick={handleDisconnect}>
                Leave room
              </Button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p
              style={{
                color: 'var(--text-dim)',
                fontSize: '0.85rem',
                animation: 'waitingPulse 2s ease-in-out infinite',
              }}
            >
              Waiting for {playerNames[0] || 'the host'} to start the game&hellip;
            </p>
            <div style={{ marginTop: '1rem' }}>
              <Button variant="ghost" onClick={handleDisconnect}>
                Leave room
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default RoomLobby
