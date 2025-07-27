'use client'

interface TransactionFiltersProps {
  filters: any
  onFilterChange: (filters: any) => void
  transactions: any[]
  sortBy: string
  sortOrder: string
  onSortChange: (by: string, order: string) => void
}

export default function TransactionFilters({ filters, onFilterChange }: TransactionFiltersProps) {
  return null
}