import { useState } from 'react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import useGameStore from '../../store/gameStore'
import { useToast } from '../ui/useToast'

const gameOptions = [
  { id: 'truth', label: 'Truth or Dare' },
  { id: 'rather', label: 'Would You Rather' },
  { id: 'bottle', label: 'Spin the Bottle' },
  { id: 'quiz', label: 'Naughty Quiz' },
  { id: 'challenge', label: 'Couples Challenges' },
  { id: 'fantasy', label: 'Fantasy Scenario Builder' },
]

const intensityOptions = [
  { id: 'romantic', label: 'Romantic' },
  { id: 'playful', label: 'Playful' },
  { id: 'spicy', label: 'Spicy' },
]

const selectStyle = {
  background: 'rgba(26,5,9,0.5)',
  border: '0.5px solid rgba(201,168,76,0.22)',
  color: 'var(--ivory)',
  padding: '0.5rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.82rem',
  width: '100%',
  marginBottom: '0.75rem',
  fontFamily: 'var(--font-body)',
}

const labelStyle = {
  fontSize: '0.72rem',
  color: 'var(--text-dim)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '0.3rem',
}

function CustomPromptEditor() {
  const activeGame = useGameStore((s) => s.activeGame)
  const intensity = useGameStore((s) => s.intensity)
  const { addToast } = useToast()

  const [selectedGame, setSelectedGame] = useState(activeGame || 'truth')
  const [selectedIntensity, setSelectedIntensity] = useState(intensity || 'romantic')
  const [text, setText] = useState('')

  const storageKey = `velvet_custom_${selectedGame}`
  const [customPrompts, setCustomPrompts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]')
    } catch {
      return []
    }
  })

  const filteredPrompts = customPrompts.filter(
    (p) => p.intensity === selectedIntensity
  )

  const saveToStorage = (updated) => {
    localStorage.setItem(storageKey, JSON.stringify(updated))
    setCustomPrompts(updated)
  }

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (trimmed.length < 10) {
      addToast('Prompt must be at least 10 characters.')
      return
    }

    const updated = [
      { text: trimmed, intensity: selectedIntensity, addedAt: Date.now() },
      ...customPrompts,
    ]
    saveToStorage(updated)
    addToast('Prompt added! It will appear in your next deck.')
    setText('')
  }

  const handleDelete = (entry) => {
    const updated = customPrompts.filter(
      (p) => p.text !== entry.text || p.addedAt !== entry.addedAt
    )
    saveToStorage(updated)
    addToast('Prompt removed')
  }

  const handleGameChange = (e) => {
    const newGame = e.target.value
    setSelectedGame(newGame)
    const stored = JSON.parse(localStorage.getItem(`velvet_custom_${newGame}`) || '[]')
    setCustomPrompts(stored)
  }

  return (
    <div>
      <h4
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          color: 'var(--ivory)',
          margin: '0 0 1rem',
        }}
      >
        Custom Prompts
      </h4>

      <label style={labelStyle}>Game</label>
      <select
        value={selectedGame}
        onChange={handleGameChange}
        style={selectStyle}
      >
        {gameOptions.map((g) => (
          <option key={g.id} value={g.id}>
            {g.label}
          </option>
        ))}
      </select>

      <label style={labelStyle}>Intensity</label>
      <select
        value={selectedIntensity}
        onChange={(e) => setSelectedIntensity(e.target.value)}
        style={selectStyle}
      >
        {intensityOptions.map((io) => (
          <option key={io.id} value={io.id}>
            {io.label}
          </option>
        ))}
      </select>

      <label style={labelStyle}>Your prompt</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your prompt here..."
        maxLength={200}
        style={{
          ...selectStyle,
          resize: 'vertical',
          minHeight: '70px',
          marginBottom: '0.3rem',
        }}
      />
      <div
        style={{
          textAlign: 'right',
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
          marginBottom: '0.75rem',
        }}
      >
        {text.length} / 200
      </div>

      <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!text.trim()} style={{ width: '100%' }}>
        Add prompt
      </Button>

      <hr
        style={{
          border: 'none',
          borderTop: '0.5px solid rgba(201,168,76,0.15)',
          margin: '1.25rem 0',
        }}
      />

      {customPrompts.length > 0 && (
        <h5
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            color: 'var(--ivory)',
            margin: '0 0 0.75rem',
          }}
        >
          Your custom prompts
        </h5>
      )}

      {filteredPrompts.length === 0 ? (
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
            margin: 0,
          }}
        >
          No custom prompts yet for this game.
        </p>
      ) : (
        filteredPrompts.map((entry) => (
          <div
            key={entry.text + entry.addedAt}
            style={{
              border: '0.5px solid rgba(201,168,76,0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.6rem 0.75rem',
              marginBottom: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '0.5rem',
            }}
          >
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--ivory)',
                  margin: '0 0 0.3rem',
                  lineHeight: 1.5,
                }}
              >
                {entry.text}
              </p>
              <Badge variant="default">{entry.intensity}</Badge>
            </div>
            <button
              onClick={() => handleDelete(entry)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '0.2rem',
                lineHeight: 1,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.target.style.color = 'var(--blush)' }}
              onMouseLeave={(e) => { e.target.style.color = 'var(--text-dim)' }}
            >
              &#10005;
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default CustomPromptEditor
