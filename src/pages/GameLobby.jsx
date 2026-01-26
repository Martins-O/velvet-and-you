import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ModeSelector from '../components/multiplayer/ModeSelector'
import useRoomStore from '../store/roomStore'
import useGameStore from '../store/gameStore'

const games = [
  {
    id: 'truth',
    icon: '\u{1F56D}\uFE0F',
    tag: 'Classic',
    title: 'Truth or Dare',
    desc: 'Reveal secrets and take bold dares in this timeless favourite.',
  },
  {
    id: 'rather',
    icon: '\u{1F339}',
    tag: 'Decisions',
    title: 'Would You Rather',
    desc: 'Tough choices that spark laughter and surprising revelations.',
  },
  {
    id: 'bottle',
    icon: '\u{1F37E}',
    tag: 'Spontaneous',
    title: 'Spin the Bottle',
    desc: 'Let fate decide your next move with a classic spin.',
  },
  {
    id: 'quiz',
    icon: '\u{1F48B}',
    tag: 'Trivia',
    title: 'Naughty Quiz',
    desc: 'Test how well you really know each other\'s desires.',
  },
  {
    id: 'challenge',
    icon: '\u{1F3B2}',
    tag: 'Action',
    title: 'Couples Challenges',
    desc: 'Interactive tasks designed to bring you closer together.',
  },
  {
    id: 'fantasy',
    icon: '\u2728',
    tag: 'Imagination',
    title: 'Fantasy Scenario Builder',
    desc: 'Explore romantic, playful, and spicy "what if" scenarios.',
  },
]

function GameLobby() {
  const navigate = useNavigate()
  const mode = useRoomStore((s) => s.mode)
  const setMode = useRoomStore((s) => s.setMode)
  const setActiveGame = useGameStore((s) => s.setActiveGame)

  const handleGameClick = (gameId) => {
    setActiveGame(gameId)
    navigate(`/games/${gameId}`)
  }

  return (
    <PageWrapper>
      <div style={{ padding: '3rem 2rem', maxWidth: '920px', margin: '0 auto' }}>
        <ModeSelector selectedMode={mode} onSelect={setMode} />

        {mode === 'online' && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => navigate('/room?action=create')}
                style={{
                  background: 'var(--gold)',
                  color: 'var(--deep)',
                  border: 'none',
                  padding: '0.7rem 1.8rem',
                  fontSize: '0.82rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => { e.target.style.background = 'var(--gold-light)' }}
                onMouseLeave={(e) => { e.target.style.background = 'var(--gold)' }}
              >
                Create a Room
              </button>
              <button
                onClick={() => navigate('/room?action=join')}
                style={{
                  background: 'transparent',
                  color: 'var(--champagne)',
                  border: '0.5px solid rgba(232,213,183,0.4)',
                  padding: '0.7rem 1.8rem',
                  fontSize: '0.82rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--gold)'
                  e.target.style.color = 'var(--gold)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(232,213,183,0.4)'
                  e.target.style.color = 'var(--champagne)'
                }}
              >
                Join a Room
              </button>
            </div>
            <p
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
                marginTop: '0.75rem',
                letterSpacing: '0.05em',
              }}
            >
              A room code will be generated so your partner can join.
            </p>
          </div>
        )}

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            textAlign: 'center',
            color: 'var(--ivory)',
            margin: '0 0 0.25rem',
          }}
        >
          Choose Your Game
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-dim)',
            fontSize: '0.85rem',
            margin: '0 0 2rem',
            fontWeight: 300,
          }}
        >
          Pick a mood. Set your intensity. Let the night unfold.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {games.map((game) => (
            <Card key={game.id} hover onClick={() => handleGameClick(game.id)}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                {game.icon}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <Badge variant="gold">{game.tag}</Badge>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem',
                  color: 'var(--ivory)',
                  margin: '0.5rem 0 0.4rem',
                }}
              >
                {game.title}
              </h3>
              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-dim)',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  margin: '0 0 0.75rem',
                }}
              >
                {game.desc}
              </p>
              <span
                className="play-arrow"
                style={{
                  display: 'inline-block',
                  fontSize: '0.78rem',
                  color: 'var(--gold)',
                  letterSpacing: '0.05em',
                }}
              >
                Play now &rarr;
              </span>
            </Card>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}

export default GameLobby
