function Badge({ children, variant = 'default' }) {
  const variants = {
    default: { background: 'rgba(255,255,255,0.08)', color: 'var(--champagne)' },
    gold: { background: 'rgba(201,168,76,0.15)', color: 'var(--gold)' },
    blush: { background: 'rgba(242,196,206,0.15)', color: 'var(--blush)' },
  }

  return (
    <span
      style={{
        ...variants[variant],
        fontSize: '0.65rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '0.25rem 0.6rem',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {children}
    </span>
  )
}

export default Badge
