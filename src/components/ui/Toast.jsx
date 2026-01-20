import { useContext } from 'react'
import { ToastContext } from './useToast'

const typeStyles = {
  default: 'var(--gold)',
  success: '#4CAF50',
  error: '#E24B4A',
}

function ToastItem({ toast }) {
  return (
    <div
      className={toast.exiting ? 'toast-exit' : ''}
      style={{
        background: 'var(--deep)',
        border: '0.5px solid rgba(201,168,76,0.3)',
        borderLeft: `3px solid ${typeStyles[toast.type] || typeStyles.default}`,
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1.2rem',
        fontSize: '0.82rem',
        color: 'var(--ivory)',
        maxWidth: '300px',
        animation: toast.exiting ? undefined : 'toastIn 0.25s ease',
      }}
    >
      {toast.message}
    </div>
  )
}

function ToastContainer() {
  const { toasts } = useContext(ToastContext)

  if (!toasts || toasts.length === 0) return null

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </>
  )
}

export default ToastContainer
