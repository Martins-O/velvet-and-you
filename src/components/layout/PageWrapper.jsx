import Nav from './Nav'
import Footer from './Footer'

function PageWrapper({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--burgundy)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Nav />
      <div style={{ flex: 1 }}>{children}</div>
      <Footer />
    </div>
  )
}

export default PageWrapper
