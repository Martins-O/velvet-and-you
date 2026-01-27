function InviteLinkShare({ inviteUrl }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
    } catch {
      const el = document.createElement('textarea')
      el.value = inviteUrl
      el.style.position = 'fixed'
      el.style.opacity = 0
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url: inviteUrl })
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <p
        style={{
          color: 'var(--text-dim)',
          fontSize: '0.72rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
        }}
      >
        Or share the invite link
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <code
          style={{
            fontSize: '0.75rem',
            color: 'var(--champagne)',
            background: 'rgba(26,5,9,0.4)',
            padding: '0.4rem 0.7rem',
            borderRadius: 'var(--radius-sm)',
            wordBreak: 'break-all',
            maxWidth: '280px',
          }}
        >
          {inviteUrl}
        </code>
        <button
          onClick={handleCopy}
          style={{
            background: 'transparent',
            color: 'var(--gold)',
            border: '0.5px solid rgba(201,168,76,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.35rem 0.7rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => { e.target.style.background = 'rgba(201,168,76,0.1)' }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent' }}
        >
          Copy
        </button>
        {navigator.share && (
          <button
            onClick={handleShare}
            style={{
              background: 'transparent',
              color: 'var(--gold)',
              border: '0.5px solid rgba(201,168,76,0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.7rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(201,168,76,0.1)' }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent' }}
          >
            Share
          </button>
        )}
      </div>

      <p
        style={{
          color: 'var(--text-dim)',
          fontSize: '0.72rem',
          marginTop: '0.6rem',
          fontStyle: 'italic',
        }}
      >
        Room expires in 30 minutes if nobody joins.
      </p>
    </div>
  )
}

export default InviteLinkShare
