'use client'

import { useState, useEffect } from 'react'

interface Transaction {
  id: number
  name: string
  amount: number
  category: string
  date: string
}

export default function AnalyticsPage() {
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
        <div className="text-body">Loading your analytics...</div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="fade-in">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Analyze your spending patterns and financial trends</p>
        </div>

        {/* Empty State */}
        <div className="content-card">
          <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--color-blue) 0%, var(--color-blue-dark) 100%)',
              borderRadius: 'var(--radius-large)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-8) auto',
              fontSize: 'var(--font-size-title-2)',
              color: 'white',
              boxShadow: 'var(--shadow-medium)'
            }}>
              📊
            </div>
            <h2 className="text-title-2" style={{ marginBottom: 'var(--space-4)' }}>
              Analytics Awaiting Data
            </h2>
            <p className="text-body" style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-8)',
              maxWidth: '500px',
              margin: '0 auto var(--space-8) auto'
            }}>
              Add some transactions to see detailed analytics about your spending patterns, 
              category breakdowns, and financial trends.
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

  // Process real transaction data
  const expenses = transactions.filter(t => t.amount < 0)
  const income = transactions.filter(t => t.amount > 0)
  
  // Calculate category breakdown
  const categoryTotals: Record<string, number> = {}
  expenses.forEach(transaction => {
    const category = transaction.category || 'Other'
    categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(transaction.amount)
  })

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

  // Convert to spending data with colors
  const spendingData = Object.entries(categoryTotals).map(([category, amount], index) => {
    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#6b7280', '#ec4899', '#14b8a6']
    return {
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: colors[index % colors.length]
    }
  }).sort((a, b) => b.amount - a.amount)

  // Get top category
  const topCategory = spendingData[0]

  // Calculate monthly data (simplified - group by month)
  const monthlyData: Record<string, number> = {}
  transactions.forEach(transaction => {
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    const monthName = date.toLocaleDateString('en-US', { month: 'short' })
    
    if (transaction.amount < 0) {
      if (!monthlyData[monthName]) {
        monthlyData[monthName] = 0
      }
      monthlyData[monthName] += Math.abs(transaction.amount)
    }
  })

  const monthlyChartData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount
  })).slice(-6) // Last 6 months

  // Calculate stats
  const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Analytics</h1>
        <p style={{ color: '#94a3b8' }}>Analyze your spending patterns and financial trends</p>
      </div>
      
      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Spending</div>
          <div className="stat-value">${total.toLocaleString()}</div>
          <div className="stat-change positive">Based on {expenses.length} transactions</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Top Category</div>
          <div className="stat-value">{topCategory?.category || 'N/A'}</div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {topCategory?.percentage || 0}% of total spending
          </p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Savings Rate</div>
          <div className="stat-value">{savingsRate}%</div>
          <div className={`stat-change ${savingsRate >= 20 ? 'positive' : 'negative'}`}>
            {savingsRate >= 20 ? 'Great job!' : 'Room for improvement'}
          </div>
        </div>
      </div>
      
      {/* Charts */}
      {spendingData.length > 0 && (
        <div className="stat-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Spending by Category</h3>
          
          {/* Chart Container */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
            
            {/* Pie Chart (CSS-based) */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: spendingData.length > 1 ? `conic-gradient(
                  ${spendingData.map((item, index) => {
                    const startAngle = spendingData.slice(0, index).reduce((sum, prev) => sum + prev.percentage, 0) * 3.6
                    const endAngle = startAngle + (item.percentage * 3.6)
                    return `${item.color} ${startAngle}deg ${endAngle}deg`
                  }).join(', ')}
                )` : spendingData[0]?.color || '#3b82f6',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                {/* Center circle */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '120px',
                  height: '120px',
                  backgroundColor: '#1e293b',
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #334155'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                    ${total.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Total Spent
                  </div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {spendingData.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: '#374151',
                  borderRadius: '0.5rem',
                  border: '1px solid #4b5563'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: item.color,
                      borderRadius: '2px'
                    }} />
                    <span style={{ color: 'white', fontWeight: '500' }}>{item.category}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'white', fontWeight: '600' }}>
                      ${item.amount.toLocaleString()}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Bar Chart - Only show if we have monthly data */}
          {monthlyChartData.length > 0 && (
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #374151' }}>
              <h4 style={{ marginBottom: '1rem' }}>Monthly Spending Trend</h4>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${monthlyChartData.length}, 1fr)`, gap: '0.5rem', alignItems: 'end', height: '200px' }}>
                {monthlyChartData.map((data, index) => {
                  const maxAmount = Math.max(...monthlyChartData.map(d => d.amount))
                  const height = maxAmount > 0 ? (data.amount / maxAmount) * 160 : 10
                  
                  return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        ${(data.amount / 1000).toFixed(1)}k
                      </div>
                      <div style={{
                        width: '100%',
                        height: `${height}px`,
                        backgroundColor: '#3b82f6',
                        borderRadius: '4px 4px 0 0',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#2563eb'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#3b82f6'
                      }}
                      />
                      <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                        {data.month}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}