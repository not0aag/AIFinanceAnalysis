'use client'

import { Budget, Transaction } from '@/types/finance'

interface BudgetRecommendationsProps {
  budgets: Budget[]
  transactions: Transaction[]
  onCreateBudget: (budget: any) => void
}

export default function BudgetRecommendations({ budgets, transactions, onCreateBudget }: BudgetRecommendationsProps) {
  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">AI Budget Recommendations</h3>
      </div>
      <div className="content-card-body">
        <p>Recommendations based on your spending patterns...</p>
      </div>
    </div>
  )
}