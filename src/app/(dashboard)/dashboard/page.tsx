'use client'

import { useState, useEffect } from 'react'
import Onboarding from '@/components/Onboarding'

interface Transaction {
  id: number
  name: string
  amount: number
  category: string
  date: string
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has any transactions
    const checkUserData = async () => {
      // In a real app, you'd fetch from your database
      // For now, check localStorage
      const savedTransactions = localStorage.getItem('finance-ai-transactions')
      
      if (savedTransactions) {
        const parsedTransactions = JSON.parse(savedTransactions)
        if (parsedTransactions.length > 0) {
          setTransactions(parsedTransactions)
          setShowOnboarding(false)
        } else {
          setShowOnboarding(false) // Show welcome screen, not onboarding modal
        }
      } else {
        setShowOnboarding(false) // Show welcome screen for new users
      }
      
      setIsLoading(false)
    }

    checkUserData()
  }, [])

  const handleOnboardingComplete = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions)
    localStorage.setItem('finance-ai-transactions', JSON.stringify(newTransactions))
    setShowOnboarding(false)
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="text-body">Loading your financial dashboard...</div>
      </div>
    )
  }

  // Show welcome screen for new users (no transactions)
  if (transactions.length === 0) {
    return (
      <div className="welcome-layout">
        <div className="welcome-content fade-in">
          {/* Hero Section */}
          <div style={{ marginBottom: 'var(--space-16)' }}>
            <div className="hero-icon">$</div>
            
            <h1 className="text-large-title" style={{ 
              marginBottom: 'var(--space-4)',
              background: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-text-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome to Finance AI
            </h1>
            
            <p className="text-title-3" style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-12)',
              maxWidth: '600px',
              margin: '0 auto var(--space-12) auto'
            }}>
              Your intelligent financial companion is ready to transform how you manage money. 
              Let's start by understanding your financial story.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-auto" style={{ marginBottom: 'var(--space-16)' }}>
            <div className="content-card scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, var(--color-green) 0%, var(--color-green-dark) 100%)',
                  borderRadius: 'var(--radius-large)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-6) auto',
                  fontSize: 'var(--font-size-title-2)',
                  color: 'white',
                  boxShadow: 'var(--shadow-medium)'
                }}>
                  📊
                </div>
                <h3 className="text-title-3" style={{ marginBottom: 'var(--space-3)' }}>
                  Smart Analytics
                </h3>
                <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                  Get personalized insights about your spending patterns and financial health with advanced AI.
                </p>
              </div>
            </div>

            <div className="content-card scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, var(--color-purple) 0%, #8e44ad 100%)',
                  borderRadius: 'var(--radius-large)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-6) auto',
                  fontSize: 'var(--font-size-title-2)',
                  color: 'white',
                  boxShadow: 'var(--shadow-medium)'
                }}>
                  🤖
                </div>
                <h3 className="text-title-3" style={{ marginBottom: 'var(--space-3)' }}>
                  AI Recommendations
                </h3>
                <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                  Receive tailored advice to optimize your budget and maximize savings potential.
                </p>
              </div>
            </div>

            <div className="content-card scale-in" style={{ animationDelay: '0.6s' }}>
              <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, var(--color-orange) 0%, #e6890a 100%)',
                  borderRadius: 'var(--radius-large)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-6) auto',
                  fontSize: 'var(--font-size-title-2)',
                  color: 'white',
                  boxShadow: 'var(--shadow-medium)'
                }}>
                  🎯
                </div>
                <h3 className="text-title-3" style={{ marginBottom: 'var(--space-3)' }}>
                  Goal Tracking
                </h3>
                <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                  Set financial goals and track your progress with intelligent forecasting.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="content-card slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <h2 className="text-title-2" style={{ marginBottom: 'var(--space-4)' }}>
                Ready to Begin Your Financial Journey?
              </h2>
              <p className="text-body" style={{ 
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-8)',
                maxWidth: '500px',
                margin: '0 auto var(--space-8) auto'
              }}>
                Add a few recent transactions to help our AI understand your spending patterns. 
                The more you add, the smarter your insights become.
              </p>
              
              <div className="flex" style={{ 
                gap: 'var(--space-4)', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => setShowOnboarding(true)}
                  style={{ minWidth: '200px' }}
                >
                  Add Your First Transaction
                </button>
                <button
                  className="btn btn-secondary btn-large"
                  onClick={() => {
                    // Add some sample data for demo
                    const sampleTransactions = [
                      { id: 1, name: 'Grocery Store', amount: -127.50, category: 'Food & Dining', date: '2024-01-15' },
                      { id: 2, name: 'Salary Deposit', amount: 5200.00, category: 'Income', date: '2024-01-01' },
                      { id: 3, name: 'Coffee Shop', amount: -12.50, category: 'Food & Dining', date: '2024-01-16' },
                      { id: 4, name: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', date: '2024-01-10' },
                      { id: 5, name: 'Gas Station', amount: -65.00, category: 'Transportation', date: '2024-01-12' },
                    ]
                    handleOnboardingComplete(sampleTransactions)
                  }}
                  style={{ minWidth: '160px' }}
                >
                  Try Demo Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Show Onboarding Modal */}
        {showOnboarding && (
          <div className="modal-overlay">
            <div className="modal-content">
              <Onboarding onTransactionsAdded={handleOnboardingComplete} />
              <button
                onClick={() => setShowOnboarding(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Show dashboard with data
  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0)
  const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const expenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
  const savings = income - expenses

  // Calculate percentage changes (using mock data for demo)
  const balanceChange = totalBalance >= 0 ? 5.2 : -3.1
  const incomeChange = income > 0 ? 12.0 : 0
  const expenseChange = expenses > 0 ? -8.0 : 0
  const savingsChange = savings >= 0 ? 15.0 : -10.0

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your financial overview</p>
      </div>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon blue">$</div>
            <div className={`stat-badge ${balanceChange >= 0 ? 'positive' : 'negative'}`}>
              {balanceChange >= 0 ? '+' : ''}{balanceChange.toFixed(1)}%
            </div>
          </div>
          <div className="stat-label">Total Balance</div>
          <div className="stat-value">${totalBalance.toLocaleString()}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon green">↗</div>
            <div className="stat-badge positive">
              +{incomeChange.toFixed(0)}%
            </div>
          </div>
          <div className="stat-label">Income</div>
          <div className="stat-value">${income.toLocaleString()}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon red">↙</div>
            <div className="stat-badge negative">
              {expenseChange.toFixed(0)}%
            </div>
          </div>
          <div className="stat-label">Expenses</div>
          <div className="stat-value">${expenses.toLocaleString()}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon purple">◆</div>
            <div className={`stat-badge ${savingsChange >= 0 ? 'positive' : 'negative'}`}>
              {savingsChange >= 0 ? '+' : ''}{savingsChange.toFixed(0)}%
            </div>
          </div>
          <div className="stat-label">Net Savings</div>
          <div className="stat-value">${savings.toLocaleString()}</div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="content-card slide-up">
        <div className="content-card-header">
          <h3 className="content-card-title">Recent Activity</h3>
          <p className="content-card-subtitle">Your latest transactions</p>
        </div>
        <div className="content-card-body">
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {transactions.slice(-5).reverse().map((transaction, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-6)',
                background: 'var(--color-surface-elevated)',
                borderRadius: 'var(--radius-large)',
                border: '1px solid var(--color-border)',
                transition: 'all 0.3s var(--ease-in-out)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: transaction.amount > 0 ? 'rgba(48, 209, 88, 0.15)' : 'var(--color-surface)',
                    borderRadius: 'var(--radius-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--font-size-body)',
                    color: transaction.amount > 0 ? 'var(--color-green)' : 'var(--color-text-primary)',
                    border: transaction.amount > 0 ? '1px solid rgba(48, 209, 88, 0.2)' : '1px solid var(--color-border)'
                  }}>
                    {transaction.amount > 0 ? '↗' : '↙'}
                  </div>
                  <div>
                    <div className="text-headline" style={{ marginBottom: 'var(--space-1)' }}>
                      {transaction.name}
                    </div>
                    <div className="text-caption-1">
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{
                  color: transaction.amount > 0 ? 'var(--color-green)' : 'var(--color-text-primary)',
                  fontWeight: '700',
                  fontSize: 'var(--font-size-body)'
                }}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-3" style={{ marginTop: 'var(--space-12)' }}>
        <button 
          className="btn btn-primary btn-large"
          onClick={() => setShowOnboarding(true)}
        >
          Add Transaction
        </button>
        <button 
          className="btn btn-secondary btn-large"
          onClick={() => window.location.href = '/dashboard/analytics'}
        >
          View Analytics
        </button>
        <button 
          className="btn btn-secondary btn-large"
          onClick={() => window.location.href = '/dashboard/insights'}
        >
          AI Insights
        </button>
      </div>

      {/* Show Add Transaction Modal */}
      {showOnboarding && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Onboarding onTransactionsAdded={(newTransactions) => {
              // Merge new transactions with existing ones
              const allTransactions = [...transactions, ...newTransactions]
              setTransactions(allTransactions)
              localStorage.setItem('finance-ai-transactions', JSON.stringify(allTransactions))
              setShowOnboarding(false)
            }} />
            <button
              onClick={() => setShowOnboarding(false)}
              className="modal-close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}