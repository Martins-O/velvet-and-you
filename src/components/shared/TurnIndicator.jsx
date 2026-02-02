import useGameStore from '../../store/gameStore'
import useSessionStore from '../../store/sessionStore'

function TurnIndicator() {
  const currentTurn = useGameStore((s) => s.currentTurn)
  const playerNames = useSessionStore((s) => s.playerNames)
  const activeGame = useGameStore((s) => s.activeGame)

  const isBothPlayers =
    activeGame === 'challenge' || activeGame === 'fantasy'

  if (isBothPlayers) {
    return (
      <div
        style={{
          textAlign: 'center',
          marginBottom: '1rem',
          fontSize: '0.82rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
        }}
      >
        Both players
      </div>
    )
  }

  return (
    <div
      style={{
        textAlign: 'center',
        marginBottom: '1rem',
        fontSize: '0.82rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
      }}
    >
      {playerNames[currentTurn]}&apos;s turn
    </div>
  )
}

export default TurnIndicator
