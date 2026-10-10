import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, DataTable, ErrorMessage, FormInput, SelectInput, StatusBadge, SuccessMessage } from '../components/ui'
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

export function AdminDashboardPage({ presets, navigate, onReview }) {
  const [pedalCount, setPedalCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)
  const [catalogError, setCatalogError] = useState('')
  const pending = presets.filter((preset) => preset.status === 'Submitted')
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      apiClient.get('/pedals', { params: { per_page: 1 }, signal: controller.signal }),
      apiClient.get('/categories', { signal: controller.signal }),
    ]).then(([pedalsResponse, categoriesResponse]) => {
      setPedalCount(pedalsResponse.data.meta.total)
      setCategoryCount(categoriesResponse.data.data.length)
    }).catch((error) => {
      if (!controller.signal.aborted) setCatalogError(error.response?.data?.message || 'Unable to load catalog summary.')
    })
    return () => controller.abort()
  }, [])

  return <AdminLayout><div className="section-heading"><div><span className="eyebrow">STUDIO CONTROL</span><h1>Admin dashboard</h1><p>Manage the live pedal catalog and category list.</p></div></div>{catalogError && <ErrorMessage>{catalogError}</ErrorMessage>}<div className="admin-stats"><Card className="admin-stat"><span>Pedals</span><b>{pedalCount}</b><small>Live catalog</small></Card><Card className="admin-stat"><span>Categories</span><b>{categoryCount}</b><small>Live catalog</small></Card><Card className="admin-stat"><span>Rig presets</span><b>{presets.length}</b><small>Preview catalog</small></Card><Card className="admin-stat"><span>Awaiting review</span><b>{pending.length}</b><small>Submitted presets</small></Card></div><div className="admin-manage-grid"><button className="admin-manage-card" onClick={() => navigate('/admin/pedals')}><b>Manage pedals</b><p>Create, edit, and remove pedals in the catalog.</p><span className="manage-bottom">Open pedals →</span></button><button className="admin-manage-card" onClick={() => navigate('/admin/categories')}><b>Manage categories</b><p>Organize effect categories in the catalog.</p><span className="manage-bottom">Open categories →</span></button><button className="admin-manage-card" onClick={() => navigate('/admin/rig-presets')}><b>Review rig presets</b><p>{pending.length} submissions waiting for review.</p><span className="manage-bottom">Open review queue →</span></button></div>{pending[0] && <Button onClick={() => onReview(pending[0])}>Review {pending[0].name}</Button>}</AdminLayout>
}

export function AdminRigPresetsPage({ presets, onReview }) {
  const columns = [{ key: 'name', label: 'Preset' }, { key: 'board', label: 'Pedalboard' }, { key: 'guitar', label: 'Guitar' }, { key: 'status', label: 'Status', render: (preset) => <StatusBadge tone={preset.color}>{preset.status}</StatusBadge> }, { key: 'actions', label: '', render: (preset) => <Button onClick={() => onReview(preset)}>View</Button> }]
  return <AdminLayout><div className="section-heading"><div><span className="eyebrow">REVIEW QUEUE</span><h1>Admin rig presets</h1><p>Sample presets are not persisted or submitted to a server.</p></div></div><Card className="admin-page-card"><DataTable columns={columns} rows={presets} emptyTitle="No presets" /></Card></AdminLayout>
}

export function LocalPreviewNotice({ children }) {
  return <p className="preview-disclaimer">{children}</p>
}

export function LibraryFilter({ category, categories, onChange }) {
  return <SelectInput label="Category" name="category" value={category} onChange={(event) => onChange(event.target.value)} options={[{ value: '', label: 'All categories' }, ...categories]} />
}
