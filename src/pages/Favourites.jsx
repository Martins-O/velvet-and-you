import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import Badge from '../components/ui/Badge'
import useLocalStorage from '../hooks/useLocalStorage'
import useGameStore from '../store/gameStore'
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

function formatDate(ts) {
  const d = new Date(ts)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function Favourites() {
  const navigate = useNavigate()
  const [favourites, setFavourites] = useLocalStorage('velvet_favourites', [])
  const setCustomDeck = useGameStore((s) => s.setCustomDeck)
  const setActiveGame = useGameStore((s) => s.setActiveGame)
  const { addToast } = useToast()

  const grouped = favourites.reduce((acc, entry) => {
    const key = entry.gameId || 'unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(entry)
    return acc
  }, {})

  const handleClearAll = () => {
    if (window.confirm('Clear all favourites?')) {
      setFavourites([])
      addToast('All favourites cleared')
    }
  }

  const handleRemove = (card) => {
    setFavourites(favourites.filter((f) => f.card !== card))
    addToast('Removed from favourites')
  }

  const handlePlayFavourites = (gameId, cards) => {
    setActiveGame(gameId)
    const texts = cards.map((c) => c.card)
    setCustomDeck(texts)
    navigate(`/games/${gameId}`)
  }

  const totalCards = favourites.length

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
            Your Favourites
          </h1>
          {totalCards > 0 && (
            <button
              onClick={handleClearAll}
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
              Clear all
            </button>
          )}
        </div>

        {totalCards === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-dim)' }}>
              &#9825;
            </div>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                color: 'var(--ivory)',
                margin: '0 0 0.5rem',
              }}
            >
              Nothing saved yet.
            </p>
            <p
              style={{
                color: 'var(--text-dim)',
                fontSize: '0.85rem',
                margin: 0,
              }}
            >
              Cards you love will appear here.
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([gameId, cards]) => (
            <div key={gameId} style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Badge variant="gold">{formatGameName(gameId)}</Badge>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-dim)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    &middot; {cards.length} saved
                  </span>
                </div>
                <button
                  onClick={() => handlePlayFavourites(gameId, cards)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--gold)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={(e) => { e.target.style.color = 'var(--gold-light)' }}
                  onMouseLeave={(e) => { e.target.style.color = 'var(--gold)' }}
                >
                  Play Favourites
                </button>
              </div>

              {cards.map((entry) => (
                <div
                  key={entry.card + entry.savedAt}
                  style={{
                    border: '0.5px solid rgba(201,168,76,0.22)',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(26,5,9,0.5)',
                    padding: '1rem 1.25rem',
                    marginBottom: '0.5rem',
                    position: 'relative',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.95rem',
                      color: 'var(--ivory)',
                      lineHeight: 1.6,
                      margin: '0 0 0.6rem',
                      paddingRight: '1.2rem',
                    }}
                  >
                    {entry.card}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.72rem',
                      color: 'var(--text-dim)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {entry.intensity && (
                        <Badge variant="default">{entry.intensity}</Badge>
                      )}
                      <span>{formatDate(entry.savedAt)}</span>
                    </div>
                    <button
                      onClick={() => handleRemove(entry.card)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-dim)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        padding: '0.2rem',
                        lineHeight: 1,
                      }}
                      onMouseEnter={(e) => { e.target.style.color = 'var(--blush)' }}
                      onMouseLeave={(e) => { e.target.style.color = 'var(--text-dim)' }}
                    >
                      &#10005;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  )
}

export default Favourites
