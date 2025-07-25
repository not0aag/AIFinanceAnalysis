'use client'

import { useState, useEffect } from 'react'
import AIFinancialAnalyst from '@/components/AIFinancialAnalyst'

export default function InsightsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load transactions from localStorage
    const loadTransactions = () => {
      const savedTransactions = localStorage.getItem('finance-ai-transactions')
      
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions))
      }
      
      setIsLoading(false)
    }

    loadTransactions()
  }, [])

  // Calculate monthly income from actual user data
  const calculateMonthlyIncome = () => {
    const incomeTransactions = transactions.filter(t => t.amount > 0)
    if (incomeTransactions.length === 0) return 0
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
    return Math.round(totalIncome)
  }

  const monthlyIncome = calculateMonthlyIncome()
  const financialGoals = ['Emergency Fund', 'Vacation', 'Investment Portfolio']

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="text-body">Loading your financial insights...</div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="fade-in">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">AI Financial Insights</h1>
          <p className="page-subtitle">Advanced analysis of your financial patterns</p>
        </div>

        {/* Empty State */}
        <div className="content-card">
          <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--color-purple) 0%, #8e44ad 100%)',
              borderRadius: 'var(--radius-large)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-8) auto',
              fontSize: 'var(--font-size-title-2)',
              color: 'white',
              boxShadow: 'var(--shadow-medium)'
            }}>
              🤖
            </div>
            <h2 className="text-title-2" style={{ marginBottom: 'var(--space-4)' }}>
              AI Insights Awaiting Data
            </h2>
            <p className="text-body" style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-8)',
              maxWidth: '500px',
              margin: '0 auto var(--space-8) auto'
            }}>
              Add some transactions to unlock powerful AI-driven financial insights, 
              personalized recommendations, and smart budget optimization.
            </p>
            <button
              className="btn btn-primary btn-large"
              onClick={() => window.location.href = '/dashboard'}
            >
              Add Transactions
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">AI Financial Insights</h1>
        <p className="page-subtitle">
          Advanced analysis of your financial patterns with personalized recommendations
        </p>
      </div>
      
      {/* AI Analysis Component */}
      <AIFinancialAnalyst 
        transactions={transactions}
        monthlyIncome={monthlyIncome}
        financialGoals={financialGoals}
      />
    </div>
  )
}