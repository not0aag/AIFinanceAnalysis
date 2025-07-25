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
    category: 'Food'
  })

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

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newTransaction.name && newTransaction.amount) {
      const transaction: Transaction = {
        id: Date.now(),
        name: newTransaction.name,
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        date: new Date().toISOString().split('T')[0]
      }
      
      const updatedTransactions = [transaction, ...transactions]
      setTransactions(updatedTransactions)
      
      // Save to localStorage
      localStorage.setItem('finance-ai-transactions', JSON.stringify(updatedTransactions))
      
      setNewTransaction({ name: '', amount: '', category: 'Food' })
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
                  placeholder="0.00 (use negative for expenses)"
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
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Income">Income</option>
                  <option value="Other">Other</option>
                </select>
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
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: transaction.amount > 0 ? '#10b981' : '#ef4444',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem'
                }}>
                  {transaction.amount > 0 ? '↗️' : '↙️'}
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
                    fontSize: '0.875rem'
                  }}
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