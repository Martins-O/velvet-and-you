const modes = [
  {
    id: 'solo',
    icon: '\u{1F0CF}',
    title: 'Solo / Practice',
    body: 'Draw cards freely. No turns, no score.',
  },
  {
    id: 'pass-and-play',
    icon: '\u{1F4F1}',
    title: 'Pass & Play',
    body: 'Two players, one device. Take turns.',
  },
  {
    id: 'online',
    icon: '\u{1F310}',
    title: 'Play Online',
    body: 'Two devices. Real-time sync.',
  },
]

const cardBase = {
  border: '0.5px solid rgba(201,168,76,0.22)',
  borderRadius: 'var(--radius-md)',
  padding: '1.6rem',
  cursor: 'pointer',
  textAlign: 'center',
  minWidth: '180px',
  transition: 'border-color 0.2s ease, background 0.2s ease',
}

function ModeSelector({ selectedMode, onSelect }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginBottom: '3rem',
        flexWrap: 'wrap',
      }}
    >
      {modes.map((m) => {
        const active = selectedMode === m.id
        return (
          <div
            key={m.id}
            className="mode-card"
            onClick={() => onSelect(m.id)}
            style={{
              ...cardBase,
              borderColor: active ? 'var(--gold)' : 'rgba(201,168,76,0.22)',
              background: active
                ? 'rgba(201,168,76,0.08)'
                : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.22)'
              }
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>
              {m.icon}
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                color: active ? 'var(--gold)' : 'var(--ivory)',
                margin: '0 0 0.4rem',
              }}
            >
              {m.title}
            </h3>
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                margin: 0,
                fontWeight: 300,
                lineHeight: 1.5,
              }}
            >
              {m.body}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default ModeSelector
