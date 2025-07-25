'use client'

import { useState, useEffect } from 'react'

interface Transaction {
  id: number
  name: string
  amount: number
  category: string
  date: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining'
  })

  // Comprehensive categories for expenses
  const expenseCategories = [
    'Food & Dining',
    'Groceries', 
    'Restaurants',
    'Coffee & Snacks',
    'Transportation',
    'Gas & Fuel',
    'Public Transit',
    'Uber & Lyft',
    'Parking',
    'Car Maintenance',
    'Housing',
    'Rent',
    'Mortgage',
    'Property Tax',
    'Home Insurance',
    'Utilities',
    'Electricity',
    'Water',
    'Internet',
    'Phone',
    'Gas Bill',
    'Entertainment',
    'Movies',
    'Streaming Services',
    'Games',
    'Books',
    'Music',
    'Shopping',
    'Clothing',
    'Electronics',
    'Home & Garden',
    'Personal Care',
    'Gifts',
    'Healthcare',
    'Doctor Visits',
    'Pharmacy',
    'Dental',
    'Vision',
    'Health Insurance',
    'Fitness',
    'Gym Membership',
    'Sports',
    'Education',
    'Tuition',
    'Books & Supplies',
    'Online Courses',
    'Professional',
    'Business Expenses',
    'Office Supplies',
    'Software',
    'Professional Services',
    'Financial',
    'Bank Fees',
    'Credit Card Fees',
    'Investment Fees',
    'Insurance',
    'Travel',
    'Flights',
    'Hotels',
    'Vacation',
    'Travel Insurance',
    'Family',
    'Childcare',
    'Pet Care',
    'Miscellaneous',
    'Cash Withdrawal',
    'Donations',
    'Taxes',
    'Other'
  ]

  // Comprehensive categories for income
  const incomeCategories = [
    'Salary',
    'Hourly Wages',
    'Overtime',
    'Bonus',
    'Commission',
    'Freelance',
    'Consulting',
    'Contract Work',
    'Business Income',
    'Self Employment',
    'Side Hustle',
    'Investments',
    'Dividends',
    'Interest',
    'Capital Gains',
    'Rental Income',
    'Royalties',
    'Government',
    'Tax Refund',
    'Social Security',
    'Unemployment',
    'Disability',
    'Child Support',
    'Alimony',
    'Other Income',
    'Gift Money',
    'Cash Gift',
    'Inheritance',
    'Lottery',
    'Rebate',
    'Refund',
    'Reimbursement',
    'Cashback',
    'Reward Points',
    'Found Money',
    'Miscellaneous Income'
  ]

  const getCurrentCategories = () => {
    return newTransaction.type === 'income' ? incomeCategories : expenseCategories
  }

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

  // Update category when type changes
  useEffect(() => {
    const categories = getCurrentCategories()
    if (!categories.includes(newTransaction.category)) {
      setNewTransaction(prev => ({
        ...prev,
        category: categories[0]
      }))
    }
  }, [newTransaction.type])

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newTransaction.name && newTransaction.amount) {
      // Calculate the correct amount based on type
      let amount = Math.abs(parseFloat(newTransaction.amount))
      
      // Make expenses negative, keep income positive
      if (newTransaction.type === 'expense') {
        amount = -amount
      }
      
      const transaction: Transaction = {
        id: Date.now(),
        name: newTransaction.name,
        amount: amount,
        category: newTransaction.category,
        date: new Date().toISOString().split('T')[0]
      }
      
      const updatedTransactions = [transaction, ...transactions]
      setTransactions(updatedTransactions)
      
      // Save to localStorage
      localStorage.setItem('finance-ai-transactions', JSON.stringify(updatedTransactions))
      
      setNewTransaction({ name: '', amount: '', type: 'expense', category: 'Food & Dining' })
      setShowAddForm(false)
    }
  }

  const handleDeleteTransaction = (id: number) => {
    const updatedTransactions = transactions.filter(t => t.id !== id)
    setTransactions(updatedTransactions)
    
    // Update localStorage
    localStorage.setItem('finance-ai-transactions', JSON.stringify(updatedTransactions))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      const diffTime = Math.abs(today.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays < 7) {
        return `${diffDays} days ago`
      } else {
        return date.toLocaleDateString()
      }
    }
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="text-body">Loading your transactions...</div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Transactions</h1>
        <p style={{ color: '#94a3b8' }}>Track and manage your financial transactions</p>
      </div>
      
      {/* Add Transaction Button */}
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            backgroundColor: showAddForm ? '#ef4444' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
        >
          {showAddForm ? '✕ Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {/* Add Transaction Form */}
      {showAddForm && (
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add New Transaction</h3>
          <form onSubmit={handleAddTransaction} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: '#94a3b8'
              }}>
                Description
              </label>
              <input
                type="text"
                value={newTransaction.name}
                onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
                placeholder="Enter transaction description"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            
            {/* Type Selector */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: '#94a3b8'
              }}>
                Type
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '2px solid',
                    borderColor: newTransaction.type === 'expense' ? '#ef4444' : '#4b5563',
                    borderRadius: '0.5rem',
                    backgroundColor: newTransaction.type === 'expense' ? 'rgba(239, 68, 68, 0.1)' : '#374151',
                    color: newTransaction.type === 'expense' ? '#ef4444' : '#94a3b8',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  💸 Expense
                </button>
                <button
                  type="button"
                  onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '2px solid',
                    borderColor: newTransaction.type === 'income' ? '#10b981' : '#4b5563',
                    borderRadius: '0.5rem',
                    backgroundColor: newTransaction.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : '#374151',
                    color: newTransaction.type === 'income' ? '#10b981' : '#94a3b8',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  💰 Income
                </button>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: '#94a3b8'
                }}>
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  placeholder="0.00"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '0.875rem'
                  }}
                />
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280', 
                  marginTop: '0.25rem',
                  fontStyle: 'italic'
                }}>
                  Enter positive amount only
                </p>
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: '#94a3b8'
                }}>
                  Category
                </label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '0.875rem'
                  }}
                >
                  {getCurrentCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280', 
                  marginTop: '0.25rem',
                  fontStyle: 'italic'
                }}>
                  Categories change based on {newTransaction.type} type
                </p>
              </div>
            </div>
            
            <button
              type="submit"
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Add Transaction
            </button>
          </form>
        </div>
      )}
      
      {/* Transactions List */}
      {transactions.length > 0 ? (
        <div className="stat-card">
          <h3 style={{ marginBottom: '1rem' }}>
            Your Transactions ({transactions.length})
          </h3>
          
          {transactions.map((transaction, index) => (
            <div key={transaction.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 0',
              borderBottom: index < transactions.length - 1 ? '1px solid #374151' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: transaction.amount > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: transaction.amount > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem'
                }}>
                  {transaction.amount > 0 ? '💰' : '💸'}
                </div>
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{transaction.name}</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  color: transaction.amount > 0 ? '#10b981' : '#ef4444',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </div>
                <button
                  onClick={() => handleDeleteTransaction(transaction.id)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    fontSize: '1rem',
                    borderRadius: '0.25rem',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  title="Delete transaction"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="stat-card">
          <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
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
              💳
            </div>
            <h3 style={{ marginBottom: '1rem' }}>No Transactions Yet</h3>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              Start by adding your first transaction to begin tracking your finances with AI insights.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              Add First Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  )
}