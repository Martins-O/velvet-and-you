import useGameStore from '../../store/gameStore'
import useSessionStore from '../../store/sessionStore'
import Button from '../ui/Button'

function longestStreak(history) {
  let max = 0
  let cur = 0
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].result === 'completed') {
      cur++
      if (cur > max) max = cur
    } else {
      cur = 0
    }
  }
  return max
}

const metricStyle = {
  background: 'rgba(26,5,9,0.5)',
  border: '0.5px solid rgba(201,168,76,0.15)',
  borderRadius: '4px',
  padding: '0.75rem 0.6rem',
  textAlign: 'center',
  minWidth: 0,
  flex: '1 1 0',
}

function SessionSummary({ isOpen, onPlayAgain, onViewHistory, onGoHome }) {
  const scores = useGameStore((s) => s.scores)
  const scoringEnabled = useGameStore((s) => s.scoringEnabled)
  const history = useSessionStore((s) => s.history)
  const playerNames = useSessionStore((s) => s.playerNames)

  if (!isOpen) return null

  const cardsPlayed = history.length
  const daresCompleted = history.filter(
    (e) => e.game === 'dare' && e.result === 'completed'
  ).length
  const truthsAnswered = history.filter(
    (e) => e.game === 'truth' && e.result === 'completed'
  ).length
  const cardsFavourited = history.filter(
    (e) => e.result === 'favourited'
  ).length
  const streak = longestStreak(history)

  const lastFavoured = history.find((e) => e.result === 'favourited')

  let winnerLabel = null
  if (scoringEnabled) {
    if (scores[0] > scores[1]) {
      winnerLabel = `${playerNames[0]} wins!`
    } else if (scores[1] > scores[0]) {
      winnerLabel = `${playerNames[1]} wins!`
    } else {
      winnerLabel = "It's a tie \u2014 you both win \uD83C\uDF89"
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,5,9,0.97)',
        zIndex: 200,
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        @keyframes summaryFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        style={{
          maxWidth: '560px',
          width: '90%',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          animation: 'summaryFadeIn 0.35s ease',
        }}
      >
        {/* Header */}
        <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
          &#10024;
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.8rem',
            color: 'var(--ivory)',
            margin: '0 0 0.4rem',
          }}
        >
          Session Complete
        </h1>
        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '0.85rem',
            margin: '0 0 2rem',
          }}
        >
          Here&rsquo;s how tonight went.
        </p>

        {/* Score Display */}
        {scoringEnabled && (
          <div style={{ marginBottom: '2rem' }}>
          <div
            className="session-score-cards"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
            }}
          >
              <div
                style={{
                  flex: 1,
                  maxWidth: '160px',
                  background: 'rgba(26,5,9,0.5)',
                  border: '0.5px solid rgba(201,168,76,0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.2rem 1rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-dim)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    margin: '0 0 0.5rem',
                  }}
                >
                  {playerNames[0]}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.6rem',
                    color: 'var(--gold)',
                    margin: 0,
                  }}
                >
                  {scores[0]}
                </p>
              </div>

              <div
                style={{
                  flex: 1,
                  maxWidth: '160px',
                  background: 'rgba(26,5,9,0.5)',
                  border: '0.5px solid rgba(201,168,76,0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.2rem 1rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-dim)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    margin: '0 0 0.5rem',
                  }}
                >
                  {playerNames[1]}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.6rem',
                    color: 'var(--gold)',
                    margin: 0,
                  }}
                >
                  {scores[1]}
                </p>
              </div>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: '1.1rem',
                color: 'var(--blush)',
                margin: '1rem 0 0',
              }}
            >
              {winnerLabel}
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            className="session-stats"
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={metricStyle}>
              <p
                style={{
                  fontSize: '0.6rem',
                  color: 'var(--text-dim)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  margin: '0 0 0.25rem',
                }}
              >
                Played
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  color: 'var(--gold)',
                  margin: 0,
                }}
              >
                {cardsPlayed}
              </p>
            </div>
            <div style={metricStyle}>
              <p
                style={{
                  fontSize: '0.6rem',
                  color: 'var(--text-dim)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  margin: '0 0 0.25rem',
                }}
              >
                Dares
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  color: 'var(--gold)',
                  margin: 0,
                }}
              >
                {daresCompleted}
              </p>
            </div>
            <div style={metricStyle}>
              <p
                style={{
                  fontSize: '0.6rem',
                  color: 'var(--text-dim)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  margin: '0 0 0.25rem',
                }}
              >
                Truths
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  color: 'var(--gold)',
                  margin: 0,
                }}
              >
                {truthsAnswered}
              </p>
            </div>
            <div style={metricStyle}>
              <p
                style={{
                  fontSize: '0.6rem',
                  color: 'var(--text-dim)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  margin: '0 0 0.25rem',
                }}
              >
                Faved
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  color: 'var(--gold)',
                  margin: 0,
                }}
              >
                {cardsFavourited}
              </p>
            </div>
            <div style={metricStyle}>
              <p
                style={{
                  fontSize: '0.6rem',
                  color: 'var(--text-dim)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  margin: '0 0 0.25rem',
                }}
              >
                Streak
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  color: 'var(--gold)',
                  margin: 0,
                }}
              >
                {streak}
              </p>
            </div>
          </div>
        </div>

        {/* Memorable Moment */}
        {lastFavoured && (
          <div style={{ marginBottom: '2rem' }}>
            <p
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              A moment to remember
            </p>
            <div
              style={{
                border: '0.5px solid rgba(201,168,76,0.22)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(26,5,9,0.5)',
                padding: '1.2rem 1rem',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--ivory)',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                  margin: 0,
                  fontWeight: 300,
                }}
              >
                &ldquo;{lastFavoured.text}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          <Button variant="primary" size="md" onClick={onPlayAgain}>
            Play again
          </Button>
          <Button variant="outline" size="sm" onClick={onViewHistory}>
            View history
          </Button>
          <Button variant="ghost" size="sm" onClick={onGoHome}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SessionSummary
