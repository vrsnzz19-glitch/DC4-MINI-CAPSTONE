import { useEffect, useMemo, useState } from 'react'
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
  SearchBar,
  SuccessMessage,
} from '../components/ui'
import apiClient from '../services/apiClient'

const pedalColors = ['orange', 'green', 'red', 'blue', 'silver', 'black', 'yellow']
const defaultSettings = { Level: 50, Tone: 50, Mix: 50 }

function errorMessage(error, fallback) {
  return error.response?.data?.message || fallback
}

function initials(pedal) {
  return (pedal.model || pedal.name || 'FX').replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase()
}

function pedalColor(pedal) {
  const hash = Array.from(`${pedal.brand}${pedal.name}`).reduce((total, character) => total + character.charCodeAt(0), 0)
  return pedalColors[hash % pedalColors.length]
}

function formatDate(value) {
  if (!value) return 'Just now'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function SectionHeading({ eyebrow, title, description, action }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

export function PedalboardCard({ board, onDelete }) {
  const pedals = board.pedals || []
  return <Card className="board-card pedalboard-card">
    <div className="board-art art-clean">
      <span className="art-label">SIGNAL CHAIN</span>
      <div className="art-pedals">{Array.from({ length: Math.min(pedals.length, 6) }, (_, index) => <i key={pedals[index]?.id || index} />)}</div>
      <div className="art-cable" />
      {!pedals.length && <span className="board-art-empty">Ready for your first pedal</span>}
    </div>
    <div className="board-card-body">
      <div className="board-card-title"><div><h3>{board.name}</h3><span className="muted-small">{pedals.length} {pedals.length === 1 ? 'pedal' : 'pedals'} · {board.owner?.name || 'Your board'}</span></div></div>
      {board.description && <p className="pedalboard-description">{board.description}</p>}
      <div className="board-meta"><span>Updated {formatDate(board.updated_at)}</span><div>
        <Button onClick={() => onDelete(board)}>Delete</Button>
        <Link className="button button-secondary" to={`/pedalboards/${board.id}/edit`}>Edit</Link>
        <Link className="button button-primary" to={`/pedalboards/${board.id}`}>View board</Link>
      </div></div>
    </div>
  </Card>
}

export function PedalboardsPage() {
  const [boards, setBoards] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [deletingBoard, setDeletingBoard] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    apiClient.get('/pedalboards', { params: { page }, signal: controller.signal })
      .then((response) => {
        setBoards(response.data.data)
        setLastPage(response.data.meta.last_page)
        setError('')
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(errorMessage(requestError, 'Unable to load your pedalboards.'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [page, retry])

  const visibleBoards = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return query ? boards.filter((board) => `${board.name} ${board.description || ''}`.toLocaleLowerCase().includes(query)) : boards
  }, [boards, search])

  const changePage = (nextPage) => {
    setIsLoading(true)
    setPage(nextPage)
  }

  const retryLoading = () => {
    setIsLoading(true)
    setRetry((value) => value + 1)
  }

  const deleteBoard = async () => {
    setIsDeleting(true)
    setDeleteError('')
    try {
      await apiClient.delete(`/pedalboards/${deletingBoard.id}`)
      setDeletingBoard(null)
      setSuccess(`${deletingBoard.name} was deleted.`)
      setIsLoading(true)
      if (boards.length === 1 && page > 1) setPage((current) => current - 1)
      else setRetry((value) => value + 1)
    } catch (requestError) {
      setDeleteError(errorMessage(requestError, 'Unable to delete this pedalboard.'))
    } finally {
      setIsDeleting(false)
    }
  }

  return <>
    <SectionHeading eyebrow="YOUR BUILDS" title="My pedalboards" description="Every signal chain, ready to shape and play." action={<Link className="button button-primary" to="/pedalboards/create">+ New pedalboard</Link>} />
    <div className="pedalboards-tools"><SearchBar value={search} onChange={setSearch} placeholder="Find a pedalboard..." /><span>{isLoading ? 'Loading boards…' : `${visibleBoards.length} on this page`}</span></div>
    {success && <SuccessMessage>{success}</SuccessMessage>}
    {error ? <ErrorMessage onRetry={retryLoading}>{error}</ErrorMessage>
      : isLoading ? <LoadingSpinner label="Loading your pedalboards…" />
        : visibleBoards.length ? <><div className="board-grid">{visibleBoards.map((board) => <PedalboardCard key={board.id} board={board} onDelete={setDeletingBoard} />)}</div><Pagination page={page} totalPages={lastPage} onPageChange={changePage} /></>
          : <EmptyState title={search ? 'No matching pedalboards' : 'Your first board starts here'} message={search ? 'Try another search term.' : 'Create a board, add pedals, and save your signal chain.'} action={search ? undefined : <Link className="button button-primary" to="/pedalboards/create">Create pedalboard</Link>} />}
    {deletingBoard && <ConfirmModal title="Delete pedalboard?" message={`“${deletingBoard.name}” and its saved pedal chain will be permanently deleted.`} confirmLabel="Delete pedalboard" onConfirm={deleteBoard} onClose={() => { if (!isDeleting) { setDeletingBoard(null); setDeleteError('') } }} error={deleteError} isLoading={isDeleting} />}
  </>
}

export function PedalboardFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const [values, setValues] = useState({ name: '', description: '' })
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    if (!id) return undefined
    const controller = new AbortController()
    apiClient.get(`/pedalboards/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        setValues({ name: data.data.name, description: data.data.description || '' })
        setLoadError('')
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setLoadError(errorMessage(requestError, 'Unable to load this pedalboard.'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [id, retry])

  if (isEditing && loadError && !isLoading) return <><ErrorMessage onRetry={() => { setIsLoading(true); setRetry((value) => value + 1) }}>{loadError}</ErrorMessage><Link className="text-link" to="/pedalboards">← My pedalboards</Link></>
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldError('')
    setIsSaving(true)
    try {
      const payload = { name: values.name.trim(), description: values.description.trim() || null }
      const response = isEditing
        ? await apiClient.put(`/pedalboards/${id}`, payload)
        : await apiClient.post('/pedalboards', payload)
      navigate(`/pedalboards/${response.data.data.id}`, {
        replace: true,
        state: { success: `Pedalboard ${isEditing ? 'updated' : 'created'} successfully.` },
      })
    } catch (requestError) {
      const validationError = requestError.response?.data?.errors?.name?.[0]
      if (validationError) setFieldError(validationError)
      setError(errorMessage(requestError, `Unable to ${isEditing ? 'update' : 'create'} this pedalboard.`))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <LoadingSpinner label="Loading pedalboard…" />
  return <>
    <SectionHeading eyebrow="YOUR BUILDS" title={isEditing ? 'Edit pedalboard' : 'Create pedalboard'} description={isEditing ? 'Update the name and notes for this board.' : 'Give your next signal chain a name.'} />
    {error && <ErrorMessage>{error}</ErrorMessage>}
    <Card className="page-form-card"><form className="form-stack" onSubmit={submit}>
      <FormInput name="name" label="Board name" placeholder="e.g. Sunday Session Board" value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} error={fieldError} required maxLength={150} />
      <label className="field-label" htmlFor="board-description">Description<textarea id="board-description" rows="4" maxLength={2000} placeholder="What sound are you building toward?" value={values.description} onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))} /></label>
      <div className="form-actions"><Link className="button button-secondary" to={isEditing ? `/pedalboards/${id}` : '/pedalboards'}>Cancel</Link><Button type="submit" variant="primary" disabled={isSaving}>{isSaving ? 'Saving…' : isEditing ? 'Save changes' : 'Create board'}</Button></div>
    </form></Card>
  </>
}

export function PedalChainItem({ pedal, index, count, onMove, onRemove, onSettings, readOnly = false }) {
  return <div className="chain-step">
    {!readOnly && <span className="chain-wire" />}
    <div className="chain-pedal">
      <div className={`mini-pedal pedal-${pedalColor(pedal)} ${readOnly ? '' : 'pedal-active'}`}><span>{initials(pedal)}</span><i /></div>
      <div className="chain-info"><strong>{pedal.name}</strong><span>{pedal.brand} · {pedal.type || pedal.category?.name || 'Effect'}</span></div>
      {pedal.pivot?.notes && <p className="chain-note">{pedal.pivot.notes}</p>}
      {!readOnly && <div className="chain-actions">
        <button type="button" aria-label={`Move ${pedal.name} up`} disabled={index === 0} onClick={() => onMove(pedal, index - 1)}><span aria-hidden="true">↑</span></button>
        <button type="button" aria-label={`Move ${pedal.name} down`} disabled={index === count - 1} onClick={() => onMove(pedal, index + 1)}><span aria-hidden="true">↓</span></button>
        <button type="button" aria-label={`Edit ${pedal.name} settings`} onClick={() => onSettings(pedal)}>⚙</button>
        <button type="button" aria-label={`Remove ${pedal.name}`} onClick={() => onRemove(pedal)}>×</button>
      </div>}
    </div>
    {!readOnly && <span className="chain-wire" />}
  </div>
}

export function SignalChain({ pedals, onMove, onRemove, onSettings, readOnly = false }) {
  return <div className={`signal-chain ${readOnly ? 'signal-chain-readonly' : ''}`}>
    <div className="chain-end"><span className="end-icon">♬</span><b>Guitar</b><small>Input</small></div>
    {pedals.map((pedal, index) => <PedalChainItem key={pedal.id} pedal={pedal} index={index} count={pedals.length} onMove={onMove} onRemove={onRemove} onSettings={onSettings} readOnly={readOnly} />)}
    {!readOnly && !pedals.length && <div className="chain-empty">Your board is ready for its first effect.<br /><span>Tuner → Compressor → Overdrive → Distortion → Delay → Reverb</span></div>}
    <div className="chain-end amp-end"><span className="amp-stack"><i /><i /></span><b>Amplifier</b><small>Output</small></div>
  </div>
}

export function PedalSelector({ pedals, selectedIds, isLoading, error, page, totalPages, search, onSearch, onPageChange, onRetry, onAdd, onClose }) {
  const available = pedals.filter((pedal) => !selectedIds.has(pedal.id))
  return <div className="modal-backdrop pedal-selector-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="modal modal-wide pedal-selector" role="dialog" aria-modal="true" aria-label="Add a pedal">
      <div className="modal-header"><div><span className="eyebrow">PEDAL CATALOG</span><h2>Add a pedal</h2></div><Button className="icon-button" onClick={onClose} aria-label="Close pedal selector">×</Button></div>
      <div className="pedal-selector-content"><SearchBar value={search} onChange={onSearch} placeholder="Search name, brand, or model…" />
        {error ? <ErrorMessage onRetry={onRetry}>{error}</ErrorMessage> : isLoading ? <LoadingSpinner label="Loading pedals…" />
          : available.length ? <div className="add-pedal-grid">{available.map((pedal) => <button key={pedal.id} type="button" className="add-pedal-option" onClick={() => onAdd(pedal)}><span className={`mini-pedal pedal-${pedalColor(pedal)}`}><span>{initials(pedal)}</span><i /></span><span><b>{pedal.name}</b><small>{pedal.brand} · {pedal.type || pedal.category?.name || 'Effect'}</small></span><span aria-hidden="true">＋</span></button>)}</div>
            : <EmptyState title={search ? 'No pedals found' : 'No pedals available'} message={search ? 'Try a different search.' : 'The catalog has no pedals ready to add.'} />}
        {!error && !isLoading && <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />}
      </div>
    </section>
  </div>
}

export function PedalSettingsPanel({ pedal, isSaving, error, onSave, onClose }) {
  const existingSettings = pedal.pivot?.settings || {}
  const initialSettings = Object.keys(existingSettings).length ? existingSettings : defaultSettings
  const [settings, setSettings] = useState(initialSettings)
  const [notes, setNotes] = useState(pedal.pivot?.notes || '')
  const [newKey, setNewKey] = useState('')
  const settingKeys = Object.keys(settings)

  const updateSetting = (key, value, previous) => {
    const parsed = typeof previous === 'number' ? Number(value) : value
    setSettings((current) => ({ ...current, [key]: parsed }))
  }

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="modal pedal-settings-modal" role="dialog" aria-modal="true" aria-label={`${pedal.name} settings`}>
      <div className="modal-header"><div><span className="eyebrow">PEDAL CONTROLS</span><h2>{pedal.name}</h2></div><Button className="icon-button" onClick={onClose} aria-label="Close settings">×</Button></div>
      <form className="form-stack pedal-settings-form" onSubmit={(event) => { event.preventDefault(); onSave(settings, notes) }}>
        <p className="muted">Adjust this pedal’s saved settings and notes.</p>
        {settingKeys.map((key) => <label className="range-setting" key={key}><span>{key}<b>{settings[key]}{typeof settings[key] === 'number' ? '%' : ''}</b></span>
          {typeof settings[key] === 'number'
            ? <input type="range" min="0" max="100" value={settings[key]} onChange={(event) => updateSetting(key, event.target.value, settings[key])} />
            : <input value={settings[key] ?? ''} onChange={(event) => updateSetting(key, event.target.value, settings[key])} />}
        </label>)}
        <div className="add-setting-row"><input aria-label="New setting name" value={newKey} onChange={(event) => setNewKey(event.target.value)} placeholder="Add a setting…" /><Button type="button" onClick={() => { const key = newKey.trim(); if (key && !Object.hasOwn(settings, key)) setSettings((current) => ({ ...current, [key]: 50 })); setNewKey('') }}>Add</Button></div>
        <label className="field-label" htmlFor="pedal-notes">Notes<textarea id="pedal-notes" rows="3" maxLength="5000" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="How do you use this pedal?" /></label>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="form-actions"><Button type="button" onClick={onClose} disabled={isSaving}>Cancel</Button><Button type="submit" variant="primary" disabled={isSaving}>{isSaving ? 'Saving…' : 'Save settings'}</Button></div>
      </form>
    </section>
  </div>
}

export function PedalboardToolbar({ board, name, description, onNameChange, onDescriptionChange, isDirty, isSaving, onSave, onAdd }) {
  return <div className="builder-toolbar pedalboard-toolbar">
    <div className="pedalboard-toolbar-fields">
      <FormInput label="Board name" name="builder-board-name" value={name} maxLength={150} onChange={(event) => onNameChange(event.target.value)} />
      <label className="field-label" htmlFor="builder-board-description">Description<textarea id="builder-board-description" rows="2" value={description} onChange={(event) => onDescriptionChange(event.target.value)} maxLength={2000} placeholder="Describe this tone…" /></label>
    </div>
    <div className="builder-toolbar-right"><Button onClick={onAdd}>+ Add pedal</Button><Button variant="primary" onClick={onSave} disabled={!isDirty || isSaving}>{isSaving ? 'Saving…' : 'Save board'}</Button></div>
    <span className="sr-only" aria-live="polite">{isDirty ? 'Unsaved board details' : `${board.name} saved`}</span>
  </div>
}

function usePedalboard(id) {
  const [board, setBoard] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const retryLoad = () => {
    setIsLoading(true)
    setRetry((value) => value + 1)
  }
  useEffect(() => {
    const controller = new AbortController()
    apiClient.get(`/pedalboards/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        setBoard(data.data)
        setError('')
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(errorMessage(requestError, 'Unable to load this pedalboard.'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [id, retry])
  return { board, setBoard, isLoading, error, retry: retryLoad }
}

export function PedalboardDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const { board, isLoading, error, retry } = usePedalboard(id)
  if (isLoading) return <LoadingSpinner label="Loading pedalboard…" />
  if (error) return <ErrorMessage onRetry={retry}>{error}</ErrorMessage>
  if (!board) return <EmptyState title="Pedalboard not found" message="This board is not available." action={<Link to="/pedalboards">Back to pedalboards</Link>} />
  return <>
    <SectionHeading eyebrow="PEDALBOARD DETAILS" title={board.name} description={board.description || 'A signal chain from guitar input to amplifier.'} action={<Link className="button button-primary" to={`/pedalboards/${id}/builder`}>Open builder</Link>} />
    {location.state?.success && <SuccessMessage>{location.state.success}</SuccessMessage>}
    <Card className="signal-card"><div className="signal-card-heading"><div><span className="eyebrow">YOUR SIGNAL PATH</span><h2>{board.pedals.length ? `${board.pedals.length} pedals in your chain` : 'An empty chain, ready for sound'}</h2></div></div><SignalChain pedals={board.pedals} readOnly /><div className="signal-footer"><span>Updated {formatDate(board.updated_at)}</span><Link to="/pedalboards">← All pedalboards</Link></div></Card>
    <div className="board-detail-actions"><Link className="button button-secondary" to={`/pedalboards/${id}/edit`}>Edit board details</Link><Link className="button button-primary" to={`/pedalboards/${id}/builder`}>Build signal chain</Link></div>
  </>
}

export function PedalboardBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { board, setBoard, isLoading, error: loadError, retry } = usePedalboard(id)
  const [nameDraft, setNameDraft] = useState(null)
  const [descriptionDraft, setDescriptionDraft] = useState(null)
  const [isSavingBoard, setIsSavingBoard] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [pedals, setPedals] = useState([])
  const [pedalPage, setPedalPage] = useState(1)
  const [pedalLastPage, setPedalLastPage] = useState(1)
  const [pedalSearchInput, setPedalSearchInput] = useState('')
  const [pedalSearch, setPedalSearch] = useState('')
  const [pedalRetry, setPedalRetry] = useState(0)
  const [isLoadingPedals, setIsLoadingPedals] = useState(false)
  const [pedalLoadError, setPedalLoadError] = useState('')
  const [activePedal, setActivePedal] = useState(null)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [settingsError, setSettingsError] = useState('')
  const [confirmingPedal, setConfirmingPedal] = useState(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPedalSearch(pedalSearchInput.trim())
      setPedalPage(1)
    }, 250)
    return () => window.clearTimeout(timeout)
  }, [pedalSearchInput])

  useEffect(() => {
    if (!selectorOpen) return undefined
    const controller = new AbortController()
    const params = { page: pedalPage }
    if (pedalSearch) params.search = pedalSearch
    apiClient.get('/pedals', { params, signal: controller.signal })
      .then(({ data }) => {
        setPedals(data.data)
        setPedalLastPage(data.meta.last_page)
        setPedalLoadError('')
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setPedalLoadError(errorMessage(requestError, 'Unable to load pedals from the catalog.'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingPedals(false)
      })
    return () => controller.abort()
  }, [selectorOpen, pedalPage, pedalSearch, pedalRetry])

  const searchCatalog = (value) => {
    setIsLoadingPedals(true)
    setPedalSearchInput(value)
  }

  const changeCatalogPage = (page) => {
    setIsLoadingPedals(true)
    setPedalPage(page)
  }

  const name = nameDraft ?? board?.name ?? ''
  const description = descriptionDraft ?? board?.description ?? ''
  const boardIsDirty = Boolean(board && (name.trim() !== board.name || description !== (board.description || '')))
  const selectedIds = useMemo(() => new Set((board?.pedals || []).map((pedal) => pedal.id)), [board?.pedals])

  const mutate = async (operation, message) => {
    setIsMutating(true)
    setError('')
    setSuccess('')
    try {
      const updated = await operation()
      if (updated?.data?.data) setBoard(updated.data.data)
      else {
        const refreshed = await apiClient.get(`/pedalboards/${id}`)
        setBoard(refreshed.data.data)
      }
      setSuccess(message)
      return true
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to update the pedal chain. Please try again.'))
      return false
    } finally {
      setIsMutating(false)
      setConfirmingPedal(null)
    }
  }

  const addPedal = (pedal) => mutate(
    () => apiClient.post(`/pedalboards/${id}/pedals`, { pedal_id: pedal.id, position: (board?.pedals.length || 0) + 1 }),
    `${pedal.name} added to your signal chain.`,
  ).then((saved) => { if (saved) setSelectorOpen(false) })

  const movePedal = (pedal, index) => {
    if (index < 0 || index >= board.pedals.length || isMutating) return
    mutate(() => apiClient.put(`/pedalboards/${id}/pedals/${pedal.id}`, { position: index + 1 }), `${pedal.name} moved in the signal chain.`)
  }

  const removePedal = () => mutate(
    () => apiClient.delete(`/pedalboards/${id}/pedals/${confirmingPedal.id}`),
    `${confirmingPedal.name} removed from the signal chain.`,
  )

  const saveBoard = async () => {
    if (!name.trim()) {
      setError('Enter a name for this pedalboard before saving.')
      return
    }
    setIsSavingBoard(true)
    setError('')
    setSuccess('')
    try {
      const { data } = await apiClient.put(`/pedalboards/${id}`, { name: name.trim(), description: description.trim() || null })
      setBoard(data.data)
      setNameDraft(null)
      setDescriptionDraft(null)
      setSuccess('Pedalboard details saved.')
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to save pedalboard details.'))
    } finally {
      setIsSavingBoard(false)
    }
  }

  const saveSettings = async (settings, notes) => {
    setIsSavingSettings(true)
    setSettingsError('')
    try {
      const { data } = await apiClient.put(`/pedalboards/${id}/pedals/${activePedal.id}`, { settings, notes })
      setBoard(data.data)
      setActivePedal(null)
      setSuccess(`${activePedal.name} settings saved.`)
    } catch (requestError) {
      setSettingsError(errorMessage(requestError, 'Unable to save pedal settings.'))
    } finally {
      setIsSavingSettings(false)
    }
  }

  if (isLoading) return <LoadingSpinner label="Loading your pedalboard…" />
  if (loadError) return <ErrorMessage onRetry={retry}>{loadError}</ErrorMessage>
  if (!board) return <EmptyState title="Pedalboard not found" message="This board is not available." action={<Link to="/pedalboards">Back to pedalboards</Link>} />

  return <>
    <SectionHeading eyebrow="SIGNAL CHAIN STUDIO" title="Pedalboard builder" description="Place each effect between your guitar and amplifier." action={<Link className="button button-secondary" to={`/pedalboards/${id}`}>View board</Link>} />
    {success && <SuccessMessage>{success}</SuccessMessage>}
    {error && <ErrorMessage>{error}</ErrorMessage>}
    <PedalboardToolbar board={board} name={name} description={description} onNameChange={setNameDraft} onDescriptionChange={setDescriptionDraft} isDirty={boardIsDirty} isSaving={isSavingBoard} onSave={saveBoard} onAdd={() => { setIsLoadingPedals(true); setSelectorOpen(true) }} />
    <Card className="signal-card builder-signal-card"><div className="signal-card-heading"><div><span className="eyebrow">YOUR SIGNAL PATH</span><h2>Guitar → Tuner → Compressor → Overdrive → Distortion → Delay → Reverb → Amplifier</h2></div><span className="signal-count">{board.pedals.length} pedals</span></div>
      <SignalChain pedals={board.pedals} onMove={movePedal} onRemove={setConfirmingPedal} onSettings={(pedal) => { setSettingsError(''); setActivePedal(pedal) }} />
      <div className="signal-footer"><span><i /> Signal flows left to right</span><span>Use arrows on pedals to reorder</span></div>
    </Card>
    <div className="builder-note"><span aria-hidden="true">✳</span><p><b>Every pedal change is saved to your ToneVault board.</b> Use “Save board” to save name and description edits.</p></div>
    <div className="builder-mobile-save"><Button variant="primary" onClick={saveBoard} disabled={!boardIsDirty || isSavingBoard}>{isSavingBoard ? 'Saving…' : 'Save board details'}</Button></div>
    {selectorOpen && <PedalSelector pedals={pedals} selectedIds={selectedIds} isLoading={isLoadingPedals || isMutating} error={pedalLoadError} page={pedalPage} totalPages={pedalLastPage} search={pedalSearchInput} onSearch={searchCatalog} onPageChange={changeCatalogPage} onRetry={() => { setIsLoadingPedals(true); setPedalRetry((value) => value + 1) }} onAdd={addPedal} onClose={() => setSelectorOpen(false)} />}
    {activePedal && <PedalSettingsPanel pedal={activePedal} isSaving={isSavingSettings} error={settingsError} onSave={saveSettings} onClose={() => { if (!isSavingSettings) setActivePedal(null) }} />}
    {confirmingPedal && <ConfirmModal title="Remove pedal?" message={`Remove “${confirmingPedal.name}” from this signal chain?`} confirmLabel="Remove pedal" onConfirm={removePedal} onClose={() => { if (!isMutating) setConfirmingPedal(null) }} isLoading={isMutating} />}
    <div className="builder-back-link"><Link to="/pedalboards">← My pedalboards</Link><button type="button" onClick={() => navigate(`/pedalboards/${id}/edit`)}>Edit board details</button></div>
  </>
}
