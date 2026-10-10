import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, ErrorMessage, FormInput, LoadingSpinner, SelectInput, SuccessMessage } from '../components/ui'
import useAuth from '../hooks/useAuth'
import AdminLayout from '../layouts/AdminLayout'
import PublicLayout from '../layouts/PublicLayout'
import apiClient from '../services/apiClient'

function AuthPage({ register = false }) {
  const navigate = useNavigate()
  const { login, register: createAccount } = useAuth()
  const [values, setValues] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: undefined }))
    setMessage('')
  }

  const submit = async (event) => {
    event.preventDefault()
    setMessage('')
    setSuccess('')
    setFieldErrors({})

    const errors = {}
    if (register && !values.name.trim()) errors.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.'
    if (!values.password) errors.password = 'Please enter your password.'
    else if (register && values.password.length < 8) errors.password = 'Use at least 8 characters.'
    if (register && values.password !== values.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match.'
    }

    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      const response = register
        ? await createAccount({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
          password_confirmation: values.password_confirmation,
        })
        : await login({ email: values.email.trim(), password: values.password })
      setSuccess(response.message || (register ? 'Your account is ready.' : 'Welcome back.'))
      window.setTimeout(() => navigate(response.user.role === 'admin' ? '/admin' : '/', { replace: true }), 700)
    } catch (error) {
      if (error.response?.status === 422) {
        const serverErrors = error.response.data.errors || {}
        setFieldErrors(Object.fromEntries(Object.entries(serverErrors).map(([key, messages]) => [key, messages[0]])))
        setMessage(error.response.data.message || 'Please check the highlighted fields.')
      } else {
        setMessage(error.response?.data?.message || 'Unable to connect to ToneVault. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  return <PublicLayout title={register ? 'Make room for a new sound.' : 'Welcome back to your studio.'}>
    <div className="auth-card"><span className="eyebrow">{register ? 'START YOUR STUDIO' : 'YOUR STUDIO AWAITS'}</span><h2>{register ? 'Create an account' : 'Sign in'}</h2><p>{register ? 'Keep your boards and tone recipes together.' : 'Pick up where your next great tone begins.'}</p>
      <form className="form-stack auth-form" onSubmit={submit} noValidate>
        {register && <FormInput name="name" label="Name" placeholder="Your name" autoComplete="name" value={values.name} onChange={updateField} error={fieldErrors.name} required />}
        <FormInput name="email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" value={values.email} onChange={updateField} error={fieldErrors.email} required />
        <FormInput name="password" label="Password" type="password" placeholder={register ? 'At least 8 characters' : 'Your password'} autoComplete={register ? 'new-password' : 'current-password'} value={values.password} onChange={updateField} error={fieldErrors.password} required minLength={register ? 8 : undefined} />
        {register && <FormInput name="password_confirmation" label="Confirm password" type="password" placeholder="Enter your password again" autoComplete="new-password" value={values.password_confirmation} onChange={updateField} error={fieldErrors.password_confirmation} required />}
        {message && <ErrorMessage>{message}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Please wait...' : register ? 'Create account' : 'Sign in'}</Button>
      </form>
      <p className="auth-switch">{register ? 'Already have an account?' : 'New to ToneVault?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</Link></p>
      <button className="auth-back" onClick={() => navigate('/')}>Back to the preview</button>
    </div>
  </PublicLayout>
}

export function LoginPage() { return <AuthPage /> }
export function RegisterPage() { return <AuthPage register /> }

export function AdminDashboardPage({ navigate }) {
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState('')
  const [statsRetry, setStatsRetry] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    apiClient.get('/dashboard', { signal: controller.signal })
      .then((response) => {
        setStats(response.data.data)
        setStatsError('')
      })
      .catch((error) => {
        if (!controller.signal.aborted) setStatsError(error.response?.data?.message || 'Unable to load dashboard statistics.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setStatsLoading(false)
      })
    return () => controller.abort()
  }, [statsRetry])

  const pendingCount = stats?.submitted_rig_presets

  return <AdminLayout><div className="section-heading"><div><span className="eyebrow">STUDIO CONTROL</span><h1>Admin dashboard</h1><p>Manage the live pedal catalog and review submitted rig presets.</p></div></div>{statsError && <ErrorMessage onRetry={() => { setStatsLoading(true); setStatsRetry((value) => value + 1) }}>{statsError}</ErrorMessage>}{statsLoading && <LoadingSpinner label="Loading dashboard statistics..." />}<div className="admin-stats"><Card className="admin-stat"><span>Total pedals</span><b>{statsLoading ? '—' : stats?.total_pedals ?? '—'}</b><small>Live catalog</small></Card><Card className="admin-stat"><span>Total pedalboards</span><b>{statsLoading ? '—' : stats?.total_pedalboards ?? '—'}</b><small>Across all users</small></Card><Card className="admin-stat"><span>Total rig presets</span><b>{statsLoading ? '—' : stats?.total_rig_presets ?? '—'}</b><small>Across all users</small></Card><Card className="admin-stat"><span>Awaiting review</span><b>{statsLoading ? '—' : pendingCount ?? '—'}</b><small>Submitted presets</small></Card></div><div className="admin-manage-grid"><button className="admin-manage-card" onClick={() => navigate('/admin/pedals')}><b>Manage pedals</b><p>Create, edit, and remove pedals in the catalog.</p><span className="manage-bottom">Open pedals →</span></button><button className="admin-manage-card" onClick={() => navigate('/admin/categories')}><b>Manage categories</b><p>Organize effect categories in the catalog.</p><span className="manage-bottom">Open categories →</span></button><button className="admin-manage-card" onClick={() => navigate('/admin/rig-presets')}><b>Review rig presets</b><p>{statsLoading ? 'Loading review queue...' : `${pendingCount ?? 0} submissions waiting for review.`}</p><span className="manage-bottom">Open review queue →</span></button></div></AdminLayout>
}

export function LocalPreviewNotice({ children }) {
  return <p className="preview-disclaimer">{children}</p>
}

export function LibraryFilter({ category, categories, onChange }) {
  return <SelectInput label="Category" name="category" value={category} onChange={(event) => onChange(event.target.value)} options={[{ value: '', label: 'All categories' }, ...categories]} />
}
