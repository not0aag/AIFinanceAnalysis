'use client'

import { Budget } from '@/types/finance'
import { formatCurrency } from '@/lib/finance-utils'
import { Edit2, Trash2 } from 'lucide-react'

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
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg">{budget.category}</h3>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            title="Edit budget"
          >
            <Edit2 className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            title="Delete budget"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>
      
      <p className="text-2xl font-bold mb-2">
        {formatCurrency(budget.spent)} 
        <span className="text-sm font-normal text-muted-foreground"> / {formatCurrency(budget.allocated)}</span>
      </p>
      
      <div className="mb-2">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">
            {percentage.toFixed(0)}% used
          </span>
          {isOverBudget && (
            <span className="badge-danger">Over Budget</span>
          )}
        </div>
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
      
      <p className="text-sm text-muted-foreground">
        {formatCurrency(Math.max(0, budget.allocated - budget.spent))} remaining
      </p>
    </div>
  )
}