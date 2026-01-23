import Badge from '../ui/Badge'
import FavouriteButton from './FavouriteButton'

function CardDisplay({ card, isRevealed, gameId, intensity, onFavourite }) {
  const text = card && (typeof card === 'string' ? card : card.text)

  if (!card) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 1.5rem',
          border: '0.5px solid rgba(201,168,76,0.15)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
        }}
      >
        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '0.9rem',
            margin: 0,
          }}
        >
          Press &ldquo;Draw Card&rdquo; to begin
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        border: '0.5px solid rgba(201,168,76,0.22)',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(26,5,9,0.5)',
        padding: '2rem 1.5rem',
        marginBottom: '1.25rem',
        textAlign: 'center',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        animation: 'cardIn 0.3s ease',
      }}
    >
      {isRevealed ? (
        <>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--ivory)',
              lineHeight: 1.7,
              margin: 0,
              fontWeight: 300,
            }}
          >
            {text}
          </p>
          {card.__custom && (
            <div style={{ position: 'absolute', top: '0.6rem', left: '0.6rem' }}>
              <Badge variant="blush">Yours</Badge>
            </div>
          )}
          {gameId && intensity && (
            <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem' }}>
              <FavouriteButton card={text} gameId={gameId} intensity={intensity} onToggle={onFavourite} />
            </div>
          )}
        </>
      ) : (
        <>
          <style>{`
            @keyframes tapPulse {
              0%, 100% { opacity: 0.6; }
              50%      { opacity: 1; }
            }
          `}</style>
          <p
            style={{
              color: 'var(--text-dim)',
              fontSize: '0.85rem',
              margin: 0,
              fontStyle: 'italic',
              animation: 'tapPulse 1.5s ease-in-out infinite',
            }}
          >
            Tap to reveal
          </p>
        </>
      )}
    </div>
  )
}

export default CardDisplay
