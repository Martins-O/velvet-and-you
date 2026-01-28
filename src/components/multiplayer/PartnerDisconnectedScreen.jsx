import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

function PartnerDisconnectedScreen({ isOpen, countdown, onWait, onNewRoom }) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleNewRoom = () => {
    if (onNewRoom) onNewRoom()
    navigate('/games')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,5,9,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1 }}>
          &#x1F4E1;
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            color: 'var(--ivory)',
            margin: '0 0 0.75rem',
          }}
        >
          Partner disconnected
        </h2>
        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            margin: '0 0 1.5rem',
          }}
        >
          The connection was lost. The room will close if they don't reconnect.
        </p>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            color: 'var(--gold)',
            marginBottom: '2rem',
          }}
        >
          {countdown}s
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {onWait && (
            <Button variant="ghost" onClick={onWait}>
              Wait for them
            </Button>
          )}
          <Button variant="primary" onClick={handleNewRoom}>
            Start a new room
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PartnerDisconnectedScreen
