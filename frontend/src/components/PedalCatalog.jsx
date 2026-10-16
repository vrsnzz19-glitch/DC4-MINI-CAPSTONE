import {
  Card,
  EmptyState,
  FilterBar,
  Pagination,
  SearchBar,
  Skeleton,
} from './ui'

import { PedalCard } from './PedalCard'

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
