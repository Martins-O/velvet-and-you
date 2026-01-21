function Footer() {
  return (
    <footer
      style={{
        borderTop: '0.5px solid rgba(201, 168, 76, 0.15)',
        padding: '2rem',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-dim)',
        letterSpacing: '0.06em',
      }}
    >
      <span style={{ color: 'var(--gold)' }}>Velvet & You</span>
      {' · '}
      For consenting adults
      {' · '}
      Play responsibly
    </footer>
  )
}

export default Footer
