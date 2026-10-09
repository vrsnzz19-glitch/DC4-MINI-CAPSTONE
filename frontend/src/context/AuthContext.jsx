import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient, { AUTH_TOKEN_KEY } from '../services/apiClient'
import AuthContext from './authContextValue'

function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem(AUTH_TOKEN_KEY)))
  const [authError, setAuthError] = useState('')

  const refreshUser = useCallback(async () => {
    setIsLoading(true)
    setAuthError('')

    try {
      const response = await apiClient.get('/user')
      setUser(response.data.data)
      return response.data.data
    } catch (error) {
      if (error.response?.status !== 401) {
        setAuthError(error.response?.data?.message || 'Unable to verify your session. Check your connection and try again.')
      }
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!localStorage.getItem(AUTH_TOKEN_KEY)) return undefined

    let active = true
    const restoreSession = async () => {
      try {
        const response = await apiClient.get('/user')
        if (active) {
          setUser(response.data.data)
          setAuthError('')
        }
      } catch (error) {
        if (active) {
          if (error.response?.status !== 401) {
            setAuthError(error.response?.data?.message || 'Unable to verify your session. Check your connection and try again.')
          }
          setUser(null)
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    restoreSession()
    return () => { active = false }
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      setUser(null)
      setAuthError('')
      setIsLoading(false)
      navigate('/login', { replace: true })
    }

    window.addEventListener('tonevault:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('tonevault:unauthorized', handleUnauthorized)
  }, [navigate])

  const login = useCallback(async (credentials) => {
    const response = await apiClient.post('/login', credentials)
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.token)
    setUser(response.data.user)
    setAuthError('')
    return response.data
  }, [])

  const register = useCallback(async (details) => {
    const response = await apiClient.post('/register', details)
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.token)
    setUser(response.data.user)
    setAuthError('')
    return response.data
  }, [])

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem(AUTH_TOKEN_KEY)) {
        await apiClient.post('/logout')
      }
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      setUser(null)
      setAuthError('')
    }
  }, [])

  const value = useMemo(() => ({
    user,
    isLoading,
    authError,
    login,
    register,
    logout,
    refreshUser,
  }), [user, isLoading, authError, login, register, logout, refreshUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
