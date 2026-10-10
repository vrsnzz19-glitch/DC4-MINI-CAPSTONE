import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, EmptyState, ErrorMessage, LoadingSpinner, StatusBadge } from '../components/ui'
import { PedalFilters, PedalGrid, Pagination } from '../components/PedalCatalog'
import apiClient from '../services/apiClient'

const emptyFilters = { category: '', type: '', status: '' }

export function PedalLibraryPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [categories, setCategories] = useState([])
  const [types, setTypes] = useState([])
  const [statuses, setStatuses] = useState([])
  const [pedals, setPedals] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterError, setFilterError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      apiClient.get('/categories', { signal: controller.signal }),
      apiClient.get('/pedal-filters', { signal: controller.signal }),
    ])
      .then(([categoriesResponse, filtersResponse]) => {
        setCategories(categoriesResponse.data.data)
        setTypes(filtersResponse.data.types)
        setStatuses(filtersResponse.data.statuses)
        setFilterError('')
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setFilterError(requestError.response?.data?.message || 'Unable to load pedal filters.')
      })

    return () => controller.abort()
  }, [retry])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    const controller = new AbortController()
    const params = { page }
    if (search) params.search = search
    if (filters.category) params.category = filters.category
    if (filters.type) params.type = filters.type
    if (filters.status) params.status = filters.status

    apiClient.get('/pedals', { params, signal: controller.signal })
      .then((response) => {
        setError('')
        if (page > response.data.meta.last_page) {
          setPage(response.data.meta.last_page || 1)
          return
        }
        setPedals(response.data.data)
        setPage(response.data.meta.current_page)
        setLastPage(response.data.meta.last_page)
        setTotal(response.data.meta.total)
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setError(requestError.response?.data?.message || 'Unable to load pedals. Please try again.')
          setPedals([])
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [page, search, filters, retry])

  const changeFilter = useCallback((key, value) => {
    setIsLoading(true)
    setError('')
    setFilters((current) => ({ ...current, [key]: value }))
    setPage(1)
  }, [])

  const onSearchChange = (value) => {
    setIsLoading(true)
    setError('')
    setSearchInput(value)
  }

  const clearFilters = () => {
    setIsLoading(true)
    setError('')
    setSearchInput('')
    setSearch('')
    setFilters(emptyFilters)
    setPage(1)
  }

  return <>
    <div className="section-heading"><div><span className="eyebrow">THE COLLECTION</span><h1>Pedal library</h1><p>Find your next sound by name, brand, or model.</p></div><span className="collection-count"><span /> {total} pedals</span></div>
    <PedalFilters
      search={searchInput}
      onSearchChange={onSearchChange}
      category={filters.category}
      onCategoryChange={(value) => changeFilter('category', value)}
      type={filters.type}
      onTypeChange={(value) => changeFilter('type', value)}
      status={filters.status}
      onStatusChange={(value) => changeFilter('status', value)}
      categories={categories}
      types={types}
      statuses={statuses}
      onClear={clearFilters}
    />
    {error || filterError
      ? <ErrorMessage onRetry={() => { setIsLoading(true); setError(''); setFilterError(''); setRetry((current) => current + 1) }}>{error || filterError}</ErrorMessage>
      : <PedalGrid pedals={pedals} isLoading={isLoading} />}
    {!error && !filterError && <Pagination page={page} totalPages={lastPage} onPageChange={(value) => { setIsLoading(true); setPage(value) }} />}
  </>
}

export function PedalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState({ id: null, pedal: null, error: '' })

  useEffect(() => {
    const controller = new AbortController()
    apiClient.get(`/pedals/${id}`, { signal: controller.signal })
      .then((response) => setResult({ id, pedal: response.data.data, error: '' }))
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setResult({
            id,
            pedal: null,
            error: requestError.response?.status === 404
              ? 'This pedal could not be found.'
              : requestError.response?.data?.message || 'Unable to load pedal details.',
          })
        }
      })

    return () => controller.abort()
  }, [id])

  if (result.id !== id) return <LoadingSpinner label="Loading pedal details..." />
  if (result.error) return <ErrorMessage onRetry={() => navigate(0)}>{result.error}</ErrorMessage>
  const pedal = result.pedal
  if (!pedal) return <EmptyState title="Pedal not found" message="This pedal is not in the catalog." />

  return <>
    <div className="section-heading"><div><span className="eyebrow">PEDAL DETAILS</span><h1>{pedal.name}</h1><p>{pedal.brand}{pedal.model ? ` · ${pedal.model}` : ''}</p></div><Button onClick={() => navigate('/pedals')}>Back to library</Button></div>
    <Card className="detail-page-card">
      {pedal.image ? <img className="pedal-detail-image" src={pedal.image} alt={`${pedal.brand} ${pedal.name}`} /> : <div className="pedal-detail-placeholder" aria-hidden="true">{pedal.brand}</div>}
      <div>
        <StatusBadge tone={`pedal-status-${pedal.status?.toLowerCase()}`}>{pedal.status}</StatusBadge>
        <h2>{pedal.category?.name || 'Uncategorized'}</h2>
        {pedal.type && <p className="pedal-detail-type">{pedal.type}</p>}
        {pedal.description && <p>{pedal.description}</p>}
        {pedal.price !== null && pedal.price !== undefined && <p className="pedal-detail-price">${Number(pedal.price).toFixed(2)}</p>}
        <Button variant="primary" onClick={() => navigate('/pedals')}>← All pedals</Button>
      </div>
    </Card>
  </>
}