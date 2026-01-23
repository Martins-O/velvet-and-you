import Badge from '../ui/Badge'
import useSessionStore from '../../store/sessionStore'

const resultBorder = {
  completed: '2px solid var(--gold)',
  skipped: '2px solid var(--text-dim)',
  favourited: '2px solid var(--blush)',
}

const resultBadge = {
  completed: { variant: 'gold', label: 'Done' },
  skipped: { variant: 'default', label: 'Skipped' },
  favourited: { variant: 'blush', label: 'Favourited' },
}

function HistoryCard({ entry }) {
  const playerNames = useSessionStore((s) => s.playerNames)

  const border = resultBorder[entry.result] || resultBorder.skipped
  const badge = resultBadge[entry.result] || resultBadge.skipped
  const label =
    entry.note === 'timer' ? 'Timed out' : badge.label

  const ts = new Date(entry.ts)
  const time =
    String(ts.getHours()).padStart(2, '0') +
    ':' +
    String(ts.getMinutes()).padStart(2, '0')

  return (
    <div
      style={{
        borderLeft: border,
        background: 'rgba(26,5,9,0.5)',
        padding: '1rem 1.25rem',
        marginBottom: '0.5rem',
        borderRadius: '4px',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          color: 'var(--ivory)',
          lineHeight: 1.6,
          margin: '0 0 0.6rem',
        }}
      >
        {entry.text}
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
          letterSpacing: '0.04em',
        }}
      >
        <span>
          {playerNames[entry.playerIndex]} &middot; {time}
        </span>
        <Badge variant={badge.variant}>{label}</Badge>
      </div>
    </div>
  )
}

export default HistoryCard
