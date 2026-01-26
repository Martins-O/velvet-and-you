import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import AuthModal from '../components/shared/AuthModal'
import useSessionStore from '../store/sessionStore'
import useGameStore from '../store/gameStore'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/ui/useToast'

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

const sectionLabel = {
  fontSize: '0.72rem',
  color: 'var(--text-dim)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  marginBottom: '0.25rem',
}

function Toggle({ value, onChange, label }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
      }}
    >
      <span style={{ fontSize: '0.85rem', color: 'var(--ivory)', fontFamily: 'var(--font-body)' }}>
        {label}
      </span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: '40px',
          height: '22px',
          borderRadius: '11px',
          background: value ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s ease',
          padding: 0,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '2px',
            left: value ? '20px' : '2px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s ease',
          }}
        />
      </button>
    </div>
  )
}

const gameNameMap = {
  truth: 'Truth or Dare',
  rather: 'Would You Rather',
  bottle: 'Spin the Bottle',
  quiz: 'Naughty Quiz',
  challenge: 'Couples Challenges',
  fantasy: 'Fantasy Scenarios',
}

function formatGame(id) {
  if (!id) return '\u2014'
  return gameNameMap[id] || id.charAt(0).toUpperCase() + id.slice(1)
}

function Profile() {
  const playerNames = useSessionStore((s) => s.playerNames)
  const setPlayerNames = useSessionStore((s) => s.setPlayerNames)
  const history = useSessionStore((s) => s.history)
  const clearHistory = useSessionStore((s) => s.clearHistory)

  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const setSoundEnabled = useGameStore((s) => s.setSoundEnabled)
  const scoringEnabled = useGameStore((s) => s.scoringEnabled)
  const setScoringEnabled = useGameStore((s) => s.setScoringEnabled)

  const { addToast } = useToast()
  const { isAuthenticated, logout, fetchProfile } = useAuth()

  const [editing, setEditing] = useState(false)
  const [editNames, setEditNames] = useState([...playerNames])
  const [nameFocus, setNameFocus] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authTab, setAuthTab] = useState('login')

  // --- Stats ---
  const cardsPlayed = history.length
  const daresCompleted = history.filter(
    (e) => e.game === 'dare' && e.result === 'completed'
  ).length
  const cardsFavourited = history.filter(
    (e) => e.result === 'favourited'
  ).length

  const gameCounts = {}
  history.forEach((e) => {
    gameCounts[e.game] = (gameCounts[e.game] || 0) + 1
  })
  const mostPlayedRaw =
    Object.entries(gameCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  // --- Handlers ---
  const handleSignOut = () => {
    logout()
    addToast('Signed out')
  }

  const handleSaveNames = () => {
    const n1 = editNames[0].trim() || 'Player 1'
    const n2 = editNames[1].trim() || 'Player 2'
    if (n1.length > 20 || n2.length > 20) {
      addToast('Names must be 20 characters or fewer.')
      return
    }
    setPlayerNames([n1, n2])
    addToast('Names updated')
    setEditing(false)
  }

  const handleClearHistory = () => {
    clearHistory()
    addToast('Session history cleared')
  }

  const handleResetPrompts = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('velvet_custom_')) localStorage.removeItem(key)
    })
    addToast('All custom prompts reset')
  }

  const handleResetSetup = () => {
    localStorage.removeItem('velvet_setup_complete')
    addToast('Setup prompt will appear on next visit')
  }

  const metricBox = (label, value) => (
    <div
      style={{
        background: 'rgba(26,5,9,0.5)',
        border: '0.5px solid rgba(201,168,76,0.15)',
        borderRadius: '4px',
        padding: '1rem',
        textAlign: 'center',
      }}
    >
      <p style={{ ...sectionLabel, margin: '0 0 0.4rem' }}>{label}</p>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem',
          color: 'var(--gold)',
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  )

  return (
    <PageWrapper>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.8rem',
            color: 'var(--ivory)',
            margin: '0 0 1.5rem',
          }}
        >
          Your Profile
        </h1>

        {/* Auth Section */}
        {isAuthenticated ? (
          <div
            style={{
              border: '0.5px solid rgba(201,168,76,0.22)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Signed in
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--ivory)', margin: '0.2rem 0 0' }}>
                {playerNames[0]} &amp; {playerNames[1]}
              </p>
            </div>
            <span
              style={{
                background: 'rgba(76,175,80,0.15)',
                color: '#4CAF50',
                padding: '0.25rem 0.6rem',
                borderRadius: '2px',
                fontSize: '0.65rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Data saved to account
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>Sign out</Button>
          </div>
        ) : (
          <div
            style={{
              border: '0.5px solid rgba(201,168,76,0.22)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>&#128274;</div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                color: 'var(--ivory)',
                margin: '0 0 0.4rem',
              }}
            >
              Save your progress
            </h2>
            <p
              style={{
                color: 'var(--text-dim)',
                fontSize: '0.82rem',
                margin: '0 0 1.25rem',
              }}
            >
              Create a free account to back up your favourites and session history.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Button variant="primary" onClick={() => { setAuthTab('register'); setShowAuth(true) }}>
                Create account
              </Button>
              <Button variant="outline" onClick={() => { setAuthTab('login'); setShowAuth(true) }}>
                Sign in
              </Button>
            </div>
          </div>
        )}

        {/* Section 1 — Names */}
        <section style={{ marginBottom: '2rem' }}>
          <p style={sectionLabel}>Names</p>
          {editing ? (
            <div>
              <input
                value={editNames[0]}
                onChange={(e) =>
                  setEditNames([e.target.value, editNames[1]])
                }
                onFocus={() => setNameFocus('p1')}
                onBlur={() => setNameFocus(null)}
                placeholder="Your name"
                style={{
                  ...inputStyle,
                  border:
                    nameFocus === 'p1'
                      ? '0.5px solid var(--gold)'
                      : '0.5px solid rgba(201,168,76,0.3)',
                }}
              />
              <input
                value={editNames[1]}
                onChange={(e) =>
                  setEditNames([editNames[0], e.target.value])
                }
                onFocus={() => setNameFocus('p2')}
                onBlur={() => setNameFocus(null)}
                placeholder="Partner's name"
                style={{
                  ...inputStyle,
                  border:
                    nameFocus === 'p2'
                      ? '0.5px solid var(--gold)'
                      : '0.5px solid rgba(201,168,76,0.3)',
                }}
              />
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <Button variant="primary" size="sm" onClick={handleSaveNames}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p
                  style={{
                    color: 'var(--ivory)',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-body)',
                    margin: 0,
                  }}
                >
                  {playerNames[0]}
                </p>
                <p
                  style={{
                    color: 'var(--text-dim)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-body)',
                    margin: '0.15rem 0 0',
                  }}
                >
                  &amp; {playerNames[1]}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                Edit
              </Button>
            </div>
          )}
        </section>

        <hr
          style={{
            border: 'none',
            borderTop: '0.5px solid rgba(201,168,76,0.12)',
            margin: '0 0 2rem',
          }}
        />

        {/* Section 2 — Session Stats */}
        <section style={{ marginBottom: '2rem' }}>
          <p style={sectionLabel}>Session Stats</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            {metricBox('Cards Played', cardsPlayed)}
            {metricBox('Dares Completed', daresCompleted)}
            {metricBox('Cards Favourited', cardsFavourited)}
            {metricBox('Most Played', formatGame(mostPlayedRaw))}
          </div>
        </section>

        <hr
          style={{
            border: 'none',
            borderTop: '0.5px solid rgba(201,168,76,0.12)',
            margin: '0 0 2rem',
          }}
        />

        {/* Section 3 — Preferences */}
        <section style={{ marginBottom: '2rem' }}>
          <p style={sectionLabel}>Preferences</p>
          <div
            style={{
              background: 'rgba(26,5,9,0.5)',
              border: '0.5px solid rgba(201,168,76,0.15)',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
            }}
          >
            <Toggle
              label="Sound effects"
              value={soundEnabled}
              onChange={setSoundEnabled}
            />
            <Toggle
              label="Scoring"
              value={scoringEnabled}
              onChange={setScoringEnabled}
            />
          </div>
        </section>

        <hr
          style={{
            border: 'none',
            borderTop: '0.5px solid rgba(201,168,76,0.12)',
            margin: '0 0 2rem',
          }}
        />

        {/* Section 4 — Data */}
        <section>
          <p style={sectionLabel}>Data</p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              alignItems: 'flex-start',
            }}
          >
            <Button variant="ghost" size="sm" onClick={handleClearHistory}>
              Clear session history
            </Button>
            <Button variant="ghost" size="sm" onClick={handleResetPrompts}>
              Reset all custom prompts
            </Button>
            <Button variant="ghost" size="sm" onClick={handleResetSetup}>
              Reset setup
            </Button>
          </div>
        </section>
      </div>

      <AuthModal
        isOpen={showAuth}
        initialTab={authTab}
        onClose={() => setShowAuth(false)}
      />
    </PageWrapper>
  )
}

export default Profile
