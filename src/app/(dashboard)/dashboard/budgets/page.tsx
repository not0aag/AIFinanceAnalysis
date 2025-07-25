'use client'

import { useState, useEffect } from 'react'

interface Transaction {
  id: number
  name: string
  amount: number
  category: string
  date: string
}

interface Budget {
  category: string
  allocated: number
  spent: number
}

export default function BudgetsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
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

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="text-body">Loading your budgets...</div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="fade-in">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Budgets</h1>
          <p className="page-subtitle">Set and track your spending limits</p>
        </div>

        {/* Empty State */}
        <div className="content-card">
          <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--color-orange) 0%, #e6890a 100%)',
              borderRadius: 'var(--radius-large)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-8) auto',
              fontSize: 'var(--font-size-title-2)',
              color: 'white',
              boxShadow: 'var(--shadow-medium)'
            }}>
              🎯
            </div>
            <h2 className="text-title-2" style={{ marginBottom: 'var(--space-4)' }}>
              Budgets Awaiting Data
            </h2>
            <p className="text-body" style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-8)',
              maxWidth: '500px',
              margin: '0 auto var(--space-8) auto'
            }}>
              Add some transactions to start creating budgets based on your actual spending patterns 
              and track your progress against your financial goals.
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

  // Process real transaction data to create budgets
  const expenses = transactions.filter(t => t.amount < 0)
  
  // Calculate actual spending by category
  const categorySpending: Record<string, number> = {}
  expenses.forEach(transaction => {
    const category = transaction.category || 'Other'
    categorySpending[category] = (categorySpending[category] || 0) + Math.abs(transaction.amount)
  })

  // Create budgets based on actual spending with some buffer
  const budgets: Budget[] = Object.entries(categorySpending).map(([category, spent]) => ({
    category,
    allocated: Math.ceil(spent * 1.2), // Set budget 20% higher than actual spending
    spent
  })).filter(budget => budget.spent > 0) // Only show categories with actual spending

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.allocated, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const remaining = totalBudgeted - totalSpent

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Budgets</h1>
        <p style={{ color: '#94a3b8' }}>Set and track your spending limits</p>
      </div>
      
      {/* Budget Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Budgeted</div>
          <div className="stat-value">${totalBudgeted.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Spent</div>
          <div className="stat-value">${totalSpent.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Remaining</div>
          <div className="stat-value" style={{ color: remaining >= 0 ? '#10b981' : '#ef4444' }}>
            ${remaining.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Budget List */}
      {budgets.length > 0 ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {budgets.map((budget, index) => {
            const percentage = (budget.spent / budget.allocated) * 100
            const isOverBudget = percentage > 100
            
            return (
              <div key={index} className="stat-card">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h3 style={{ marginBottom: '0.25rem' }}>{budget.category}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Monthly Budget</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '600' }}>
                      ${budget.spent.toLocaleString()} / ${budget.allocated.toLocaleString()}
                    </p>
                    <p style={{
                      fontSize: '0.875rem',
                      color: isOverBudget ? '#ef4444' : '#94a3b8'
                    }}>
                      {percentage.toFixed(0)}% used
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#374151',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(percentage, 100)}%`,
                    height: '100%',
                    backgroundColor: isOverBudget ? '#ef4444' : '#10b981',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                
                {isOverBudget && (
                  <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    ⚠️ Over budget by ${(budget.spent - budget.allocated).toFixed(2)}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="stat-card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>No Expense Categories Yet</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
              Add some expense transactions to automatically create budgets based on your spending patterns.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.href = '/dashboard'}
            >
              Add Transactions
            </button>
          </div>
        </div>
      )}
    </div>
  )
}