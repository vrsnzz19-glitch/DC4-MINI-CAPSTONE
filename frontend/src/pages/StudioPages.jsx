import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, DataTable, EmptyState, ErrorMessage, FormInput, SearchBar, SelectInput, StatusBadge, SuccessMessage } from '../components/ui'
import useAuth from '../hooks/useAuth'
import AdminLayout from '../layouts/AdminLayout'
import PublicLayout from '../layouts/PublicLayout'

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

export function PedalDetailsPage({ pedal, onAdd }) {
  if (!pedal) return <EmptyState title="Pedal not found" message="This pedal is not in the current preview catalog." action={<Link className="text-link" to="/pedals">Back to the library</Link>} />
  return <><div className="section-heading"><div><span className="eyebrow">PEDAL DETAILS</span><h1>{pedal.name}</h1><p>{pedal.brand} · {pedal.type}</p></div><Button variant="primary" onClick={() => onAdd(pedal)}>Add to builder</Button></div><Card className="detail-page-card"><div className={`pedal-visual pedal-${pedal.color}`}><span className="pedal-brand">{pedal.brand}</span><span className="pedal-face">{pedal.initials}</span><span className="pedal-led" /><span className="pedal-footswitch" /></div><div><StatusBadge tone="green">{pedal.status}</StatusBadge><h2>{pedal.category}</h2><p>{pedal.type} effect by {pedal.brand}. Details are drawn from the in-memory catalog preview.</p><Link className="text-link" to="/pedals">← Back to pedal library</Link></div></Card></>
}

export function CreatePedalboardPage({ onCreate }) {
  return <><div className="section-heading"><div><span className="eyebrow">YOUR BUILDS</span><h1>Create pedalboard</h1><p>Start a new signal chain in your local preview.</p></div></div><Card className="page-form-card"><form className="form-stack" onSubmit={(event) => { event.preventDefault(); onCreate(new FormData(event.currentTarget).get('name'), new FormData(event.currentTarget).get('description')) }}><FormInput name="name" label="Board name" placeholder="e.g. Sunday Session Board" required maxLength={80} /><label className="field-label">Description<textarea name="description" rows="4" maxLength={300} placeholder="What sound are you building toward?" /></label><div className="form-actions"><Link className="button button-secondary" to="/pedalboards">Cancel</Link><Button type="submit" variant="primary">Create board</Button></div></form></Card></>
}

export function PedalboardDetailsPage({ board, onEdit }) {
  if (!board) return <EmptyState title="Pedalboard not found" message="This board is not available in the current preview." action={<Link className="text-link" to="/pedalboards">Back to pedalboards</Link>} />
  return <><div className="section-heading"><div><span className="eyebrow">PEDALBOARD DETAILS</span><h1>{board.name}</h1><p>{board.count} pedals · Updated {board.updated}</p></div><Button variant="primary" onClick={() => onEdit(board)}>Open builder</Button></div><Card className="board-detail-card"><div className={`board-art art-${board.style}`}><span className="art-label">SIGNAL CHAIN</span><div className="art-pedals"><i /><i /><i /><i /><i /></div><div className="art-cable" /></div><div className="board-detail-body"><StatusBadge tone="green">Local preview</StatusBadge><p>This pedalboard is sample content for the ToneVault preview. Changes are kept in this browser session only.</p><Link className="text-link" to="/pedalboards">← All pedalboards</Link></div></Card></>
}

export function AdminDashboardPage({ pedals, presets, navigate, onReview }) {
  const pending = presets.filter((preset) => preset.status === 'Submitted')
  return <AdminLayout><div className="section-heading"><div><span className="eyebrow">STUDIO CONTROL</span><h1>Admin dashboard</h1><p>Catalog and preset review in the local preview.</p></div></div><div className="admin-stats"><Card className="admin-stat"><span>Pedals</span><b>{pedals.length}</b><small>Preview catalog</small></Card><Card className="admin-stat"><span>Categories</span><b>{new Set(pedals.map((pedal) => pedal.category)).size}</b><small>Preview catalog</small></Card><Card className="admin-stat"><span>Rig presets</span><b>{presets.length}</b><small>Preview catalog</small></Card><Card className="admin-stat"><span>Awaiting review</span><b>{pending.length}</b><small>Submitted presets</small></Card></div><div className="admin-manage-grid"><button className="admin-manage-card" onClick={() => navigate('/admin/pedals')}><b>Manage pedals</b><p>Browse the current sample catalog.</p><span className="manage-bottom">Open pedals →</span></button><button className="admin-manage-card" onClick={() => navigate('/admin/categories')}><b>Manage categories</b><p>Review category families in the catalog.</p><span className="manage-bottom">Open categories →</span></button><button className="admin-manage-card" onClick={() => navigate('/admin/rig-presets')}><b>Review rig presets</b><p>{pending.length} submissions waiting for review.</p><span className="manage-bottom">Open review queue →</span></button></div>{pending[0] && <Button onClick={() => onReview(pending[0])}>Review {pending[0].name}</Button>}</AdminLayout>
}

export function AdminPedalsPage({ pedals }) {
  const [query, setQuery] = useState('')
  const rows = pedals.filter((pedal) => `${pedal.name} ${pedal.brand} ${pedal.category}`.toLowerCase().includes(query.toLowerCase()))
  const columns = [{ key: 'name', label: 'Pedal' }, { key: 'brand', label: 'Brand' }, { key: 'category', label: 'Category' }, { key: 'status', label: 'Status', render: (row) => <StatusBadge tone="green">{row.status}</StatusBadge> }]
  return <AdminLayout><div className="section-heading"><div><span className="eyebrow">CATALOG</span><h1>Admin pedals</h1><p>Read-only catalog preview. Live changes are not enabled.</p></div></div><Card className="admin-page-card"><SearchBar value={query} onChange={setQuery} placeholder="Search pedals..." /><DataTable columns={columns} rows={rows} emptyTitle="No pedals found" emptyMessage="Try another search." /></Card></AdminLayout>
}

export function AdminCategoriesPage({ pedals }) {
  const categories = [...new Set(pedals.map((pedal) => pedal.category))].sort().map((name) => ({ name, count: pedals.filter((pedal) => pedal.category === name).length }))
  const columns = [{ key: 'name', label: 'Category' }, { key: 'count', label: 'Pedals' }, { key: 'availability', label: 'Source', render: () => <StatusBadge tone="muted">Sample data</StatusBadge> }]
  return <AdminLayout><div className="section-heading"><div><span className="eyebrow">CATALOG ORGANIZATION</span><h1>Admin categories</h1><p>Category counts are calculated from the local catalog preview.</p></div></div><Card className="admin-page-card"><DataTable columns={columns} rows={categories} rowKey="name" /></Card></AdminLayout>
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
