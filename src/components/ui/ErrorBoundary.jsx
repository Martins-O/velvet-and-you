import { Component } from 'react'
import Button from './Button'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              textAlign: 'center',
              border: '0.5px solid rgba(201,168,76,0.22)',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(26,5,9,0.5)',
              padding: '3rem 2rem',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              ⚠️
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                color: 'var(--ivory)',
                margin: '0 0 0.5rem',
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                color: 'var(--text-dim)',
                fontSize: '0.85rem',
                margin: '0 0 2rem',
              }}
            >
              Refresh the page to continue.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Button variant="primary" size="md" onClick={() => window.location.reload()}>
                Refresh
              </Button>
              <Button variant="ghost" size="md" onClick={() => { window.location.href = '/' }}>
                Go home
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
