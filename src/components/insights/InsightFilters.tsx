'use client'

interface InsightFiltersProps {
  filters: any
  onFilterChange: (filters: any) => void
  insightCounts: any
}

export default function InsightFilters({ filters, onFilterChange, insightCounts }: InsightFiltersProps) {
  return (
    <div className="content-card" style={{ marginBottom: 'var(--space-6)' }}>
      <div className="content-card-body">
        <p>Filters coming soon...</p>
      </div>
    </div>
  )
}