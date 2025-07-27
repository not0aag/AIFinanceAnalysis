'use client'

import { Transaction, FinancialGoal } from '@/types/finance'

interface GoalRecommendationsProps {
  transactions: Transaction[]
  existingGoals: FinancialGoal[]
  monthlyIncome: number
  onGoalCreate: (goal: FinancialGoal) => void
}

export default function GoalRecommendations({ transactions, existingGoals, monthlyIncome, onGoalCreate }: GoalRecommendationsProps) {
  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Goal Recommendations</h3>
      </div>
      <div className="content-card-body">
        <p>AI-powered goal suggestions...</p>
      </div>
    </div>
  )
}