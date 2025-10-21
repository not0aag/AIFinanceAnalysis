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
  const [sortBy, setSortBy] = useState<string>('date')
  const [sortOrder, setSortOrder] = useState<string>('desc')
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
          userId: 'user-1',
          type: t.amount > 0 ? 'income' : 'expense',
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
      {/* Enhanced Header */}
      <div className="page-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-8)'
      }}>
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">
            {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <motion.button
            className="btn btn-secondary"
            onClick={() => setShowBulkImport(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-3) var(--space-5)'
            }}
          >
            <span>📥</span>
            <span>Import</span>
          </motion.button>
          <motion.button
            className="btn btn-primary"
            onClick={() => {
              setEditingTransaction(null)
              setShowForm(true)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-3) var(--space-6)',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: '1' }}>+</span>
            <span>Add Transaction</span>
          </motion.button>
        </div>
      </div>

      {/* Transaction Stats */}
      <TransactionStats 
        transactions={filteredTransactions}
        allTransactions={transactions}
      />

      {/* Search and Filters */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto',
        gap: 'var(--space-6)',
        marginTop: 'var(--space-8)',
        marginBottom: 'var(--space-6)'
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
            setSortBy(by)
            setSortOrder(order)
          }}
        />
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedTransactions.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              background: 'var(--color-blue)',
              color: 'white',
              borderRadius: 'var(--radius-medium)',
              marginBottom: 'var(--space-6)'
            }}
          >
            <span>{selectedTransactions.size} selected</span>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedTransactions(new Set())}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                Clear
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleBulkDelete}
                style={{ 
                  background: 'var(--color-red)',
                  color: 'white',
                  border: 'none'
                }}
              >
                Delete Selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction List */}
      {filteredTransactions.length > 0 ? (
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
      ) : (
        /* Empty State */
        <div className="content-card">
          <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            {transactions.length === 0 ? (
              <>
                <motion.div
                  style={{
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, var(--color-blue) 0%, var(--color-blue-dark) 100%)',
                    borderRadius: 'var(--radius-large)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-8) auto',
                    fontSize: '60px',
                    color: 'white'
                  }}
                  animate={{ 
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  💳
                </motion.div>
                <h2 className="text-title-2" style={{ marginBottom: 'var(--space-4)' }}>
                  No Transactions Yet
                </h2>
                <p className="text-body" style={{ 
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-8)'
                }}>
                  Start tracking your finances by adding your first transaction.
                </p>
                <motion.button
                  className="btn btn-primary btn-large"
                  onClick={() => setShowForm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    margin: '0 auto',
                    padding: 'var(--space-4) var(--space-8)',
                    fontSize: '16px',
                    fontWeight: '600',
                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <span style={{ fontSize: '24px', lineHeight: '1' }}>+</span>
                  <span>Add First Transaction</span>
                </motion.button>
              </>
            ) : (
              <>
                <h3 className="text-title-3" style={{ marginBottom: 'var(--space-4)' }}>
                  No Matching Transactions
                </h3>
                <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                  Try adjusting your filters or search query.
                </p>
              </>
            )}
          </div>
        </div>
      )}

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

      {/* Floating Action Button for Mobile */}
      <motion.button
        className="btn btn-primary"
        onClick={() => {
          setEditingTransaction(null)
          setShowForm(true)
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          position: 'fixed',
          bottom: 'var(--space-6)',
          right: 'var(--space-6)',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 'bold',
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5)',
          zIndex: 999,
          padding: 0
        }}
        title="Add Transaction"
      >
        +
      </motion.button>
    </motion.div>
  )
}