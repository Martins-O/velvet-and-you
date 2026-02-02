import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import AuthModal from '../shared/AuthModal'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Games', to: '/games' },
  { label: 'History', to: '/history' },
  { label: 'Favourites', to: '/favourites' },
  { label: 'Profile', to: '/profile' },
]

const linkStyle = {
  fontSize: '0.82rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  transition: 'opacity 0.2s ease, color 0.2s ease',
}

function Nav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const { isAuthenticated } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(45, 10, 22, 0.95)',
        WebkitBackdropFilter: 'blur(8px)',
        backdropFilter: 'blur(8px)',
        borderBottom: '0.5px solid rgba(201, 168, 76, 0.2)',
        padding: '0.9rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold)' }}>
          Velvet
        </span>
        <span style={{ fontStyle: 'italic', color: 'var(--blush)' }}>
          {' '}& You
        </span>
      </Link>

      {!isMobile && (
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {links.map((link) => {
            const active = isActive(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  ...linkStyle,
                  opacity: active ? 1 : 0.8,
                  color: active ? 'var(--gold)' : 'var(--champagne)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1'
                  e.target.style.color = 'var(--gold)'
                }}
                onMouseLeave={(e) => {
                  const isLinkActive = isActive(link.to)
                  e.target.style.opacity = isLinkActive ? 1 : 0.8
                  e.target.style.color = isLinkActive ? 'var(--gold)' : 'var(--champagne)'
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <button
            onClick={() => {
              if (isAuthenticated) { navigate('/profile') } else { setShowAuth(true) }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: isAuthenticated ? 'var(--gold)' : 'var(--champagne)',
              fontSize: '0.82rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'color 0.2s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--gold)' }}
            onMouseLeave={(e) => { e.target.style.color = isAuthenticated ? 'var(--gold)' : 'var(--champagne)' }}
          >
            &#128100; {isAuthenticated ? 'Profile' : 'Sign in'}
          </button>
        </div>
      )}

      {isMobile && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gold)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.25rem',
            lineHeight: 1,
          }}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      )}

      {isMobile && menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--deep)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {links.map((link) => {
            const active = isActive(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  ...linkStyle,
                  opacity: active ? 1 : 0.8,
                  color: active ? 'var(--gold)' : 'var(--champagne)',
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <button
            onClick={() => { setMenuOpen(false); isAuthenticated ? navigate('/profile') : setShowAuth(true) }}
            style={{
              background: 'none',
              border: 'none',
              color: isAuthenticated ? 'var(--gold)' : 'var(--champagne)',
              fontSize: '0.82rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              padding: 0,
              textAlign: 'left',
            }}
          >
            &#128100; {isAuthenticated ? 'Profile' : 'Sign in'}
          </button>
        </div>
      )}
    </nav>

      <AuthModal
        isOpen={showAuth}
        initialTab="login"
        onClose={() => setShowAuth(false)}
      />
    </>
  )
}

export default Nav
