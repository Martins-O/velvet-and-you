import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'

function NotFound() {
  const navigate = useNavigate()

  return (
    <PageWrapper>
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '5rem',
            color: 'var(--gold)',
            opacity: 0.4,
            margin: '0 0 0.5rem',
            lineHeight: 1,
          }}
        >
          404
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            color: 'var(--ivory)',
            margin: '0 0 0.5rem',
          }}
        >
          Room for two — but this page is empty.
        </h2>
        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '0.85rem',
            margin: '0 0 2rem',
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Button variant="primary" onClick={() => navigate('/')}>
            Go home
          </Button>
          <Button variant="outline" onClick={() => navigate('/games')}>
            Browse games
          </Button>
        </div>
      </div>
    </PageWrapper>
  )
}

export default NotFound
