const levels = ['romantic', 'playful', 'spicy']

const labels = {
  romantic: 'Romantic',
  playful: 'Playful',
  spicy: 'Spicy',
}

function IntensitySelector({ value, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem',
      }}
    >
      {levels.map((level) => {
        const active = value === level
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            style={{
              background: active ? 'rgba(201,168,76,0.15)' : 'transparent',
              color: active ? 'var(--gold)' : 'var(--text-dim)',
              border: active
                ? '0.5px solid var(--gold)'
                : '0.5px solid rgba(201,168,76,0.15)',
              padding: '0.4rem 1.2rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            {labels[level]}
          </button>
        )
      })}
    </div>
  )
}

export default IntensitySelector
