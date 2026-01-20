function Card({ children, className, onClick, hover = false }) {
  const style = {
    border: '0.5px solid rgba(201,168,76,0.22)',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(26,5,9,0.5)',
    padding: '1.6rem 1.4rem',
    transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
    cursor: onClick ? 'pointer' : undefined,
  }

  const handleEnter = (e) => {
    if (!hover) return
    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'
    e.currentTarget.style.transform = 'translateY(-2px)'
    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(201,168,76,0.4)'
  }

  const handleLeave = (e) => {
    if (!hover) return
    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.22)'
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <div
      className={`game-card${className ? ' ' + className : ''}`}
      onClick={onClick}
      style={style}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  )
}

export default Card
