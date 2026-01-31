import { useEffect, useRef } from 'react'
import Nav from './Nav'
import Footer from './Footer'

function PageWrapper({ children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.remove('page-enter')
    void el.offsetWidth
    el.classList.add('page-enter')
  }, [children])

  return (
    <div
      ref={ref}
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
