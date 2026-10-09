import useEscapeKey from '../hooks/useEscapeKey'

export function Button({ children, variant = 'secondary', className = '', ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>
}

export function FormInput({ label, error, id, ...props }) {
  const inputId = id || props.name
  return <label className="field-label" htmlFor={inputId}>
    {label}
    <input id={inputId} aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : undefined} {...props} />
    {error && <span className="field-error" id={`${inputId}-error`}>{error}</span>}
  </label>
}

export function SelectInput({ label, options, id, ...props }) {
  const inputId = id || props.name
  return <label className="field-label" htmlFor={inputId}>
    {label}
    <select id={inputId} {...props}>{options.map((option) => {
      const value = typeof option === 'string' ? option : option.value
      const text = typeof option === 'string' ? option : option.label
      return <option key={value} value={value}>{text}</option>
    })}</select>
  </label>
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return <label className="search-bar"><span aria-hidden="true">⌕</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /><span className="sr-only">Search</span></label>
}

export function FilterBar({ children, onClear, className = '' }) {
  return <div className={`filter-bar ${className}`}>{children}{onClear && <Button type="button" onClick={onClear}>Clear filters</Button>}</div>
}

export function LoadingSpinner({ label = 'Loading...' }) {
  return <div className="loading-state" role="status"><span className="spinner" />{label}</div>
}

export function Skeleton({ className = '', lines = 1 }) {
  return <div className={`skeleton-stack ${className}`} aria-hidden="true">{Array.from({ length: lines }, (_, index) => <span className="skeleton" key={index} />)}</div>
}

export function ErrorMessage({ children, onRetry }) {
  return <div className="inline-message error-message" role="alert"><span>{children}</span>{onRetry && <Button onClick={onRetry}>Try again</Button>}</div>
}

export function SuccessMessage({ children }) {
  return <div className="inline-message success-message" role="status">{children}</div>
}

export function EmptyState({ title, message, action }) {
  return <div className="empty-state"><div className="empty-icon" aria-hidden="true">⌕</div><h3>{title}</h3><p>{message}</p>{action}</div>
}

export function ConfirmModal({ title, message, onConfirm, onClose, confirmLabel = 'Confirm' }) {
  return <Modal title={title} onClose={onClose}><div className="confirm-modal-content"><p>{message}</p><div className="confirm-actions"><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={onConfirm}>{confirmLabel}</Button></div></div></Modal>
}

export function DataTable({ columns, rows, rowKey = 'id', emptyTitle = 'Nothing here yet', emptyMessage = 'There are no items to show.' }) {
  return <div className="table-wrap"><table><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody>
    {rows.length ? rows.map((row, index) => <tr key={row[rowKey] ?? index}>{columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}</tr>) : <tr><td colSpan={columns.length}><EmptyState title={emptyTitle} message={emptyMessage} /></td></tr>}
  </tbody></table></div>
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages < 2) return null
  return <nav className="pagination" aria-label="Pagination"><span>Page <b>{page}</b> of <b>{totalPages}</b></span><div><Button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button><Button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button></div></nav>
}

export function StatusBadge({ children, tone = 'muted' }) {
  return <span className={`status-badge status-${tone}`}>{children}</span>
}

export function Modal({ title, onClose, children, wide = false }) {
  useEscapeKey(onClose)

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-header"><div><span className="eyebrow">TONEVAULT</span><h2>{title}</h2></div><Button className="icon-button" onClick={onClose} aria-label="Close dialog">×</Button></div>
      {children}
    </section>
  </div>
}

export function Card({ children, className = '', ...props }) {
  return <section className={`card ${className}`} {...props}>{children}</section>
}

export function Navbar({ children, className = '' }) {
  return <nav className={`shared-navbar ${className}`}>{children}</nav>
}

export function Sidebar({ children, className = '' }) {
  return <aside className={`shared-sidebar ${className}`}>{children}</aside>
}

export function MobileMenu({ open, onClose, children }) {
  return <div className={`mobile-menu ${open ? 'mobile-menu-open' : ''}`} aria-hidden={!open}>
    <button className="mobile-menu-scrim" onClick={onClose} aria-label="Close menu" tabIndex={open ? 0 : -1} />
    <nav className="mobile-menu-panel">{children}</nav>
  </div>
}
