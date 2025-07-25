'use client'

import { useState } from 'react'

interface Transaction {
  id: number
  name: string
  amount: number
  category: string
  date: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, name: 'Grocery Shopping', amount: -85.50, category: 'Food', date: 'Today' },
    { id: 2, name: 'Salary Deposit', amount: 3200.00, category: 'Income', date: 'Yesterday' },
    { id: 3, name: 'Coffee Shop', amount: -12.50, category: 'Food', date: 'Yesterday' },
    { id: 4, name: 'Gas Station', amount: -65.00, category: 'Transportation', date: '2 days ago' }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    amount: '',
    category: 'Food'
  })

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newTransaction.name && newTransaction.amount) {
      const transaction: Transaction = {
        id: Date.now(),
        name: newTransaction.name,
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        date: 'Just now'
      }
      
      setTransactions([transaction, ...transactions])
      setNewTransaction({ name: '', amount: '', category: 'Food' })
      setShowAddForm(false)
    }
  }

  return (
    <div>
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
      <div className="stat-card">
        <h3 style={{ marginBottom: '1rem' }}>
          Recent Transactions ({transactions.length})
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
                  {transaction.category} • {transaction.date}
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
                onClick={() => setTransactions(transactions.filter(t => t.id !== transaction.id))}
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
    </div>
  )
}