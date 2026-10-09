import { useEffect, useState } from 'react'
import { Button, Card, ConfirmModal, DataTable, EmptyState, ErrorMessage, FormInput, LoadingSpinner, Pagination, SelectInput, StatusBadge } from '../components/ui'
import AdminLayout from '../layouts/AdminLayout'
import useNotice from '../hooks/useNotice'
import apiClient from '../services/apiClient'

function validationErrors(error) {
  if (error.response?.status === 422 && error.response.data.errors) {
    return Object.fromEntries(Object.entries(error.response.data.errors).map(([field, messages]) => [field, messages[0]]))
  }
  return {}
}

function requestMessage(error, fallback) {
  return error.response?.data?.message || fallback
}

function PedalForm({ pedal, categories, onSave, onCancel }) {
  const [values, setValues] = useState({
    name: pedal?.name || '',
    brand: pedal?.brand || '',
    model: pedal?.model || '',
    pedal_category_id: pedal?.pedal_category_id || '',
    type: pedal?.type || '',
    description: pedal?.description || '',
    price: pedal?.price || '',
    image: pedal?.image || '',
    status: pedal?.status || 'active',
  })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const update = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setErrors({})
    setMessage('')
    setIsSaving(true)
    try {
      await onSave({
        ...values,
        pedal_category_id: Number(values.pedal_category_id),
        price: values.price === '' ? null : Number(values.price),
        model: values.model || null,
        type: values.type || null,
        description: values.description || null,
        image: values.image || null,
      })
    } catch (error) {
      setErrors(validationErrors(error))
      setMessage(requestMessage(error, 'Unable to save this pedal. Please try again.'))
    } finally {
      setIsSaving(false)
    }
  }

  return <form className="form-stack" onSubmit={submit} noValidate>
    <FormInput name="name" label="Pedal name" value={values.name} onChange={update} error={errors.name} required maxLength={150} />
    <FormInput name="brand" label="Brand" value={values.brand} onChange={update} error={errors.brand} required maxLength={100} />
    <FormInput name="model" label="Model" value={values.model} onChange={update} error={errors.model} maxLength={100} />
    <SelectInput name="pedal_category_id" label="Category" value={values.pedal_category_id} onChange={update} error={errors.pedal_category_id} options={[{ value: '', label: 'Select a category' }, ...categories.map((category) => ({ value: category.id, label: category.name }))]} />
    <FormInput name="type" label="Type" value={values.type} onChange={update} error={errors.type} maxLength={50} />
    <FormInput name="price" label="Price" type="number" min="0" step="0.01" value={values.price} onChange={update} error={errors.price} />
    <FormInput name="image" label="Image URL or path" value={values.image} onChange={update} error={errors.image} maxLength={255} />
    <SelectInput name="status" label="Status" value={values.status} onChange={update} error={errors.status} options={['active', 'inactive']} />
    <label className="field-label" htmlFor="pedal-description">Description<textarea id="pedal-description" name="description" value={values.description} onChange={update} aria-invalid={Boolean(errors.description)} rows="3" /></label>
    {errors.description && <span className="field-error">{errors.description}</span>}
    {message && <ErrorMessage>{message}</ErrorMessage>}
    <div className="form-actions"><Button type="button" onClick={onCancel}>Cancel</Button><Button type="submit" variant="primary" disabled={isSaving}>{isSaving ? 'Saving...' : pedal ? 'Save changes' : 'Create pedal'}</Button></div>
  </form>
}

