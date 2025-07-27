'use client'

import { AIInsight, Transaction } from '@/types/finance'

interface ActionableInsightsProps {
  insights: AIInsight[]
  onAction: (insightId: string, action: 'dismiss' | 'complete') => void
  transactions: Transaction[]
}

export default function ActionableInsights({ insights, onAction, transactions }: ActionableInsightsProps) {
  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Actionable Insights</h3>
      </div>
      <div className="content-card-body">
        <p>{insights.length} insights available</p>
      </div>
    </div>
  )
}