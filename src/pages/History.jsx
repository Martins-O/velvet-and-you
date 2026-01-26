import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import Badge from '../components/ui/Badge'
import HistoryCard from '../components/shared/HistoryCard'
import useSessionStore from '../store/sessionStore'
import { useToast } from '../components/ui/useToast'

const gameNameMap = {
  truth: 'Truth or Dare',
  dare: 'Truth or Dare',
  rather: 'Would You Rather',
  bottle: 'Spin the Bottle',
  quiz: 'Naughty Quiz',
  challenge: 'Couples Challenges',
  fantasy: 'Fantasy Scenario Builder',
}

function formatGameName(gameId) {
  return gameNameMap[gameId] ||
    (gameId.charAt(0).toUpperCase() + gameId.slice(1).replace(/-/g, ' '))
}

function History() {
  const navigate = useNavigate()
  const history = useSessionStore((s) => s.history)
  const clearHistory = useSessionStore((s) => s.clearHistory)
  const { addToast } = useToast()

  const displayEntries = history.filter((e) => e.result !== 'drawn')

  const grouped = displayEntries.reduce((acc, entry) => {
    const key = entry.game || 'unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(entry)
    return acc
  }, {})

  const handleClear = () => {
    clearHistory()
    addToast('History cleared')
  }

  return (
    <PageWrapper>
      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.8rem',
              color: 'var(--ivory)',
              margin: 0,
            }}
          >
            Session History
          </h1>
          {displayEntries.length > 0 && (
            <button
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
              onMouseEnter={(e) => { e.target.style.color = 'var(--ivory)' }}
              onMouseLeave={(e) => { e.target.style.color = 'var(--text-dim)' }}
            >
              Clear history
            </button>
          )}
        </div>

        {displayEntries.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              📜
            </div>
            <p
              style={{
                color: 'var(--text-dim)',
                fontSize: '0.95rem',
                margin: '0 0 1.5rem',
              }}
            >
              No cards played yet.
            </p>
            <button
              onClick={() => navigate('/games')}
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
              onMouseEnter={(e) => { e.target.style.background = 'var(--gold-light)' }}
              onMouseLeave={(e) => { e.target.style.background = 'var(--gold)' }}
            >
              Start playing &rarr;
            </button>
          </div>
        ) : (
          Object.entries(grouped).map(([gameId, entries]) => (
            <div key={gameId} style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Badge variant="gold">{formatGameName(gameId)}</Badge>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-dim)',
                    letterSpacing: '0.04em',
                  }}
                >
                  &middot; {entries.length} card{entries.length !== 1 ? 's' : ''}
                </span>
              </div>
              {entries.map((entry) => (
                <HistoryCard key={entry.id} entry={entry} />
              ))}
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  )
}

export default History
