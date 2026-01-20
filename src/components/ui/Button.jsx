function Button({ variant = 'primary', size = 'md', onClick, disabled, children, className }) {
  const base = {
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'var(--transition)',
    opacity: disabled ? 0.4 : 1,
    fontFamily: 'var(--font-body)',
  }

  const sizes = {
    sm: { fontSize: '0.65rem', padding: '0.4rem 0.9rem' },
    md: { fontSize: '0.82rem', padding: '0.75rem 2rem' },
    lg: { fontSize: '0.9rem', padding: '0.9rem 2.4rem' },
  }

  const variants = {
    primary: { background: 'var(--gold)', color: 'var(--deep)', border: 'none', fontWeight: 700 },
    outline: { background: 'transparent', color: 'var(--champagne)', border: '0.5px solid rgba(232,213,183,0.4)' },
    ghost: { background: 'transparent', color: 'var(--text-dim)', border: 'none' },
  }

  const handleEnter = (e) => {
    if (disabled) return
    if (variant === 'outline') {
      e.target.style.borderColor = 'var(--gold)'
      e.target.style.color = 'var(--gold)'
    } else if (variant === 'ghost') {
      e.target.style.color = 'var(--ivory)'
    } else if (variant === 'primary') {
      e.target.style.background = 'var(--gold-light)'
    }
  }

  const handleLeave = (e) => {
    if (disabled) return
    const v = variants[variant]
    e.target.style.borderColor = v.border || (variant === 'outline' ? 'rgba(232,213,183,0.4)' : '')
    e.target.style.color = v.color
    e.target.style.background = v.background
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={className}
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
    </button>
  )
}

export default Button
