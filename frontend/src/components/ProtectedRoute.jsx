import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Button, ErrorMessage, LoadingSpinner } from './ui'
import useAuth from '../hooks/useAuth'

export function ProtectedRoute() {
  const { user, isLoading, authError, refreshUser } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingSpinner label="Checking your session..." />

  if (authError) {
    return <main className="auth-check-state">
      <ErrorMessage>{authError}</ErrorMessage>
      <Button variant="primary" onClick={refreshUser}>Try again</Button>
    </main>
  }

  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}

export function AdminRoute() {
  const { user } = useAuth()
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />
}
