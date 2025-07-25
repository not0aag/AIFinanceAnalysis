'use client'

import { useState, useEffect } from 'react'

interface Transaction {
  id: number
  name: string
  amount: number
  category: string
  date: string
}

interface OnboardingProps {
  onTransactionsAdded: (transactions: Transaction[]) => void
}

export default function Onboarding({ onTransactionsAdded }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentTransaction, setCurrentTransaction] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
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
    return currentTransaction.type === 'income' ? incomeCategories : expenseCategories
  }

  // Update category when type changes
  useEffect(() => {
    const categories = getCurrentCategories()
    if (!categories.includes(currentTransaction.category)) {
      setCurrentTransaction(prev => ({
        ...prev,
        category: categories[0]
      }))
    }
  }, [currentTransaction.type])

  const addTransaction = () => {
    if (!currentTransaction.name || !currentTransaction.amount) {
      alert('Please fill in all fields')
      return
    }

    // Calculate the correct amount based on type
    let amount = Math.abs(parseFloat(currentTransaction.amount))
    if (currentTransaction.type === 'expense') {
      amount = -amount // Make expenses negative
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      name: currentTransaction.name,
      amount: amount,
      category: currentTransaction.category,
      date: currentTransaction.date
    }

    const updatedTransactions = [...transactions, newTransaction]
    setTransactions(updatedTransactions)
    
    // Reset form
    setCurrentTransaction({
      name: '',
      amount: '',
      type: 'expense',
      category: 'Food & Dining',
      date: new Date().toISOString().split('T')[0]
    })

    // Move to next step if this is their first transaction
    if (transactions.length === 0) {
      setStep(2)
    }
  }

  const removeTransaction = (id: number) => {
    const updatedTransactions = transactions.filter(t => t.id !== id)
    setTransactions(updatedTransactions)
    
    // If they remove all transactions and are on step 2 or 3, go back to step 1
    if (updatedTransactions.length === 0 && step > 1) {
      setStep(1)
    }
  }

  const handleFinish = () => {
    if (transactions.length === 0) {
      alert('Please add at least one transaction to get started')
      return
    }
    onTransactionsAdded(transactions)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        {/* Progress Indicator */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: 'var(--space-12)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-size-footnote)',
                  fontWeight: '600',
                  transition: 'all 0.3s var(--ease-in-out)',
                  background: step >= stepNumber ? 'var(--color-blue)' : 'var(--color-surface-elevated)',
                  color: step >= stepNumber ? 'white' : 'var(--color-text-secondary)',
                  border: step >= stepNumber ? 'none' : '1px solid var(--color-border)'
                }}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div style={{
                    width: '48px',
                    height: '2px',
                    background: step > stepNumber ? 'var(--color-blue)' : 'var(--color-border)',
                    transition: 'all 0.3s var(--ease-in-out)'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h1 style={{
                fontSize: 'var(--font-size-large-title)',
                fontWeight: '300',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-4)',
                lineHeight: '1.2'
              }}>
                Welcome to your
                <br />
                <span style={{
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, var(--color-blue) 0%, var(--color-purple) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Finance AI
                </span>
              </h1>
              <p style={{
                fontSize: 'var(--font-size-title-3)',
                color: 'var(--color-text-secondary)',
                maxWidth: '400px',
                margin: '0 auto',
                lineHeight: '1.4'
              }}>
                Let's get started by adding your first transaction. This helps us understand your financial patterns.
              </p>
            </div>

            <div className="content-card" style={{ 
              maxWidth: '500px', 
              margin: '0 auto',
              textAlign: 'left'
            }}>
              <div className="content-card-body">
                <h2 style={{
                  fontSize: 'var(--font-size-title-2)',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-6)',
                  textAlign: 'center'
                }}>
                  Add Your First Transaction
                </h2>
                
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Description</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="e.g., Salary, Groceries, Coffee"
                      value={currentTransaction.name}
                      onChange={(e) => setCurrentTransaction({...currentTransaction, name: e.target.value})}
                    />
                  </div>

                  {/* Type Selector */}
                  <div className="input-group">
                    <label className="input-label">Type</label>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                      <button
                        type="button"
                        onClick={() => setCurrentTransaction({...currentTransaction, type: 'expense'})}
                        style={{
                          flex: 1,
                          padding: 'var(--space-4)',
                          border: '2px solid',
                          borderColor: currentTransaction.type === 'expense' ? 'var(--color-red)' : 'var(--color-border)',
                          borderRadius: 'var(--radius-medium)',
                          backgroundColor: currentTransaction.type === 'expense' ? 'rgba(255, 59, 48, 0.1)' : 'var(--color-surface-elevated)',
                          color: currentTransaction.type === 'expense' ? 'var(--color-red)' : 'var(--color-text-secondary)',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: 'var(--font-size-callout)'
                        }}
                      >
                        💸 Expense
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentTransaction({...currentTransaction, type: 'income'})}
                        style={{
                          flex: 1,
                          padding: 'var(--space-4)',
                          border: '2px solid',
                          borderColor: currentTransaction.type === 'income' ? 'var(--color-green)' : 'var(--color-border)',
                          borderRadius: 'var(--radius-medium)',
                          backgroundColor: currentTransaction.type === 'income' ? 'rgba(48, 209, 88, 0.1)' : 'var(--color-surface-elevated)',
                          color: currentTransaction.type === 'income' ? 'var(--color-green)' : 'var(--color-text-secondary)',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: 'var(--font-size-callout)'
                        }}
                      >
                        💰 Income
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="input-group">
                      <label className="input-label">Amount</label>
                      <input
                        className="input"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={currentTransaction.amount}
                        onChange={(e) => setCurrentTransaction({...currentTransaction, amount: e.target.value})}
                      />
                      <p style={{ 
                        fontSize: 'var(--font-size-caption-2)', 
                        color: 'var(--color-text-tertiary)', 
                        marginTop: 'var(--space-1)',
                        fontStyle: 'italic'
                      }}>
                        Enter positive amount
                      </p>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Category</label>
                      <select
                        className="input"
                        value={currentTransaction.category}
                        onChange={(e) => setCurrentTransaction({...currentTransaction, category: e.target.value})}
                      >
                        {getCurrentCategories().map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <p style={{ 
                        fontSize: 'var(--font-size-caption-2)', 
                        color: 'var(--color-text-tertiary)', 
                        marginTop: 'var(--space-1)',
                        fontStyle: 'italic'
                      }}>
                        Categories change based on type
                      </p>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Date</label>
                    <input
                      className="input"
                      type="date"
                      value={currentTransaction.date}
                      onChange={(e) => setCurrentTransaction({...currentTransaction, date: e.target.value})}
                    />
                  </div>
                </div>

                <button
                  onClick={addTransaction}
                  className="btn btn-primary btn-large"
                  style={{ 
                    width: '100%',
                    marginTop: 'var(--space-6)'
                  }}
                >
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Add More */}
        {step === 2 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(48, 209, 88, 0.15)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4) auto',
                border: '1px solid rgba(48, 209, 88, 0.2)'
              }}>
                <svg style={{ width: '32px', height: '32px', color: 'var(--color-green)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 style={{
                fontSize: 'var(--font-size-large-title)',
                fontWeight: '300',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-4)'
              }}>
                Great start!
              </h2>
              <p style={{
                fontSize: 'var(--font-size-title-3)',
                color: 'var(--color-text-secondary)',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                You've added {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}. Add a few more to get better AI insights.
              </p>
            </div>

            <div className="content-card" style={{ 
              maxWidth: '500px', 
              margin: '0 auto var(--space-8) auto',
              textAlign: 'left'
            }}>
              <div className="content-card-body">
                <h3 style={{
                  fontSize: 'var(--font-size-title-3)',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-6)',
                  textAlign: 'center'
                }}>
                  Add Another Transaction
                </h3>
                
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                  <input
                    className="input"
                    type="text"
                    placeholder="Transaction description"
                    value={currentTransaction.name}
                    onChange={(e) => setCurrentTransaction({...currentTransaction, name: e.target.value})}
                  />

                  {/* Type Selector for Step 2 */}
                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentTransaction({...currentTransaction, type: 'expense'})}
                      style={{
                        flex: 1,
                        padding: 'var(--space-3)',
                        border: '2px solid',
                        borderColor: currentTransaction.type === 'expense' ? 'var(--color-red)' : 'var(--color-border)',
                        borderRadius: 'var(--radius-medium)',
                        backgroundColor: currentTransaction.type === 'expense' ? 'rgba(255, 59, 48, 0.1)' : 'var(--color-surface-elevated)',
                        color: currentTransaction.type === 'expense' ? 'var(--color-red)' : 'var(--color-text-secondary)',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: 'var(--font-size-footnote)'
                      }}
                    >
                      💸 Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentTransaction({...currentTransaction, type: 'income'})}
                      style={{
                        flex: 1,
                        padding: 'var(--space-3)',
                        border: '2px solid',
                        borderColor: currentTransaction.type === 'income' ? 'var(--color-green)' : 'var(--color-border)',
                        borderRadius: 'var(--radius-medium)',
                        backgroundColor: currentTransaction.type === 'income' ? 'rgba(48, 209, 88, 0.1)' : 'var(--color-surface-elevated)',
                        color: currentTransaction.type === 'income' ? 'var(--color-green)' : 'var(--color-text-secondary)',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: 'var(--font-size-footnote)'
                      }}
                    >
                      💰 Income
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div>
                      <input
                        className="input"
                        type="number"
                        step="0.01"
                        placeholder="Amount"
                        value={currentTransaction.amount}
                        onChange={(e) => setCurrentTransaction({...currentTransaction, amount: e.target.value})}
                      />
                      <p style={{ 
                        fontSize: 'var(--font-size-caption-2)', 
                        color: 'var(--color-text-tertiary)', 
                        marginTop: 'var(--space-1)',
                        fontStyle: 'italic'
                      }}>
                        Enter positive amount
                      </p>
                    </div>

                    <div>
                      <select
                        className="input"
                        value={currentTransaction.category}
                        onChange={(e) => setCurrentTransaction({...currentTransaction, category: e.target.value})}
                      >
                        {getCurrentCategories().map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--space-3)', 
                  marginTop: 'var(--space-6)' 
                }}>
                  <button
                    onClick={addTransaction}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Add Another
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>

            {/* Current Transactions */}
            <div className="content-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <div className="content-card-header">
                <h4 className="content-card-title">Your Transactions</h4>
                <p className="content-card-subtitle">Click the × to remove any transaction</p>
              </div>
              <div className="content-card-body">
                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                  {transactions.map((transaction) => (
                    <div key={transaction.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-4)',
                      background: 'var(--color-surface-elevated)',
                      borderRadius: 'var(--radius-medium)',
                      border: '1px solid var(--color-border)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ 
                          fontSize: 'var(--font-size-callout)',
                          filter: 'grayscale(0)'
                        }}>
                          {transaction.amount > 0 ? '💰' : '💸'}
                        </span>
                        <div>
                          <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{transaction.name}</span>
                          <div style={{ 
                            fontSize: 'var(--font-size-caption-1)', 
                            color: 'var(--color-text-secondary)' 
                          }}>
                            {transaction.category}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{
                          fontWeight: '600',
                          color: transaction.amount > 0 ? 'var(--color-green)' : 'var(--color-red)'
                        }}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeTransaction(transaction.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-red)',
                            cursor: 'pointer',
                            padding: 'var(--space-2)',
                            borderRadius: 'var(--radius-small)',
                            fontSize: 'var(--font-size-callout)',
                            fontWeight: '600',
                            transition: 'all 0.2s var(--ease-in-out)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none'
                          }}
                          title="Remove transaction"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Finish */}
        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, var(--color-blue) 0%, var(--color-purple) 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4) auto',
                boxShadow: 'var(--shadow-medium)'
              }}>
                <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 style={{
                fontSize: 'var(--font-size-large-title)',
                fontWeight: '300',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-4)'
              }}>
                You're all set!
              </h2>
              <p style={{
                fontSize: 'var(--font-size-title-3)',
                color: 'var(--color-text-secondary)',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                Your Finance AI is ready to analyze your {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} and provide personalized insights.
              </p>
            </div>

            <div className="content-card" style={{ maxWidth: '500px', margin: '0 auto var(--space-6) auto' }}>
              <div className="content-card-body">
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: 'var(--font-size-title-2)',
                      fontWeight: '700',
                      color: 'var(--color-blue)',
                      marginBottom: 'var(--space-1)'
                    }}>
                      {transactions.filter(t => t.amount > 0).length}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-footnote)', color: 'var(--color-text-secondary)' }}>
                      Income Sources
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: 'var(--font-size-title-2)',
                      fontWeight: '700',
                      color: 'var(--color-red)',
                      marginBottom: 'var(--space-1)'
                    }}>
                      {transactions.filter(t => t.amount < 0).length}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-footnote)', color: 'var(--color-text-secondary)' }}>
                      Expenses
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: 'var(--font-size-title-2)',
                      fontWeight: '700',
                      color: 'var(--color-green)',
                      marginBottom: 'var(--space-1)'
                    }}>
                      ${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-footnote)', color: 'var(--color-text-secondary)' }}>
                      Net Balance
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="btn btn-primary btn-large"
                  style={{ 
                    width: '100%',
                    background: 'linear-gradient(135deg, var(--color-blue) 0%, var(--color-purple) 100%)',
                    marginBottom: 'var(--space-4)'
                  }}
                >
                  Enter Your Dashboard
                </button>
              </div>
            </div>

            {/* Edit Transactions Option */}
            <div className="content-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <div className="content-card-header">
                <h4 className="content-card-title">Review Your Transactions</h4>
                <p className="content-card-subtitle">Click the × to remove any transaction</p>
              </div>
              <div className="content-card-body">
                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                  {transactions.map((transaction) => (
                    <div key={transaction.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-4)',
                      background: 'var(--color-surface-elevated)',
                      borderRadius: 'var(--radius-medium)',
                      border: '1px solid var(--color-border)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ 
                          fontSize: 'var(--font-size-callout)',
                          filter: 'grayscale(0)'
                        }}>
                          {transaction.amount > 0 ? '💰' : '💸'}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{transaction.name}</span>
                          <span style={{
                            fontSize: 'var(--font-size-caption-1)',
                            color: 'var(--color-text-secondary)'
                          }}>
                            {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{
                          fontWeight: '600',
                          color: transaction.amount > 0 ? 'var(--color-green)' : 'var(--color-red)'
                        }}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeTransaction(transaction.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-red)',
                            cursor: 'pointer',
                            padding: 'var(--space-2)',
                            borderRadius: 'var(--radius-small)',
                            fontSize: 'var(--font-size-callout)',
                            fontWeight: '600',
                            transition: 'all 0.2s var(--ease-in-out)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none'
                          }}
                          title="Remove transaction"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {transactions.length > 0 && (
                  <button
                    onClick={() => setStep(2)}
                    className="btn btn-secondary"
                    style={{ 
                      width: '100%',
                      marginTop: 'var(--space-6)'
                    }}
                  >
                    Add More Transactions
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}