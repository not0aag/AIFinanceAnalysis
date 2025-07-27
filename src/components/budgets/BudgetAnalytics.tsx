'use client'

import { Budget, Transaction } from '@/types/finance'

interface BudgetAnalyticsProps {
  budgets: Budget[]
  transactions: Transaction[]
  period: 'weekly' | 'monthly' | 'yearly'
}

export default function BudgetAnalytics({ budgets, transactions, period }: BudgetAnalyticsProps) {
  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Budget Analytics</h3>
      </div>
      <div className="content-card-body">
        <p>Analytics coming soon...</p>
      </div>
    </div>
  )
}