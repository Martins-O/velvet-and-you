import { useState, useEffect } from 'react'
import Badge from '../ui/Badge'
import useGameStore from '../../store/gameStore'
import useSessionStore from '../../store/sessionStore'
import useRoomStore from '../../store/roomStore'
import { buildDeck, drawNext } from '../../utils/deck'
import { calculatePoints } from '../../utils/scoring'
import { useSound } from '../../hooks/useSound'
import { useToast } from '../ui/useToast'

function classifyPrompt(text) {
  const lower = text.toLowerCase()

  if (/(kiss|hold hands|nuzzle|massage|trace|brush your fingers|cup|cradle|rest your head|lock eyes|intertwine|stare)/.test(lower))
    return 'Romantic Act'

  if (/(compliment|praise|admire|love about|irresistible|grateful|appreciate)/.test(lower))
    return 'Compliment'

  if (/(blindfold|plan|dance|write a poem|write a short poem)/.test(lower))
    return 'Challenge'

  if (/^(what|how|when|where|why|name |describe|share a|share your)/.test(lower))
    return 'Truth'

  return 'Dare'
}

const badgeVariant = {
  Truth: 'default',
  Dare: 'gold',
  Compliment: 'blush',
  'Romantic Act': 'gold',
  Challenge: 'gold',
}

function SpinBottle() {
  const [deck, setDeck] = useState([])
  const [usedIndices, setUsedIndices] = useState([])
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState(null)
  const [promptType, setPromptType] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  const scoringEnabled = useGameStore((s) => s.scoringEnabled)
  const activeGame = useGameStore((s) => s.activeGame)
  const currentTurn = useGameStore((s) => s.currentTurn)
  const addScore = useGameStore((s) => s.addScore)
  const advanceTurn = useGameStore((s) => s.advanceTurn)
  const addToHistory = useSessionStore((s) => s.addToHistory)
  const mode = useRoomStore((s) => s.mode)
  const { addToast } = useToast()
  const { play } = useSound()

  useEffect(() => {
    ;(async () => {
      const d = await buildDeck('bottle')
      setDeck(d)
    })()
  }, [])

  const handleSpin = () => {
    if (isSpinning) return
    play('bottle_spin')
    setIsSpinning(true)
    setShowPrompt(false)

    const delta = 720 + Math.random() * 360
    setRotation((prev) => prev + delta)

    setTimeout(() => {
      let result = drawNext(deck, usedIndices)
      if (result.exhausted) {
        setUsedIndices([])
        addToast('Deck reshuffled')
        result = drawNext(deck, [])
      }

      const cardText = typeof result.card === 'string' ? result.card : result.card.text
      setCurrentPrompt(cardText)
      setPromptType(classifyPrompt(cardText))
      setUsedIndices((prev) => [...prev, result.index])
      setShowPrompt(true)
      setIsSpinning(false)

      const playerIdx = mode === 'solo' ? 0 : currentTurn
      addToHistory({
        game: 'bottle',
        intensity: 'romantic',
        text: cardText,
        playerIndex: playerIdx,
        result: 'completed',
      })

      if (scoringEnabled) {
        addScore(playerIdx, calculatePoints('complete', activeGame))
      }

      if (mode !== 'solo') advanceTurn()
    }, 2000)
  }

  return (
    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
      <div
        onClick={handleSpin}
        style={{
          display: 'inline-block',
          cursor: isSpinning ? 'not-allowed' : 'pointer',
          '--spin-angle': `${rotation}deg`,
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 2s cubic-bezier(0.25, 0.1, 0.25, 1)',
          marginBottom: '1rem',
        }}
      >
        <svg width="80" height="220" viewBox="0 0 80 220">
          <rect x="28" y="8" width="24" height="16" rx="3" fill="var(--gold)" />
          <path
            d="M 32,24 L 48,24 L 51,65 L 29,65 Z"
            fill="var(--deep)"
            stroke="var(--gold)"
            strokeWidth="0.8"
          />
          <path
            d="M 29,65 C 20,70 12,82 12,100 L 12,185 Q 12,210 40,210 Q 68,210 68,185 L 68,100 C 68,82 60,70 51,65 Z"
            fill="var(--deep)"
            stroke="var(--gold)"
            strokeWidth="0.8"
          />
          <ellipse cx="32" cy="130" rx="6" ry="30" fill="white" opacity="0.08" />
          <rect
            x="22"
            y="115"
            width="36"
            height="40"
            rx="2"
            fill="rgba(201,168,76,0.1)"
            stroke="var(--gold)"
            strokeWidth="0.5"
          />
          <text
            x="40"
            y="140"
            textAnchor="middle"
            fill="var(--gold)"
            fontSize="9"
            fontFamily="Playfair Display, serif"
          >
            V&Y
          </text>
        </svg>
      </div>

      <p
        style={{
          color: 'var(--text-dim)',
          fontSize: '0.82rem',
          marginBottom: '1.5rem',
          letterSpacing: '0.05em',
        }}
      >
        {isSpinning
          ? 'Spinning...'
          : showPrompt
            ? 'Tap the bottle to spin again'
            : 'Tap the bottle to spin'}
      </p>

      {showPrompt && currentPrompt && (
        <div
          key={currentPrompt}
          style={{
            border: '0.5px solid rgba(201,168,76,0.22)',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(26,5,9,0.5)',
            padding: '1.6rem 1.4rem',
            maxWidth: '480px',
            margin: '0 auto',
            animation: 'promptIn 0.35s ease-out',
          }}
        >
          {promptType && (
            <div style={{ marginBottom: '0.75rem' }}>
              <Badge variant={badgeVariant[promptType] || 'default'}>
                {promptType}
              </Badge>
            </div>
          )}
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--ivory)',
              lineHeight: 1.7,
              margin: 0,
              fontWeight: 300,
            }}
          >
            {currentPrompt}
          </p>
        </div>
      )}
    </div>
  )
}

export default SpinBottle
