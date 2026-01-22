import { useCallback, useState, useEffect } from 'react'
import { apiFetch } from '../utils/api'
import useSessionStore from '../store/sessionStore'

function getToken() {
  return localStorage.getItem('velvet_auth_token')
}

function getUserId() {
  return localStorage.getItem('velvet_user_id')
}

function storeAuth(token, userId) {
  localStorage.setItem('velvet_auth_token', token)
  localStorage.setItem('velvet_user_id', userId)
}

function clearAuth() {
  localStorage.removeItem('velvet_auth_token')
  localStorage.removeItem('velvet_user_id')
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken())
  const [userId, setUserId] = useState(getUserId)

  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(!!getToken())
      setUserId(getUserId())
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    storeAuth(data.token, data.userId)
    setIsAuthenticated(true)
    setUserId(data.userId)
    return data
  }, [])

  const register = useCallback(async ({ email, password, playerNames }) => {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, playerNames }),
    })
    storeAuth(data.token, data.userId || null)
    setIsAuthenticated(true)
    return data
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setIsAuthenticated(false)
    setUserId(null)
    const { resetSession } = useSessionStore.getState()
    resetSession()
  }, [])

  const syncData = useCallback(async () => {
    const token = getToken()
    if (!token) return

    const favourites = JSON.parse(localStorage.getItem('velvet_favourites') || '[]')
    const history = useSessionStore.getState().history

    try {
      await apiFetch('/api/profile/sync', {
        method: 'POST',
        body: JSON.stringify({ favourites, history }),
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {
      // silent — sync is best-effort
    }
  }, [])

  const fetchProfile = useCallback(async () => {
    const token = getToken()
    if (!token) return null
    return apiFetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
  }, [])

  return { isAuthenticated, userId, login, register, logout, syncData, fetchProfile }
}
