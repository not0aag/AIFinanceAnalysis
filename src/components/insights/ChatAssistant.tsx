'use client'

import { Transaction, FinancialGoal, AIInsight } from '@/types/finance'

interface ChatAssistantProps {
  transactions: Transaction[]
  goals: FinancialGoal[]
  insights: AIInsight[]
  monthlyIncome: number
}

export default function ChatAssistant({ transactions, goals, insights, monthlyIncome }: ChatAssistantProps) {
  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">AI Chat Assistant</h3>
      </div>
      <div className="content-card-body">
        <p>Chat interface coming soon...</p>
      </div>
    </div>
  )
}