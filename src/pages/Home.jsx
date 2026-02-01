import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: Math.random() * 80 + 10,
  top: Math.random() * 80 + 10,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 8 + 4,
  delay: Math.random() * 10,
  peakOpacity: Math.random() * 0.35 + 0.15,
}))

const cards = [
  {
    icon: '\u{1F3B4}',
    step: '01',
    title: 'Pick a game',
    body: 'Choose from six games designed for couples.',
  },
  {
    icon: '\u26A1',
    step: '02',
    title: 'Set the mood',
    body: 'Select Romantic, Playful, or Spicy intensity.',
  },
  {
    icon: '\u2728',
    step: '03',
    title: 'Play together',
    body: 'Take turns, earn points, and discover each other.',
  },
]

const btnPrimary = {
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
  transition: 'background 0.2s ease, transform 0.2s ease',
}

function Home() {
  const navigate = useNavigate()

  return (
    <PageWrapper>
      <style>{`
        @keyframes float {
          0%   { opacity: 0; transform: translateY(0) scale(0.5); }
          20%  { opacity: 1; transform: translateY(0) scale(1); }
          80%  { opacity: 1; transform: translateY(-60px) scale(1); }
          100% { opacity: 0; transform: translateY(-80px) scale(0.3); }
        }
        @media (max-width: 640px) {
          .hiw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '5rem 2rem 4rem',
          textAlign: 'center',
          background:
            'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(201,168,76,0.08) 0%, transparent 70%)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                background: 'var(--gold)',
                '--peak-opacity': p.peakOpacity,
                animation: `float ${p.duration}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '1.2rem',
            }}
          >
            For Couples · Adults Only
          </p>

          <h1
            className="hero-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 600,
              margin: '0 0 0.5rem',
              color: 'var(--ivory)',
            }}
          >
            Play Together.
            <br />
            <span style={{ fontStyle: 'italic', color: 'var(--blush)' }}>
              Closer than ever.
            </span>
          </h1>

          <p
            style={{
              fontWeight: 300,
              color: 'var(--champagne)',
              maxWidth: '480px',
              margin: '0 auto 2.5rem',
              opacity: 0.85,
              lineHeight: 1.7,
            }}
          >
            Six intimate games designed to spark conversation, laughter, and
            connection — from playful dares to deep desires.
          </p>

          <div
            className="hero-cta"
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => navigate('/games')}
              style={btnPrimary}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--gold-light)'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--gold)'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              Explore the Games
            </button>

            <button
              onClick={() =>
                document
                  .getElementById('how-it-works')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              style={{
                background: 'transparent',
                color: 'var(--champagne)',
                border: '0.5px solid rgba(232,213,183,0.4)',
                padding: '0.75rem 2rem',
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
              How It Works
            </button>
          </div>
        </div>
      </section>

      <div
        style={{
          width: '60px',
          height: '0.5px',
          background:
            'linear-gradient(to right, transparent, var(--gold), transparent)',
          margin: '3rem auto',
        }}
      />

      <section id="how-it-works" style={{ padding: '0 2rem 5rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.9rem',
            textAlign: 'center',
            color: 'var(--ivory)',
            marginBottom: '2.5rem',
          }}
        >
          How It Works
        </h2>

        <div
          className="hiw-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            maxWidth: '760px',
            margin: '0 auto',
          }}
        >
          {cards.map((card) => (
            <div
              key={card.step}
              style={{
                border: '0.5px solid rgba(201,168,76,0.22)',
                borderRadius: 'var(--radius-md)',
                padding: '1.6rem 1.4rem',
                background: 'rgba(26,5,9,0.5)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>
                {card.icon}
              </div>
              <p
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  margin: '0 0 0.5rem',
                }}
              >
                {card.step}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  color: 'var(--ivory)',
                  margin: '0 0 0.4rem',
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-dim)',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            onClick={() => navigate('/games')}
            style={btnPrimary}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--gold-light)'
              e.target.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--gold)'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            Start Playing
          </button>
        </div>
      </section>
    </PageWrapper>
  )
}

export default Home
