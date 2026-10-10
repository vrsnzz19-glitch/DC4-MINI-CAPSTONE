import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, EmptyState, ErrorMessage, FormInput, LoadingSpinner, Pagination, SearchBar } from '../components/ui'
import apiClient from '../services/apiClient'

function messageFor(error, fallback) {
  return error.response?.data?.message || fallback
}

function SectionHeading({ title, description, action }) {
  return <div className="section-heading"><div><span className="eyebrow">YOUR BUILDS</span><h1>{title}</h1><p>{description}</p></div>{action}</div>
}

export function PedalboardsPage() {
  const navigate = useNavigate()
  const [boards, setBoards] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    apiClient.get('/pedalboards', { params: { page }, signal: controller.signal })
      .then(({ data }) => {
        setBoards(data.data)
        setLastPage(data.meta.last_page)
        setError('')
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(messageFor(requestError, 'Unable to load your pedalboards.'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [page, retry])

  const query = search.trim().toLocaleLowerCase()
  const visibleBoards = boards.filter((board) => !query || `${board.name} ${board.description || ''}`.toLocaleLowerCase().includes(query))

  return <>
    <SectionHeading
      title="My pedalboards"
      description="Every signal chain, ready to shape and play."
      action={<Link className="button button-primary" to="/pedalboards/create">+ Build a pedalboard</Link>}
    />
    <div className="pedalboards-tools"><SearchBar value={search} onChange={setSearch} placeholder="Find a pedalboard..." /><span>{boards.length} saved</span></div>
    {error
      ? <ErrorMessage onRetry={() => { setIsLoading(true); setRetry((value) => value + 1) }}>{error}</ErrorMessage>
      : isLoading
        ? <LoadingSpinner label="Loading your pedalboards..." />
        : visibleBoards.length
          ? <>
            <div className="board-grid">
              {visibleBoards.map((board) => <Card key={board.id} className="board-card pedalboard-card">
                <div className="board-art art-clean">
                  <span className="art-label">SIGNAL CHAIN</span>
                  <div className="art-pedals">{(board.pedals || []).slice(0, 6).map((pedal) => <i key={pedal.id} />)}</div>
                  <div className="art-cable" />
                  {!board.pedals?.length && <span className="board-art-empty">Ready for your first pedal</span>}
                </div>
                <div className="board-card-body">
                  <div className="board-card-title"><div><h3>{board.name}</h3><span className="muted-small">{board.pedals?.length || 0} {(board.pedals?.length || 0) === 1 ? 'pedal' : 'pedals'}</span></div></div>
                  {board.description && <p className="pedalboard-description">{board.description}</p>}
                  <div className="pedalboard-card-actions">
                    <Button variant="primary" onClick={() => navigate(`/pedalboards/${board.id}/gig-mode`)}>Use this preset</Button>
                  </div>
                </div>
              </Card>)}
            </div>
            <Pagination page={page} totalPages={lastPage} onPageChange={(nextPage) => { setIsLoading(true); setPage(nextPage) }} />
          </>
          : <EmptyState
            title={query ? 'No matching pedalboards' : 'Your first board starts here'}
            message={query ? 'Try another search term.' : 'Choose pedals, save your signal chain, and take it to the stage.'}
            action={!query && <Link className="button button-primary" to="/pedalboards/create">Build a pedalboard</Link>}
          />}
  </>
}

export function PedalboardBuilderPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('My Custom Rig')
  const [description, setDescription] = useState('')
  const [pedals, setPedals] = useState([])
  const [selectedPedals, setSelectedPedals] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [isLoadingPedals, setIsLoadingPedals] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [fieldError, setFieldError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    apiClient.get('/pedals', { params: { page, ...(search.trim() ? { search: search.trim() } : {}) }, signal: controller.signal })
      .then(({ data }) => {
        setPedals(data.data)
        setLastPage(data.meta.last_page)
        setError('')
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(messageFor(requestError, 'Unable to load pedals from the catalog.'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingPedals(false)
      })

    return () => controller.abort()
  }, [page, search, retry])

  const togglePedal = (pedal) => {
    setSelectedPedals((current) => current.some((selected) => selected.id === pedal.id)
      ? current.filter((selected) => selected.id !== pedal.id)
      : [...current, pedal])
  }

  const savePedalboard = async (event) => {
    event.preventDefault()
    setError('')
    setFieldError('')
    if (!name.trim()) {
      setFieldError('Enter a name for this pedalboard.')
      return
    }

    setIsSaving(true)
    try {
      await apiClient.post('/pedalboards', {
        name: name.trim(),
        description: description.trim() || null,
        pedals: selectedPedals.map((pedal) => pedal.id),
      })
      navigate('/pedalboards', { replace: true })
    } catch (requestError) {
      setFieldError(requestError.response?.data?.errors?.name?.[0] || '')
      setError(messageFor(requestError, 'Unable to save this pedalboard. Please try again.'))
    } finally {
      setIsSaving(false)
    }
  }

  const selectedIds = new Set(selectedPedals.map((pedal) => pedal.id))

  return <>
    <SectionHeading title="Pedalboard builder" description="Choose pedals in signal-chain order, then save your rig to the vault." />
    <form className="pedalboard-builder" onSubmit={savePedalboard}>
      <Card className="pedalboard-builder-details">
        <FormInput name="board-name" label="Rig / pedalboard name" value={name} onChange={(event) => setName(event.target.value)} error={fieldError} required maxLength={150} placeholder="e.g. Live Gig Overdrive Rig" />
        <label className="field-label" htmlFor="board-description">Description<textarea id="board-description" rows="2" maxLength="2000" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Optional notes about this rig" /></label>
        <div className="builder-selected">
          <span className="eyebrow">YOUR SIGNAL CHAIN</span>
          {selectedPedals.length
            ? <ol>{selectedPedals.map((pedal, index) => <li key={pedal.id}>
              <span>{String(index + 1).padStart(2, '0')}</span><b>{pedal.name}</b><small>{pedal.brand}</small>
              <button type="button" aria-label={`Remove ${pedal.name}`} onClick={() => togglePedal(pedal)}>×</button>
            </li>)}</ol>
            : <p>No pedals selected yet. Select pedals below to add them to your chain.</p>}
        </div>
      </Card>

      <Card className="pedalboard-catalog">
        <div className="card-heading"><div><span className="eyebrow">PEDAL CATALOG</span><h2>Select pedals</h2></div><span>{selectedPedals.length} selected</span></div>
        <SearchBar value={search} onChange={(value) => { setIsLoadingPedals(true); setPage(1); setSearch(value) }} placeholder="Search name, brand, or model..." />
        {error && <ErrorMessage onRetry={() => { setIsLoadingPedals(true); setRetry((value) => value + 1) }}>{error}</ErrorMessage>}
        {isLoadingPedals
          ? <LoadingSpinner label="Loading pedals..." />
          : pedals.length
            ? <div className="builder-pedal-grid">{pedals.map((pedal) => {
              const isSelected = selectedIds.has(pedal.id)
              return <button
                type="button"
                key={pedal.id}
                className={`builder-pedal-option ${isSelected ? 'builder-pedal-selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => togglePedal(pedal)}
              >
                <span className={`builder-pedal-led ${isSelected ? 'is-on' : ''}`} />
                <span><b>{pedal.name}</b><small>{pedal.brand}{pedal.type ? ` · ${pedal.type}` : ''}</small></span>
                <span className="builder-pedal-check">{isSelected ? 'Added' : 'Add +'}</span>
              </button>
            })}</div>
            : <EmptyState title="No pedals found" message="Try another search or check back when the catalog has more pedals." />}
        {!error && !isLoadingPedals && <Pagination page={page} totalPages={lastPage} onPageChange={(nextPage) => { setIsLoadingPedals(true); setPage(nextPage) }} />}
      </Card>

      <div className="pedalboard-builder-actions">
        <Link className="button button-secondary" to="/pedalboards">Cancel</Link>
        <Button type="submit" variant="primary" disabled={isSaving}>{isSaving ? 'Saving rig...' : 'Save pedalboard'}</Button>
      </div>
    </form>
  </>
}
