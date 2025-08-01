'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Transaction } from '@/types/finance'
import TransactionForm from '@/components/transactions/TransactionForm'
import TransactionList from '@/components/transactions/TransactionList'
import TransactionFilters from '@/components/transactions/TransactionFilters'
import TransactionSearch from '@/components/transactions/TransactionSearch'
import TransactionStats from '@/components/transactions/TransactionStats'
import BulkImport from '@/components/transactions/BulkImport'
import { validateTransaction } from '@/lib/validation'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'income' | 'expense',
    category: 'all',
    dateRange: 'all' as 'all' | 'week' | 'month' | 'year' | 'custom',
    customDateRange: {
      start: '',
      end: ''
    },
    minAmount: '',
    maxAmount: '',
    tags: [] as string[]
  })
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<'delete' | 'categorize' | 'tag' | null>(null)

  // Load transactions
  useEffect(() => {
    const loadTransactions = () => {
      const savedTransactions = localStorage.getItem('finance-ai-transactions')
      
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions)
        const typedTransactions: Transaction[] = parsed.map((t: any) => ({
          ...t,
          id: t.id?.toString() || Date.now().toString(),
          userId: t.userId || 'user-1',
          // Preserve the original type and amount as they are correctly set
          type: t.type || (t.amount > 0 ? 'income' : 'expense'),
          // Keep the original amount - sample data already has correct signs
          amount: t.amount,
          createdAt: t.createdAt || t.date,
          updatedAt: t.updatedAt || t.date,
          tags: t.tags || [],
          isVerified: t.isVerified || false
        }))
        setTransactions(typedTransactions)
      }
      
      setIsLoading(false)
    }

    loadTransactions()
  }, [])

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.merchant?.toLowerCase().includes(query) ||
        t.notes?.toLowerCase().includes(query) ||
        t.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type)
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category)
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const startOfDay = (date: Date) => {
        date.setHours(0, 0, 0, 0)
        return date
      }

      let startDate: Date
      let endDate = new Date()

      switch (filters.dateRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        case 'custom':
          if (filters.customDateRange.start && filters.customDateRange.end) {
            startDate = new Date(filters.customDateRange.start)
            endDate = new Date(filters.customDateRange.end)
          } else {
            startDate = new Date(0)
          }
          break
        default:
          startDate = new Date(0)
      }

      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate >= startOfDay(startDate) && transactionDate <= endDate
      })
    }

    // Amount filter
    if (filters.minAmount) {
      const min = parseFloat(filters.minAmount)
      filtered = filtered.filter(t => Math.abs(t.amount) >= min)
    }
    if (filters.maxAmount) {
      const max = parseFloat(filters.maxAmount)
      filtered = filtered.filter(t => Math.abs(t.amount) <= max)
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(t => 
        t.tags?.some(tag => filters.tags.includes(tag))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount)
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [transactions, searchQuery, filters, sortBy, sortOrder])

  // Transaction management
  const handleAddTransaction = useCallback(async (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Validate transaction
      const validation = validateTransaction(transactionData)
      if (!validation.isValid) {
        alert(validation.errors.join('\n'))
        return
      }

      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const updated = [...transactions, newTransaction]
      setTransactions(updated)
      localStorage.setItem('finance-ai-transactions', JSON.stringify(updated))
      
      setShowForm(false)
    } catch (error) {
      console.error('Error adding transaction:', error)
      alert('Failed to add transaction')
    }
  }, [transactions])

  const handleUpdateTransaction = useCallback(async (updatedTransaction: Transaction) => {
    try {
      const validation = validateTransaction(updatedTransaction)
      if (!validation.isValid) {
        alert(validation.errors.join('\n'))
        return
      }

      const updated = transactions.map(t => 
        t.id === updatedTransaction.id 
          ? { ...updatedTransaction, updatedAt: new Date().toISOString() }
          : t
      )
      
      setTransactions(updated)
      localStorage.setItem('finance-ai-transactions', JSON.stringify(updated))
      
      setEditingTransaction(null)
      setShowForm(false)
    } catch (error) {
      console.error('Error updating transaction:', error)
      alert('Failed to update transaction')
    }
  }, [transactions])

  const handleDeleteTransaction = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      const updated = transactions.filter(t => t.id !== id)
      setTransactions(updated)
      localStorage.setItem('finance-ai-transactions', JSON.stringify(updated))
    }
  }, [transactions])

  const handleBulkDelete = useCallback(() => {
    if (selectedTransactions.size === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedTransactions.size} transactions?`)) {
      const updated = transactions.filter(t => !selectedTransactions.has(t.id))
      setTransactions(updated)
      localStorage.setItem('finance-ai-transactions', JSON.stringify(updated))
      setSelectedTransactions(new Set())
      setBulkAction(null)
    }
  }, [transactions, selectedTransactions])

  const handleBulkImport = useCallback((importedTransactions: Transaction[]) => {
    const updated = [...transactions, ...importedTransactions]
    setTransactions(updated)
    localStorage.setItem('finance-ai-transactions', JSON.stringify(updated))
    setShowBulkImport(false)
  }, [transactions])

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="text-body">Loading your transactions...</div>
      </div>
    )
  }

  return (
    <motion.div 
      className="fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Enhanced Header with Better Visual Hierarchy */}
      <motion.div 
        className="page-header"
        style={{ marginBottom: 'var(--space-12)' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="content-card" style={{ 
          background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-secondary) 100%)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-medium)'
        }}>
          <div className="content-card-body" style={{ padding: 'var(--space-10)' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 'var(--space-6)',
              marginBottom: 'var(--space-8)'
            }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h1 className="page-title" style={{ 
                    background: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-green) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: 'var(--space-3)'
                  }}>
                    💳 Transactions
                  </h1>
                  <p className="page-subtitle" style={{ 
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5
                  }}>
                    Track and manage your financial activity with AI-powered insights
                  </p>
                </motion.div>
              </div>
              
              <motion.div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  flexWrap: 'wrap'
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div style={{ 
                  background: 'var(--color-green)',
                  color: 'white',
                  padding: 'var(--space-3) var(--space-6)',
                  borderRadius: 'var(--radius-large)',
                  boxShadow: 'var(--shadow-small)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Total Transactions</span>
                  <span style={{ 
                    background: 'rgba(255,255,255,0.2)',
                    padding: 'var(--space-1) var(--space-3)',
                    borderRadius: 'var(--radius-medium)',
                    fontSize: '16px',
                    fontWeight: '700'
                  }}>
                    {transactions.length}
                  </span>
                </div>
              </motion.div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid var(--color-border)'
            }}>
              <motion.div 
                style={{ 
                  background: 'var(--color-surface-secondary)',
                  padding: 'var(--space-4) var(--space-6)',
                  borderRadius: 'var(--radius-medium)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)'
                }}
                whileHover={{ scale: 1.02 }}
              >
                <span style={{ fontSize: '18px' }}>🔍</span>
                <span className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                  Showing <strong style={{ color: 'var(--color-text-primary)' }}>{filteredTransactions.length}</strong> of <strong style={{ color: 'var(--color-text-primary)' }}>{transactions.length}</strong> transactions
                </span>
              </motion.div>
              
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <motion.button
                  className="btn btn-secondary"
                  onClick={() => setShowBulkImport(true)}
                  whileHover={{ scale: 1.05, boxShadow: 'var(--shadow-medium)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontSize: '15px',
                    fontWeight: '600'
                  }}
                >
                  📥 Import
                </motion.button>
                <motion.button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingTransaction(null)
                    setShowForm(true)
                  }}
                  whileHover={{ scale: 1.05, boxShadow: 'var(--shadow-large)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontSize: '15px',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, var(--color-green) 0%, var(--color-green-dark) 100%)'
                  }}
                >
                  + Add Transaction
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Transaction Stats - Enhanced Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: 'var(--space-8)' }}
      >
        <TransactionStats 
          transactions={filteredTransactions}
          allTransactions={transactions}
        />
      </motion.div>

      {/* Enhanced Search and Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="content-card"
        style={{ 
          marginBottom: 'var(--space-8)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-large)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-medium)'
        }}
      >
        <div className="content-card-header" style={{ 
          background: 'linear-gradient(135deg, var(--color-surface-secondary) 0%, var(--color-surface) 100%)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-6) var(--space-8)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}>
            <span style={{ fontSize: '20px' }}>🔍</span>
            <h3 className="content-card-title" style={{ margin: 0 }}>Search & Filter</h3>
          </div>
        </div>
        
        <div className="content-card-body" style={{ padding: 'var(--space-8)' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr',
            gap: 'var(--space-6)',
            alignItems: 'start'
          }}>
            <TransactionSearch
              value={searchQuery}
              onChange={setSearchQuery}
              resultCount={filteredTransactions.length}
            />
            
            <TransactionFilters
              filters={filters}
              onFilterChange={setFilters}
              transactions={transactions}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={(by, order) => {
                setSortBy(by as 'date' | 'amount' | 'name')
                setSortOrder(order as 'asc' | 'desc')
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Enhanced Bulk Actions Bar */}
      <AnimatePresence>
        {selectedTransactions.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="content-card"
            style={{
              background: 'linear-gradient(135deg, var(--color-blue) 0%, var(--color-purple) 100%)',
              color: 'white',
              marginBottom: 'var(--space-6)',
              boxShadow: 'var(--shadow-large)'
            }}
          >
            <div className="content-card-body" style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: '20px' }}>✓</span>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>
                  {selectedTransactions.size} transaction{selectedTransactions.size > 1 ? 's' : ''} selected
                </span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <motion.button
                  className="btn btn-secondary"
                  onClick={() => setSelectedTransactions(new Set())}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Selection
                </motion.button>
                <motion.button
                  className="btn btn-secondary"
                  onClick={handleBulkDelete}
                  style={{ 
                    background: 'var(--color-red)',
                    color: 'white',
                    border: 'none'
                  }}
                  whileHover={{ scale: 1.05, background: '#dc2626' }}
                  whileTap={{ scale: 0.95 }}
                >
                  🗑️ Delete Selected
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {filteredTransactions.length > 0 ? (
          <div className="content-card" style={{ 
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-large)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-large)'
          }}>
            <div className="content-card-header" style={{ 
              background: 'linear-gradient(135deg, var(--color-surface-secondary) 0%, var(--color-surface) 100%)',
              borderBottom: '1px solid var(--color-border)',
              padding: 'var(--space-6) var(--space-8)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: '20px' }}>📋</span>
                <h3 className="content-card-title" style={{ margin: 0 }}>Transaction History</h3>
              </div>
              <div style={{ 
                background: 'var(--color-green)',
                color: 'white',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-medium)',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {filteredTransactions.length} transaction{filteredTransactions.length > 1 ? 's' : ''}
              </div>
            </div>
            <div className="content-card-body" style={{ padding: 0 }}>
              <TransactionList
                transactions={filteredTransactions}
                selectedTransactions={selectedTransactions}
                onSelectionChange={setSelectedTransactions}
                onEdit={(transaction) => {
                  setEditingTransaction(transaction)
                  setShowForm(true)
                }}
                onDelete={handleDeleteTransaction}
                onDuplicate={(transaction) => {
                  const duplicate = {
                    ...transaction,
                    id: Date.now().toString(),
                    name: `${transaction.name} (Copy)`,
                    date: new Date().toISOString().split('T')[0],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  }
                  handleAddTransaction(duplicate)
                }}
              />
            </div>
          </div>
        ) : (
          /* Enhanced Empty State with Beautiful Design */
          <div className="content-card" style={{
            background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-secondary) 100%)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-large)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-large)'
          }}>
            <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
              {transactions.length === 0 ? (
                /* First Time User State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    style={{
                      width: '140px',
                      height: '140px',
                      background: 'linear-gradient(135deg, var(--color-green) 0%, var(--color-blue) 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--space-10) auto',
                      fontSize: '70px',
                      color: 'white',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)',
                      position: 'relative'
                    }}
                    animate={{ 
                      y: [0, -8, 0],
                      scale: [1, 1.02, 1],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    💳
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      width: '40px',
                      height: '40px',
                      background: 'var(--color-orange)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      ✨
                    </div>
                  </motion.div>
                  
                  <h2 className="text-large-title" style={{ 
                    marginBottom: 'var(--space-4)',
                    background: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-green) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Start Your Financial Journey
                  </h2>
                  
                  <p className="text-title-3" style={{ 
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--space-12)',
                    maxWidth: '600px',
                    margin: '0 auto var(--space-12) auto',
                    lineHeight: 1.6
                  }}>
                    Add your first transaction to unlock AI-powered insights, spending patterns, 
                    and personalized financial recommendations that grow smarter with every entry.
                  </p>
                  
                  <div style={{ 
                    display: 'flex',
                    gap: 'var(--space-4)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <motion.button
                      className="btn btn-primary btn-large"
                      onClick={() => setShowForm(true)}
                      style={{
                        background: 'linear-gradient(135deg, var(--color-green) 0%, var(--color-blue) 100%)',
                        fontSize: '16px',
                        fontWeight: '600',
                        padding: 'var(--space-4) var(--space-8)',
                        minWidth: '200px'
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: 'var(--shadow-large)'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🚀 Add First Transaction
                    </motion.button>
                    
                    <motion.button
                      className="btn btn-secondary"
                      onClick={() => setShowBulkImport(true)}
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        padding: 'var(--space-4) var(--space-8)'
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      📥 Import Transactions
                    </motion.button>
                  </div>
                  
                  <div style={{ 
                    marginTop: 'var(--space-12)',
                    padding: 'var(--space-8)',
                    background: 'var(--color-surface-secondary)',
                    borderRadius: 'var(--radius-medium)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <h4 className="text-title-3" style={{ marginBottom: 'var(--space-4)' }}>
                      💡 What you'll get:
                    </h4>
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: 'var(--space-6)',
                      textAlign: 'left'
                    }}>
                      {[
                        { icon: '📊', text: 'Smart spending analytics' },
                        { icon: '🤖', text: 'AI-powered categorization' },
                        { icon: '📈', text: 'Trend predictions' },
                        { icon: '🎯', text: 'Goal recommendations' }
                      ].map((feature, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <span style={{ fontSize: '20px' }}>{feature.icon}</span>
                          <span className="text-body">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* No Results State */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.div
                    style={{
                      width: '100px',
                      height: '100px',
                      background: 'linear-gradient(135deg, var(--color-orange) 0%, var(--color-red) 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--space-8) auto',
                      fontSize: '50px',
                      color: 'white',
                      boxShadow: 'var(--shadow-large)'
                    }}
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    🔍
                  </motion.div>
                  
                  <h3 className="text-title-2" style={{ marginBottom: 'var(--space-4)' }}>
                    No transactions match your filters
                  </h3>
                  
                  <p className="text-body" style={{ 
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--space-8)',
                    maxWidth: '400px',
                    margin: '0 auto var(--space-8) auto'
                  }}>
                    Try adjusting your search criteria or filters to see more results, 
                    or add a new transaction to get started.
                  </p>
                  
                  <div style={{ 
                    display: 'flex',
                    gap: 'var(--space-4)',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <motion.button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSearchQuery('')
                        setFilters({
                          type: 'all',
                          category: 'all',
                          dateRange: 'all',
                          customDateRange: { start: '', end: '' },
                          minAmount: '',
                          maxAmount: '',
                          tags: []
                        })
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🔄 Clear All Filters
                    </motion.button>
                    
                    <motion.button
                      className="btn btn-primary"
                      onClick={() => setShowForm(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      + Add New Transaction
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Transaction Form Modal */}
      <AnimatePresence>
        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            onSave={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
            onClose={() => {
              setShowForm(false)
              setEditingTransaction(null)
            }}
          />
        )}
      </AnimatePresence>

      {/* Bulk Import Modal */}
      <AnimatePresence>
        {showBulkImport && (
          <BulkImport
            onImport={handleBulkImport}
            onClose={() => setShowBulkImport(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}