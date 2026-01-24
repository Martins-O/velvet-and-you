import CustomPromptEditor from '../shared/CustomPromptEditor'

function GameSettingsPanel({ onClose }) {
  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 250,
        }}
        onClick={onClose}
      >
          <div
            onClick={(e) => e.stopPropagation()}
            className="settings-panel"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '340px',
            background: 'var(--deep)',
            borderLeft: '0.5px solid rgba(201,168,76,0.2)',
            padding: '2rem',
            overflowY: 'auto',
            animation: 'slideIn 0.25s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                color: 'var(--ivory)',
                margin: 0,
              }}
            >
              Game Settings
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                fontSize: '1.2rem',
                cursor: 'pointer',
              }}
            >
              &#10005;
            </button>
          </div>
          <CustomPromptEditor />
        </div>
      </div>
    </>
  )
}

export default GameSettingsPanel
