'use client'

import { Budget, Transaction } from '@/types/finance'
import { formatCurrency } from '@/lib/finance-utils'

interface BudgetOverviewProps {
  budgets: Budget[]
  transactions: Transaction[]
  period: 'weekly' | 'monthly' | 'yearly'
}

export default function BudgetOverview({ budgets, transactions, period }: BudgetOverviewProps) {
  const totalBudget = budgets.reduce((sum, b) => sum + b.allocated, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const remaining = totalBudget - totalSpent

  return (
    <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
      <div className="stat-card">
        <div className="stat-label">Total Budget</div>
        <div className="stat-value">{formatCurrency(totalBudget)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total Spent</div>
        <div className="stat-value">{formatCurrency(totalSpent)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Remaining</div>
        <div className="stat-value" style={{ 
          color: remaining >= 0 ? 'var(--color-green)' : 'var(--color-red)' 
        }}>
          {formatCurrency(remaining)}
        </div>
      </div>
    </div>
  )
}