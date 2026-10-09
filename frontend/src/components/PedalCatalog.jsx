import { Link } from 'react-router-dom'
import {
  Card,
  EmptyState,
  FilterBar,
  Pagination,
  SearchBar,
  Skeleton,
  StatusBadge,
} from './ui'

const pedalColors = ['orange', 'green', 'red', 'blue', 'silver', 'black', 'yellow']

function getPedalColor(pedal) {
  const hash = Array.from(`${pedal.brand}${pedal.name}`).reduce((total, character) => total + character.charCodeAt(0), 0)
  return pedalColors[hash % pedalColors.length]
}

function getInitials(pedal) {
  return (pedal.model || pedal.name).replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase()
}

export function PedalCard({ pedal }) {
  return <Card className="pedal-card">
    <div className={`pedal-visual pedal-${getPedalColor(pedal)}`}>
      <span className="pedal-brand">{pedal.brand}</span>
      {pedal.image
        ? <img className="pedal-image" src={pedal.image} alt="" loading="lazy" />
        : <span className="pedal-face">{getInitials(pedal)}</span>}
      <span className="pedal-led" />
      <span className="pedal-footswitch" />
    </div>
    <div className="pedal-card-body">
      <div className="pedal-title-row">
        <div><h3>{pedal.name}</h3><p>{pedal.model || pedal.brand}</p></div>
        <StatusBadge tone={`pedal-status-${pedal.status?.toLowerCase()}`}>{pedal.status?.charAt(0).toUpperCase() + pedal.status?.slice(1)}</StatusBadge>
      </div>
      <div className="tag-row">
        {pedal.category?.name && <span className="tag">{pedal.category.name}</span>}
        {pedal.type && <span className="tag tag-dim">{pedal.type}</span>}
      </div>
      <Link className="button button-secondary full-button" to={`/pedals/${pedal.id}`}>
        View pedal <span aria-hidden="true">→</span>
      </Link>
    </div>
  </Card>
}

export function PedalGrid({ pedals, isLoading = false }) {
  if (isLoading) {
    return <div className="pedal-grid" aria-label="Loading pedals">
      {Array.from({ length: 8 }, (_, index) => <Card className="pedal-card pedal-skeleton-card" key={index}>
        <Skeleton className="pedal-skeleton-visual" />
        <div className="pedal-card-body"><Skeleton lines={3} /></div>
      </Card>)}
    </div>
  }

  if (!pedals.length) {
    return <EmptyState title="No pedals found" message="Try a different search or clear your filters." />
  }

  return <div className="pedal-grid">{pedals.map((pedal) => <PedalCard key={pedal.id} pedal={pedal} />)}</div>
}

export function PedalFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
  categories,
  types,
  statuses,
  onClear,
}) {
  return <Card className="library-tools">
    <SearchBar value={search} onChange={onSearchChange} placeholder="Search name, brand, or model..." />
    <FilterBar className="pedal-filter-bar" onClear={onClear}>
      <label className="pedal-filter-field"><span>Category</span><select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
        <option value="">All categories</option>
        {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select></label>
      <label className="pedal-filter-field"><span>Type</span><select value={type} onChange={(event) => onTypeChange(event.target.value)}>
        <option value="">All types</option>
        {types.map((item) => <option key={item} value={item}>{item}</option>)}
      </select></label>
      <label className="pedal-filter-field"><span>Status</span><select value={status} onChange={(event) => onStatusChange(event.target.value)}>
        <option value="">All statuses</option>
        {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
      </select></label>
    </FilterBar>
  </Card>
}

export { Pagination }
