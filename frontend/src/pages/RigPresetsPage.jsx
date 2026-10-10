import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  ConfirmModal,
  EmptyState,
  ErrorMessage,
  FormInput,
  LoadingSpinner,
  Pagination,
  SelectInput,
  StatusBadge,
  SuccessMessage,
} from '../components/ui'
import useAuth from '../hooks/useAuth'
import AdminLayout from '../layouts/AdminLayout'
import apiClient from '../services/apiClient'

const statusTone = { Draft: 'muted', Submitted: 'orange', Approved: 'green', Archived: 'purple' }
const defaultAmpSettings = { gain: '', bass: '', mid: '', treble: '' }

function messageFor(error, fallback) {
  return error.response?.data?.message || fallback
}

function validationErrors(error) {
  return Object.fromEntries(Object.entries(error.response?.data?.errors || {}).map(([key, messages]) => [key, messages[0]]))
}

function settingLabel(key) {
  return key.replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatAmpSettings(settings) {
  if (!settings || !Object.keys(settings).length) return 'No amp settings entered'
  return Object.entries(settings).map(([key, value]) => `${settingLabel(key)} ${value}`).join(' · ')
}

function SectionHeading({ eyebrow, title, description, action }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

export function RigPresetCard({ preset, onDelete, showOwner = false }) {
  return <Card className="preset-card rig-preset-card">
    <div className="preset-card-top"><div className="preset-icon">♫</div><StatusBadge tone={statusTone[preset.status] || 'muted'}>{preset.status}</StatusBadge></div>
    <h3>{preset.name}</h3>
    {showOwner && <p className="rig-preset-owner">By {preset.owner?.name || 'Unknown guitarist'}</p>}
    <p className="preset-board">{preset.pedalboard?.name || 'No pedalboard selected'}</p>
    <div className="preset-details">
      <div><span>Guitar</span><b>{preset.guitar || 'Not specified'}</b></div>
      <div><span>Tuning</span><b>{preset.tuning || 'Not specified'}</b></div>
      <div className="amp-detail"><span>Amp settings</span><b>{formatAmpSettings(preset.amp_settings)}</b></div>
    </div>
    <p className="rig-preset-description">{preset.description || 'No description added.'}</p>
    <div className="rig-preset-card-actions">
      <Link className="button button-secondary" to={showOwner ? `/admin/rig-presets/${preset.id}` : `/rig-presets/${preset.id}`}>View details</Link>
      {!showOwner && preset.status !== 'Archived' && <Link className="button button-secondary" to={`/rig-presets/${preset.id}/edit`}>Edit</Link>}
      {!showOwner && preset.status !== 'Archived' && <Button variant="danger" onClick={() => onDelete(preset)}>Delete</Button>}
    </div>
  </Card>
}

export function RigPresetForm({ preset, boards, isLoadingBoards, boardError, isSaving, errors, error, onRetryBoards, onSubmit, cancelTo }) {
  const originalSettings = preset?.amp_settings || {}
  const [values, setValues] = useState({
    name: preset?.name || '',
    pedalboard_id: preset?.pedalboard_id ? String(preset.pedalboard_id) : '',
    guitar: preset?.guitar || '',
    tuning: preset?.tuning || '',
    description: preset?.description || '',
  })
  const [settings, setSettings] = useState(() => ({ ...defaultAmpSettings, ...originalSettings }))
  const [newSetting, setNewSetting] = useState('')

  const update = (field, value) => setValues((current) => ({ ...current, [field]: value }))
  const save = (event) => {
    event.preventDefault()
    const ampSettings = Object.fromEntries(Object.entries(settings)
      .filter(([, value]) => value !== '')
      .map(([key, value]) => [key, value === '' ? value : Number.isNaN(Number(value)) ? value : Number(value)]))
    onSubmit({
      name: values.name.trim(),
      pedalboard_id: values.pedalboard_id ? Number(values.pedalboard_id) : null,
      guitar: values.guitar.trim() || null,
      tuning: values.tuning.trim() || null,
      description: values.description.trim() || null,
      amp_settings: Object.keys(ampSettings).length ? ampSettings : null,
    })
  }

  return <Card className="page-form-card rig-preset-form-card">
    <form className="form-stack rig-preset-form" onSubmit={save}>
      <FormInput name="preset-name" label="Preset name" placeholder="e.g. Glassy chorus clean" value={values.name} onChange={(event) => update('name', event.target.value)} error={errors.name} required maxLength={150} />
      <div className="rig-preset-form-grid">
        {isLoadingBoards ? <LoadingSpinner label="Loading your pedalboards…" /> : boardError ? <ErrorMessage onRetry={onRetryBoards}>{boardError}</ErrorMessage> : <SelectInput name="pedalboard_id" label="Pedalboard (optional)" value={values.pedalboard_id} onChange={(event) => update('pedalboard_id', event.target.value)} error={errors.pedalboard_id} options={[{ value: '', label: 'No pedalboard' }, ...boards.map((board) => ({ value: String(board.id), label: board.name }))]} />}
        <FormInput name="guitar" label="Guitar" placeholder="e.g. Fender Stratocaster" value={values.guitar} onChange={(event) => update('guitar', event.target.value)} error={errors.guitar} maxLength={100} />
        <FormInput name="tuning" label="Tuning" placeholder="e.g. E Standard" value={values.tuning} onChange={(event) => update('tuning', event.target.value)} error={errors.tuning} maxLength={50} />
      </div>
      {errors.pedalboard_id && !boardError && <span className="field-error">{errors.pedalboard_id}</span>}
      <fieldset className="amp-settings-fieldset"><legend>Amp settings</legend><div className="amp-settings-grid">{Object.entries(settings).map(([key, value]) => <FormInput key={key} label={settingLabel(key)} name={`amp-${key}`} value={value} onChange={(event) => setSettings((current) => ({ ...current, [key]: event.target.value }))} error={errors[`amp_settings.${key}`]} />)}</div>
        {errors.amp_settings && <span className="field-error">{errors.amp_settings}</span>}
        <div className="add-setting-row"><input aria-label="New amp setting name" value={newSetting} onChange={(event) => setNewSetting(event.target.value)} placeholder="Add setting (e.g. presence)" /><Button type="button" onClick={() => { const key = newSetting.trim().toLowerCase().replace(/\s+/g, '_'); if (key && !Object.hasOwn(settings, key)) setSettings((current) => ({ ...current, [key]: '' })); setNewSetting('') }}>Add setting</Button></div>
      </fieldset>
      <label className="field-label" htmlFor="preset-description">Description<textarea id="preset-description" rows="4" value={values.description} onChange={(event) => update('description', event.target.value)} placeholder="Describe the sound and how you use this rig…" />{errors.description && <span className="field-error">{errors.description}</span>}</label>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <div className="form-actions"><Link className="button button-secondary" to={cancelTo}>Cancel</Link><Button type="submit" variant="primary" disabled={isSaving || isLoadingBoards}>{isSaving ? 'Saving…' : preset ? 'Save changes' : 'Create draft'}</Button></div>
    </form>
  </Card>
}

function useBoards() {
  const { user } = useAuth()
  const [boards, setBoards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    apiClient.get('/pedalboards', { params: { page: 1 }, signal: controller.signal })
      .then(async ({ data }) => {
        const results = [...data.data]
        for (let page = 2; page <= data.meta.last_page; page += 1) {
          const response = await apiClient.get('/pedalboards', { params: { page }, signal: controller.signal })
          results.push(...response.data.data)
        }
        if (!controller.signal.aborted) {
          setBoards(results.filter((board) => board.user_id === user.id))
          setError('')
        }
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(messageFor(requestError, 'Unable to load your pedalboards.'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [retry, user.id])
  return { boards, isLoading, error, retry: () => { setIsLoading(true); setRetry((value) => value + 1) } }
}

export function RigPresetFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const [preset, setPreset] = useState(null)
  const [isLoadingPreset, setIsLoadingPreset] = useState(isEditing)
  const [loadError, setLoadError] = useState('')
  const [retry, setRetry] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const boards = useBoards()

  useEffect(() => {
    if (!id) return undefined
    const controller = new AbortController()
    apiClient.get(`/rig-presets/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        setPreset(data.data)
        setLoadError('')
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setLoadError(messageFor(requestError, 'Unable to load this rig preset.'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingPreset(false)
      })
    return () => controller.abort()
  }, [id, retry])

  const submit = async (payload) => {
    setIsSaving(true)
    setError('')
    setErrors({})
    try {
      const { data } = isEditing
        ? await apiClient.put(`/rig-presets/${id}`, payload)
        : await apiClient.post('/rig-presets', payload)
      navigate(`/rig-presets/${data.data.id}`, {
        replace: true,
        state: { success: isEditing ? 'Rig preset changes saved. Its status is now Draft and ready to resubmit.' : 'Rig preset draft created.' },
      })
    } catch (requestError) {
      setErrors(validationErrors(requestError))
      setError(messageFor(requestError, 'Unable to save this rig preset. Please try again.'))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingPreset) return <LoadingSpinner label="Loading rig preset…" />
  if (loadError) return <ErrorMessage onRetry={() => { setIsLoadingPreset(true); setRetry((value) => value + 1) }}>{loadError}</ErrorMessage>
  if (isEditing && !preset) return <EmptyState title="Rig preset not found" message="This preset is not available to your account." action={<Link to="/rig-presets">Back to rig presets</Link>} />
  if (preset?.status === 'Archived') return <EmptyState title="Archived presets cannot be edited" message="Archived rig presets are read-only." action={<Link to={`/rig-presets/${id}`}>View preset</Link>} />

  return <>
    <SectionHeading eyebrow="TONE RECIPES" title={isEditing ? 'Edit rig preset' : 'Create rig preset'} description={isEditing && preset.status !== 'Draft' ? 'Saving edits returns this preset to Draft so it can be submitted again.' : 'Capture your guitar, tuning, amp, and signal chain.'} />
    {errors.pedalboard_id && <ErrorMessage>{errors.pedalboard_id}</ErrorMessage>}
    <RigPresetForm key={preset?.id || 'new-preset'} preset={preset} boards={boards.boards} isLoadingBoards={boards.isLoading} boardError={boards.error} onRetryBoards={boards.retry} isSaving={isSaving} errors={errors} error={error} onSubmit={submit} cancelTo={isEditing ? `/rig-presets/${id}` : '/rig-presets'} />
  </>
}

export function ApprovalActions({ preset, canApprove, isWorking, error, onApprove, onArchive }) {
  return <div className="approval-actions">
    {preset.status === 'Submitted' && canApprove && <Button variant="primary" disabled={isWorking} onClick={onApprove}>{isWorking ? 'Saving…' : 'Approve preset'}</Button>}
    {preset.status === 'Submitted' && !canApprove && <span className="muted">An administrator cannot approve their own preset.</span>}
    {preset.status !== 'Archived' && <Button variant="secondary" disabled={isWorking} onClick={onArchive}>{isWorking ? 'Saving…' : 'Archive preset'}</Button>}
    {error && <ErrorMessage>{error}</ErrorMessage>}
  </div>
}

export function RigPresetDetails({ preset, isAdmin = false, canApprove = true, isWorking, actionError, onSubmit, onDelete, onApprove, onArchive, deletePreset, isDeleting, deleteError }) {
  const tone = statusTone[preset.status] || 'muted'
  return <>
    <SectionHeading eyebrow={isAdmin ? 'PRESET REVIEW' : 'TONE RECIPE'} title={preset.name} description={preset.description || 'A saved guitar rig and amp recipe.'} action={<StatusBadge tone={tone}>{preset.status}</StatusBadge>} />
    <Card className="rig-preset-details-card">
      <div className="preset-details rig-preset-detail-grid">
        <div><span>Pedalboard</span><b>{preset.pedalboard?.name || 'No pedalboard selected'}</b></div>
        {isAdmin && <div><span>Owner</span><b>{preset.owner?.name || 'Unknown guitarist'}</b></div>}
        <div><span>Guitar</span><b>{preset.guitar || 'Not specified'}</b></div>
        <div><span>Tuning</span><b>{preset.tuning || 'Not specified'}</b></div>
        <div className="amp-detail"><span>Amp settings</span><b>{formatAmpSettings(preset.amp_settings)}</b></div>
        {preset.pedalboard?.description && <div className="amp-detail"><span>Pedalboard description</span><b>{preset.pedalboard.description}</b></div>}
      </div>
    </Card>
    <div className="rig-preset-detail-actions">
      {isAdmin
        ? <ApprovalActions preset={preset} canApprove={canApprove} isWorking={isWorking} error={actionError} onApprove={onApprove} onArchive={onArchive} />
        : <>
          {preset.status === 'Draft' && <Button variant="primary" disabled={isWorking} onClick={onSubmit}>{isWorking ? 'Submitting…' : 'Submit for approval'}</Button>}
          {preset.status !== 'Archived' && <Link className="button button-secondary" to={`/rig-presets/${preset.id}/edit`}>Edit preset</Link>}
          {preset.status !== 'Archived' && <Button variant="danger" onClick={onDelete}>Delete preset</Button>}
          {actionError && <ErrorMessage>{actionError}</ErrorMessage>}
        </>}
      <Link className="button button-secondary" to={isAdmin ? '/admin/rig-presets' : '/rig-presets'}>{isAdmin ? 'Back to review queue' : 'Back to my presets'}</Link>
    </div>
    {deletePreset && <ConfirmModal title="Delete rig preset?" message={`“${preset.name}” will be permanently deleted.`} confirmLabel="Delete preset" onConfirm={deletePreset} onClose={() => { if (!isDeleting) onDelete(null) }} error={deleteError} isLoading={isDeleting} />}
  </>
}

function useRigPreset(id) {
  const [preset, setPreset] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryIndex, setRetryIndex] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    apiClient.get(`/rig-presets/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        setPreset(data.data)
        setError('')
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(messageFor(requestError, 'Unable to load this rig preset.'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [id, retryIndex])
  const retry = () => { setIsLoading(true); setRetryIndex((value) => value + 1) }
  return { preset, setPreset, isLoading, error, retry }
}

function PresetDetailsPage({ admin = false }) {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { preset, setPreset, isLoading, error, retry } = useRigPreset(id)
  const [isWorking, setIsWorking] = useState(false)
  const [actionError, setActionError] = useState('')
  const [success, setSuccess] = useState(location.state?.success || '')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const updateStatus = async (action, successMessage) => {
    setIsWorking(true)
    setActionError('')
    setSuccess('')
    try {
      const { data } = await apiClient.post(`/rig-presets/${id}/${action}`)
      setPreset(data.data)
      setSuccess(successMessage)
    } catch (requestError) {
      setActionError(messageFor(requestError, `Unable to ${action} this rig preset.`))
    } finally {
      setIsWorking(false)
    }
  }
  const deletePreset = async () => {
    setIsDeleting(true)
    setDeleteError('')
    try {
      await apiClient.delete(`/rig-presets/${id}`)
      navigate('/rig-presets', { replace: true, state: { success: `${preset.name} deleted.` } })
    } catch (requestError) {
      setDeleteError(messageFor(requestError, 'Unable to delete this rig preset.'))
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) return <LoadingSpinner label="Loading rig preset…" />
  if (error) return <ErrorMessage onRetry={retry}>{error}</ErrorMessage>
  if (!preset) return <EmptyState title="Rig preset not found" message="This preset is not available." action={<Link to={admin ? '/admin/rig-presets' : '/rig-presets'}>Back to rig presets</Link>} />
  if (!admin && user.id !== preset.user_id) return <EmptyState title="Rig preset not found" message="This preset is not available to your account." action={<Link to="/rig-presets">Back to my presets</Link>} />

  return <>
    {success && <SuccessMessage>{success}</SuccessMessage>}
    <RigPresetDetails
      preset={preset}
      isAdmin={admin}
      canApprove={user.id !== preset.user_id}
      isWorking={isWorking}
      actionError={actionError}
      onSubmit={() => updateStatus('submit', 'Rig preset submitted for approval.')}
      onApprove={() => updateStatus('approve', 'Rig preset approved.')}
      onArchive={() => updateStatus('archive', 'Rig preset archived.')}
      onDelete={(open) => { setDeleteError(''); setDeleteOpen(open === null ? false : true) }}
      deletePreset={deleteOpen ? deletePreset : null}
      isDeleting={isDeleting}
      deleteError={deleteError}
    />
  </>
}

export function RigPresetDetailsPage() {
  return <PresetDetailsPage />
}

export function AdminRigPresetDetailsPage() {
  return <PresetDetailsPage admin />
}

function RigPresetsCollection({ admin }) {
  const { user } = useAuth()
  const location = useLocation()
  const [presets, setPresets] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryIndex, setRetryIndex] = useState(0)
  const [deletingPreset, setDeletingPreset] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [success, setSuccess] = useState(location.state?.success || '')

  useEffect(() => {
    const controller = new AbortController()
    apiClient.get('/rig-presets', { params: { page: 1 }, signal: controller.signal })
      .then(async ({ data }) => {
        const results = [...data.data]
        for (let nextPage = 2; nextPage <= data.meta.last_page; nextPage += 1) {
          const response = await apiClient.get('/rig-presets', { params: { page: nextPage }, signal: controller.signal })
          results.push(...response.data.data)
        }
        if (controller.signal.aborted) return
        const owned = results.filter((preset) => preset.user_id === user.id)
        const visible = admin ? results.filter((preset) => preset.status === 'Submitted') : owned
        const pageSize = 12
        const filteredPageCount = Math.max(1, Math.ceil(visible.length / pageSize))
        const currentPage = Math.min(page, filteredPageCount)
        setPage(currentPage)
        setPresets(visible.slice((currentPage - 1) * pageSize, currentPage * pageSize))
        setLastPage(filteredPageCount)
        setError('')
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(messageFor(requestError, 'Unable to load rig presets.'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [admin, page, retryIndex, user.id])

  const deletePreset = async () => {
    setIsDeleting(true)
    setDeleteError('')
    try {
      await apiClient.delete(`/rig-presets/${deletingPreset.id}`)
      setSuccess(`${deletingPreset.name} deleted.`)
      setDeletingPreset(null)
      setIsLoading(true)
      setRetryIndex((value) => value + 1)
    } catch (requestError) {
      setDeleteError(messageFor(requestError, 'Unable to delete this rig preset.'))
    } finally {
      setIsDeleting(false)
    }
  }

  const title = admin ? 'Submitted rig presets' : 'My rig presets'
  const subtitle = admin ? 'Review presets submitted by guitarists.' : 'Your saved guitar, tuning, amp, and board recipes.'
  const filteredCount = presets.length

  return <>
    <SectionHeading eyebrow={admin ? 'ADMIN REVIEW' : 'TONE RECIPES'} title={title} description={subtitle} action={!admin && <Link className="button button-primary" to="/rig-presets/create">+ New preset</Link>} />
    {success && <SuccessMessage>{success}</SuccessMessage>}
    {error ? <ErrorMessage onRetry={() => { setIsLoading(true); setRetryIndex((value) => value + 1) }}>{error}</ErrorMessage>
      : isLoading ? <LoadingSpinner label="Loading rig presets…" />
        : presets.length ? admin
          ? <Card className="review-table-card rig-review-table"><div className="card-heading"><div><span className="eyebrow">REVIEW QUEUE</span><h2>Awaiting approval</h2></div><span className="table-count">{filteredCount} on this page</span></div><div className="table-wrap"><table><thead><tr><th>PRESET</th><th>OWNER</th><th>PEDALBOARD</th><th>GUITAR</th><th>TUNING</th><th>STATUS</th><th /></tr></thead><tbody>{presets.map((preset) => <tr key={preset.id}><td><b>{preset.name}</b></td><td>{preset.owner?.name || '—'}</td><td>{preset.pedalboard?.name || '—'}</td><td>{preset.guitar || '—'}</td><td>{preset.tuning || '—'}</td><td><StatusBadge tone={statusTone[preset.status]}>{preset.status}</StatusBadge></td><td><Link className="button button-secondary" to={`/admin/rig-presets/${preset.id}`}>Review</Link></td></tr>)}</tbody></table></div></Card>
          : <div className="preset-grid">{presets.map((preset) => <RigPresetCard key={preset.id} preset={preset} onDelete={setDeletingPreset} />)}</div>
          : <EmptyState title={admin ? 'No presets awaiting approval' : 'No rig presets yet'} message={admin ? 'Submitted user presets will appear here.' : 'Create a draft to save a tone recipe for your rig.'} action={!admin && <Link className="button button-primary" to="/rig-presets/create">Create your first preset</Link>} />}
    {!isLoading && !error && presets.length > 0 && <Pagination page={page} totalPages={lastPage} onPageChange={(nextPage) => { setIsLoading(true); setPage(nextPage) }} />}
    {deletingPreset && <ConfirmModal title="Delete rig preset?" message={`“${deletingPreset.name}” will be permanently deleted.`} confirmLabel="Delete preset" onConfirm={deletePreset} onClose={() => { if (!isDeleting) { setDeletingPreset(null); setDeleteError('') } }} error={deleteError} isLoading={isDeleting} />}
    {admin && <span className="sr-only">Signed in as {user.name}; administrator review controls are available.</span>}
  </>
}

export function RigPresetsPage() {
  return <RigPresetsCollection admin={false} />
}

export function AdminRigPresetsPage() {
  return <AdminLayout><RigPresetsCollection admin /></AdminLayout>
}
