'use client'

import { Budget } from '@/types/finance'
import { formatCurrency } from '@/lib/finance-utils'

interface BudgetCardProps {
  budget: Budget
  onEdit: () => void
  onDelete: () => void
  view: 'grid' | 'list'
}

export default function BudgetCard({ budget, onEdit, onDelete, view }: BudgetCardProps) {
  const percentage = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0
  const isOverBudget = percentage > 100

  return (
    <div className="stat-card">
      <h3>{budget.category}</h3>
      <p>{formatCurrency(budget.spent)} / {formatCurrency(budget.allocated)}</p>
      <div style={{
        height: '8px',
        background: 'var(--color-surface)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${Math.min(percentage, 100)}%`,
          height: '100%',
          background: isOverBudget ? 'var(--color-red)' : 'var(--color-green)',
          transition: 'width 0.5s ease'
        }} />
      </div>
    </div>
  )
}