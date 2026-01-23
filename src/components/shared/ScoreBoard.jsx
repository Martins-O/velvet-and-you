import useGameStore from '../../store/gameStore'
import useSessionStore from '../../store/sessionStore'

function ScoreBoard() {
  const scores = useGameStore((s) => s.scores)
  const playerNames = useSessionStore((s) => s.playerNames)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        marginBottom: '1.5rem',
      }}
    >
      {playerNames.map((name, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {name}
          </span>
          <div
            key={scores[i]}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              color: 'var(--gold)',
              animation: 'scorePop 0.3s ease',
            }}
          >
            {scores[i] || 0}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ScoreBoard