export function AdminPedalsPage() {
  const [pedals, setPedals] = useState([])
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [editingPedal, setEditingPedal] = useState(undefined)
  const [deletingPedal, setDeletingPedal] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [operationError, setOperationError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [retry, setRetry] = useState(0)
  const { flash } = useNotice()

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setAppliedSearch(search.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    const controller = new AbortController()
    const params = { page }
    if (appliedSearch) params.search = appliedSearch
    Promise.all([
      apiClient.get('/pedals', { params, signal: controller.signal }),
      apiClient.get('/categories', { signal: controller.signal }),
    ]).then(([pedalResponse, categoryResponse]) => {
      setError('')
      if (page > pedalResponse.data.meta.last_page) {
        setPage(pedalResponse.data.meta.last_page || 1)
        return
      }
      setPedals(pedalResponse.data.data)
      setLastPage(pedalResponse.data.meta.last_page)
      setPage(pedalResponse.data.meta.current_page)
      setCategories(categoryResponse.data.data)
    }).catch((requestError) => {
      if (!controller.signal.aborted) setError(requestMessage(requestError, 'Unable to load catalog data.'))
    }).finally(() => {
      if (!controller.signal.aborted) setIsLoading(false)
    })

    return () => controller.abort()
  }, [page, appliedSearch, retry])

  const savePedal = async (data) => {
    if (editingPedal) {
      await apiClient.put(`/pedals/${editingPedal.id}`, data)
      flash('Pedal updated successfully.')
    } else {
      await apiClient.post('/pedals', data)
      flash('Pedal created successfully.')
      setPage(1)
    }
    setEditingPedal(undefined)
    setRetry((current) => current + 1)
  }

  const deletePedal = async () => {
    setIsDeleting(true)
    try {
      await apiClient.delete(`/pedals/${deletingPedal.id}`)
      setDeletingPedal(null)
      setOperationError('')
      flash('Pedal deleted successfully.')
      setRetry((current) => current + 1)
    } catch (requestError) {
      setOperationError(requestMessage(requestError, 'Unable to delete this pedal.'))
    } finally {
      setIsDeleting(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Pedal', render: (pedal) => <><b>{pedal.name}</b>{pedal.model && <small className="table-subtitle">{pedal.model}</small>}</> },
    { key: 'brand', label: 'Brand' },
    { key: 'category', label: 'Category', render: (pedal) => pedal.category?.name || '—' },
    { key: 'status', label: 'Status', render: (pedal) => <StatusBadge tone={`pedal-status-${pedal.status?.toLowerCase()}`}>{pedal.status}</StatusBadge> },
    { key: 'actions', label: 'Actions', render: (pedal) => <div className="table-actions"><Button onClick={() => setEditingPedal(pedal)}>Edit</Button><Button onClick={() => { setOperationError(''); setDeletingPedal(pedal) }}>Delete</Button></div> },
  ]

  return <AdminLayout>
    <div className="section-heading"><div><span className="eyebrow">CATALOG MANAGEMENT</span><h1>Manage pedals</h1><p>Create, update, and remove catalog pedals.</p></div><Button variant="primary" onClick={() => setEditingPedal(null)}>Add pedal</Button></div>
    <Card className="admin-page-card">
      <label className="search-bar"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => { setIsLoading(true); setSearch(event.target.value) }} placeholder="Search name, brand, or model..." /><span className="sr-only">Search pedals</span></label>
      {operationError && <ErrorMessage>{operationError}</ErrorMessage>}
      {error ? <ErrorMessage onRetry={() => { setIsLoading(true); setRetry((current) => current + 1) }}>{error}</ErrorMessage>
        : isLoading ? <LoadingSpinner label="Loading pedals..." />
          : pedals.length ? <DataTable columns={columns} rows={pedals} emptyTitle="No pedals found" emptyMessage="Try another search." />
            : <EmptyState title={appliedSearch ? 'No pedals found' : 'No pedals yet'} message={appliedSearch ? 'Try another search.' : 'Create the first catalog pedal.'} />}
    </Card>
    {!error && !isLoading && <Pagination page={page} totalPages={lastPage} onPageChange={(value) => { setIsLoading(true); setPage(value) }} />}
    {editingPedal !== undefined && <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-label={editingPedal ? 'Edit pedal' : 'Create pedal'}><div className="modal-header"><div><span className="eyebrow">TONEVAULT CATALOG</span><h2>{editingPedal ? 'Edit pedal' : 'Add pedal'}</h2></div><Button onClick={() => setEditingPedal(undefined)} aria-label="Close dialog">×</Button></div><div className="catalog-modal-body"><PedalForm pedal={editingPedal || null} categories={categories} onSave={savePedal} onCancel={() => setEditingPedal(undefined)} /></div></section></div>}
    {deletingPedal && <ConfirmModal title="Delete pedal?" message={`Delete ${deletingPedal.name}? This action cannot be undone.`} confirmLabel="Delete pedal" error={operationError} isLoading={isDeleting} onClose={() => setDeletingPedal(null)} onConfirm={deletePedal} />}
  </AdminLayout>
}

function CategoryForm({ category, onSave, onCancel }) {
  const [name, setName] = useState(category?.name || '')
  const [description, setDescription] = useState(category?.description || '')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setErrors({})
    setMessage('')
    setIsSaving(true)
    try {
      await onSave({ name, description })
    } catch (error) {
      setErrors(validationErrors(error))
      setMessage(requestMessage(error, 'Unable to save this category.'))
    } finally {
      setIsSaving(false)
    }
  }

  return <form className="form-stack" onSubmit={submit} noValidate>
    <FormInput name="name" label="Category name" value={name} onChange={(event) => setName(event.target.value)} error={errors.name} required maxLength={100} />
    <label className="field-label" htmlFor="category-description">Description<textarea id="category-description" value={description} onChange={(event) => setDescription(event.target.value)} rows="3" /></label>
    {errors.description && <span className="field-error">{errors.description}</span>}
    {message && <ErrorMessage>{message}</ErrorMessage>}
    <div className="form-actions"><Button type="button" onClick={onCancel}>Cancel</Button><Button type="submit" variant="primary" disabled={isSaving}>{isSaving ? 'Saving...' : category ? 'Save changes' : 'Create category'}</Button></div>
  </form>
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [operationError, setOperationError] = useState('')
  const [editingCategory, setEditingCategory] = useState(undefined)
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [retry, setRetry] = useState(0)
  const { flash } = useNotice()

  useEffect(() => {
    const controller = new AbortController()
    apiClient.get('/categories', { signal: controller.signal })
      .then((response) => {
        setError('')
        setCategories(response.data.data)
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestMessage(requestError, 'Unable to load categories.'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [retry])

  const saveCategory = async (data) => {
    if (editingCategory) {
      await apiClient.put(`/categories/${editingCategory.id}`, data)
      flash('Category updated successfully.')
    } else {
      await apiClient.post('/categories', data)
      flash('Category created successfully.')
    }
    setEditingCategory(undefined)
    setRetry((current) => current + 1)
  }

  const deleteCategory = async () => {
    setIsDeleting(true)
    try {
      await apiClient.delete(`/categories/${deletingCategory.id}`)
      setDeletingCategory(null)
      setOperationError('')
      flash('Category deleted successfully.')
      setRetry((current) => current + 1)
    } catch (requestError) {
      setOperationError(requestMessage(requestError, 'Unable to delete this category.'))
    } finally {
      setIsDeleting(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Category', render: (category) => <b>{category.name}</b> },
    { key: 'pedals_count', label: 'Pedals' },
    { key: 'description', label: 'Description' },
    { key: 'actions', label: 'Actions', render: (category) => <div className="table-actions"><Button onClick={() => setEditingCategory(category)}>Edit</Button><Button onClick={() => { setOperationError(''); setDeletingCategory(category) }}>Delete</Button></div> },
  ]

  return <AdminLayout>
    <div className="section-heading"><div><span className="eyebrow">CATALOG ORGANIZATION</span><h1>Manage categories</h1><p>Organize effect families in the live pedal catalog.</p></div><Button variant="primary" onClick={() => setEditingCategory(null)}>Add category</Button></div>
    <Card className="admin-page-card">
      {operationError && <ErrorMessage>{operationError}</ErrorMessage>}
      {error ? <ErrorMessage onRetry={() => { setIsLoading(true); setRetry((current) => current + 1) }}>{error}</ErrorMessage>
        : isLoading ? <LoadingSpinner label="Loading categories..." />
          : categories.length ? <DataTable columns={columns} rows={categories} emptyTitle="No categories" />
            : <EmptyState title="No categories yet" message="Create a category to organize pedals." />}
    </Card>
    {editingCategory !== undefined && <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-label={editingCategory ? 'Edit category' : 'Create category'}><div className="modal-header"><div><span className="eyebrow">TONEVAULT CATALOG</span><h2>{editingCategory ? 'Edit category' : 'Add category'}</h2></div><Button onClick={() => setEditingCategory(undefined)} aria-label="Close dialog">×</Button></div><div className="catalog-modal-body"><CategoryForm category={editingCategory || null} onSave={saveCategory} onCancel={() => setEditingCategory(undefined)} /></div></section></div>}
    {deletingCategory && <ConfirmModal title="Delete category?" message={deletingCategory.pedals_count ? `${deletingCategory.name} contains ${deletingCategory.pedals_count} pedals and cannot be deleted until they are moved.` : `Delete ${deletingCategory.name}? This action cannot be undone.`} confirmLabel="Delete category" error={operationError} isLoading={isDeleting} onClose={() => setDeletingCategory(null)} onConfirm={deleteCategory} />}
  </AdminLayout>
}
