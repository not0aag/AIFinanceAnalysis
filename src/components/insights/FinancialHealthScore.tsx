'use client'

import { Transaction, FinancialGoal } from '@/types/finance'

interface FinancialHealthScoreProps {
  transactions: Transaction[]
  goals: FinancialGoal[]
  monthlyIncome: number
}

export default function FinancialHealthScore({ transactions, goals, monthlyIncome }: FinancialHealthScoreProps) {
  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Financial Health Score</h3>
      </div>
      <div className="content-card-body">
        <p>Score calculation coming soon...</p>
      </div>
    </div>
  )
}