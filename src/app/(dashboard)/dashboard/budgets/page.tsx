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
  id: number
  category: string
  allocated: number
  spent: number
}

export default function BudgetsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [newBudget, setNewBudget] = useState({
    category: 'Food & Dining',
    allocated: ''
  })

  // Comprehensive expense categories for budgets (only expenses need budgets)
  const availableCategories = [
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

  useEffect(() => {
    // Load data from localStorage
    const loadData = () => {
      const savedTransactions = localStorage.getItem('finance-ai-transactions')
      const savedBudgets = localStorage.getItem('finance-ai-budgets')
      
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions))
      }
      
      if (savedBudgets) {
        setBudgets(JSON.parse(savedBudgets))
      }
      
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Calculate spending for each budget
  const calculateBudgetSpending = () => {
    return budgets.map(budget => {
      const categoryExpenses = transactions
        .filter(t => t.amount < 0 && t.category === budget.category)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      return {
        ...budget,
        spent: categoryExpenses
      }
    })
  }

  const budgetsWithSpending = calculateBudgetSpending()

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newBudget.category && newBudget.allocated) {
      // Check if budget for this category already exists
      const existingBudget = budgets.find(b => b.category === newBudget.category)
      if (existingBudget) {
        alert('Budget for this category already exists. Edit the existing one instead.')
        return
      }

      const budget: Budget = {
        id: Date.now(),
        category: newBudget.category,
        allocated: parseFloat(newBudget.allocated),
        spent: 0
      }
      
      const updatedBudgets = [...budgets, budget]
      setBudgets(updatedBudgets)
      localStorage.setItem('finance-ai-budgets', JSON.stringify(updatedBudgets))
      
      setNewBudget({ category: 'Food & Dining', allocated: '' })
      setShowAddForm(false)
    }
  }

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget)
    setNewBudget({
      category: budget.category,
      allocated: budget.allocated.toString()
    })
    setShowAddForm(true)
  }

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingBudget && newBudget.allocated) {
      const updatedBudgets = budgets.map(b => 
        b.id === editingBudget.id 
          ? { ...b, allocated: parseFloat(newBudget.allocated) }
          : b
      )
      
      setBudgets(updatedBudgets)
      localStorage.setItem('finance-ai-budgets', JSON.stringify(updatedBudgets))
      
      setEditingBudget(null)
      setNewBudget({ category: 'Food & Dining', allocated: '' })
      setShowAddForm(false)
    }
  }

  const handleDeleteBudget = (id: number) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      const updatedBudgets = budgets.filter(b => b.id !== id)
      setBudgets(updatedBudgets)
      localStorage.setItem('finance-ai-budgets', JSON.stringify(updatedBudgets))
    }
  }

  const cancelEdit = () => {
    setEditingBudget(null)
    setNewBudget({ category: 'Food & Dining', allocated: '' })
    setShowAddForm(false)
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="text-body">Loading your budgets...</div>
      </div>
    )
  }

  const totalBudgeted = budgetsWithSpending.reduce((sum, budget) => sum + budget.allocated, 0)
  const totalSpent = budgetsWithSpending.reduce((sum, budget) => sum + budget.spent, 0)
  const remaining = totalBudgeted - totalSpent

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Budgets</h1>
        <p style={{ color: '#94a3b8' }}>Set and track your spending limits</p>
      </div>
      
      {/* Add Budget Button */}
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
          {showAddForm ? '✕ Cancel' : '+ Add Budget'}
        </button>
      </div>

      {/* Add/Edit Budget Form */}
      {showAddForm && (
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>
            {editingBudget ? 'Edit Budget' : 'Add New Budget'}
          </h3>
          <form onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  disabled={!!editingBudget} // Disable category editing
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: editingBudget ? '#2d3748' : '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '0.5rem',
                    color: editingBudget ? '#94a3b8' : 'white',
                    fontSize: '0.875rem',
                    cursor: editingBudget ? 'not-allowed' : 'pointer'
                  }}
                >
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {editingBudget && (
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: '#6b7280', 
                    marginTop: '0.25rem',
                    fontStyle: 'italic'
                  }}>
                    Category cannot be changed when editing
                  </p>
                )}
                {!editingBudget && (
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: '#6b7280', 
                    marginTop: '0.25rem',
                    fontStyle: 'italic'
                  }}>
                    Choose from {availableCategories.length} expense categories
                  </p>
                )}
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: '#94a3b8'
                }}>
                  Monthly Budget ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newBudget.allocated}
                  onChange={(e) => setNewBudget({ ...newBudget, allocated: e.target.value })}
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
                  Set your monthly spending limit for this category
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                {editingBudget ? 'Update Budget' : 'Add Budget'}
              </button>
              {editingBudget && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      
      {/* Budget Overview */}
      {budgetsWithSpending.length > 0 && (
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-label">Total Budgeted</div>
            <div className="stat-value">${totalBudgeted.toLocaleString()}</div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Across {budgetsWithSpending.length} categor{budgetsWithSpending.length === 1 ? 'y' : 'ies'}
            </p>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Spent</div>
            <div className="stat-value">${totalSpent.toLocaleString()}</div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {totalBudgeted > 0 ? `${Math.round((totalSpent / totalBudgeted) * 100)}% of budget used` : 'No budget set'}
            </p>
          </div>
          <div className="stat-card">
            <div className="stat-label">Remaining</div>
            <div className="stat-value" style={{ color: remaining >= 0 ? '#10b981' : '#ef4444' }}>
              ${remaining.toLocaleString()}
            </div>
            <p style={{ 
              color: remaining >= 0 ? '#10b981' : '#ef4444', 
              fontSize: '0.875rem', 
              marginTop: '0.5rem',
              fontWeight: '500'
            }}>
              {remaining >= 0 ? 'Under budget' : 'Over budget'}
            </p>
          </div>
        </div>
      )}
      
      {/* Budget List */}
      {budgetsWithSpending.length > 0 ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {budgetsWithSpending.map((budget, index) => {
            const percentage = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0
            const isOverBudget = percentage > 100
            
            return (
              <div key={budget.id} className="stat-card">
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditBudget(budget)}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#3b82f6',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          fontSize: '0.875rem',
                          borderRadius: '0.25rem'
                        }}
                        title="Edit budget"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(budget.id)}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                        title="Delete budget"
                      >
                        🗑️
                      </button>
                    </div>
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
          <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
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
            <h3 style={{ marginBottom: '1rem' }}>No Budgets Set</h3>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              Create your first budget from our {availableCategories.length} expense categories to start tracking your spending limits and financial goals.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              Create First Budget
            </button>
          </div>
        </div>
      )}
    </div>
  )
}