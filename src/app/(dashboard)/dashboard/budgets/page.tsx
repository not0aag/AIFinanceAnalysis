'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Transaction, Budget } from '@/types/finance'
import BudgetOverview from '@/components/budgets/BudgetOverview'
import BudgetCreator from '@/components/budgets/BudgetCreator'
import BudgetCard from '@/components/budgets/BudgetCard'
import BudgetAnalytics from '@/components/budgets/BudgetAnalytics'
import BudgetRecommendations from '@/components/budgets/BudgetRecommendations'

export default function BudgetsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreator, setShowCreator] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const loadData = () => {
      // Load transactions
      const savedTransactions = localStorage.getItem('finance-ai-transactions')
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions)
        const typedTransactions: Transaction[] = parsed.map((t: any) => ({
          ...t,
          id: t.id?.toString() || Date.now().toString(),
          userId: 'user-1',
          type: t.amount > 0 ? 'income' : 'expense',
          createdAt: t.createdAt || t.date,
          updatedAt: t.updatedAt || t.date
        }))
        setTransactions(typedTransactions)
      }
      
      // Load budgets with enhanced structure
      const savedBudgets = localStorage.getItem('finance-ai-budgets')
      if (savedBudgets) {
        const parsedBudgets = JSON.parse(savedBudgets)
        const enhancedBudgets: Budget[] = parsedBudgets.map((b: any) => ({
          ...b,
          id: b.id?.toString() || Date.now().toString(),
          userId: 'user-1',
          period: b.period || 'monthly',
          startDate: b.startDate || new Date().toISOString(),
          endDate: b.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          notifications: b.notifications || { enabled: true, threshold: 80 },
          rollover: b.rollover || false
        }))
        setBudgets(enhancedBudgets)
      }
      
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Calculate budget spending with period consideration
  const budgetsWithSpending = useMemo(() => {
    return budgets.map(budget => {
      const relevantTransactions = transactions.filter(t => {
        if (t.type !== 'expense' || t.category !== budget.category) return false
        
        const transactionDate = new Date(t.date)
        const startDate = new Date(budget.startDate)
        const endDate = new Date(budget.endDate)
        
        return transactionDate >= startDate && transactionDate <= endDate
      })
      
      const spent = relevantTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      return { ...budget, spent }
    })
  }, [budgets, transactions])

  // Budget management functions
  const handleCreateBudget = (newBudget: Omit<Budget, 'id' | 'userId' | 'spent'>) => {
    const budget: Budget = {
      ...newBudget,
      id: Date.now().toString(),
      userId: 'user-1',
      spent: 0
    }
    
    const updated = [...budgets, budget]
    setBudgets(updated)
    localStorage.setItem('finance-ai-budgets', JSON.stringify(updated))
    setShowCreator(false)
  }

  const handleUpdateBudget = (updatedBudget: Budget) => {
    const updated = budgets.map(b => b.id === updatedBudget.id ? updatedBudget : b)
    setBudgets(updated)
    localStorage.setItem('finance-ai-budgets', JSON.stringify(updated))
    setEditingBudget(null)
  }

  const handleDeleteBudget = (budgetId: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      const updated = budgets.filter(b => b.id !== budgetId)
      setBudgets(updated)
      localStorage.setItem('finance-ai-budgets', JSON.stringify(updated))
    }
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="text-body">Loading your budgets...</div>
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
          <h1 className="page-title">Budget Management</h1>
          <p className="page-subtitle">
            Track spending limits and achieve your financial goals
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          {/* View Toggle */}
          <div style={{ 
            display: 'flex', 
            background: 'var(--color-surface-elevated)',
            borderRadius: 'var(--radius-medium)',
            padding: 'var(--space-1)'
          }}>
            <button
              onClick={() => setView('grid')}
              className={view === 'grid' ? 'btn btn-primary' : 'btn btn-ghost'}
              style={{ padding: 'var(--space-2) var(--space-3)' }}
            >
              <span>⊞</span>
            </button>
            <button
              onClick={() => setView('list')}
              className={view === 'list' ? 'btn btn-primary' : 'btn btn-ghost'}
              style={{ padding: 'var(--space-2) var(--space-3)' }}
            >
              <span>☰</span>
            </button>
          </div>
          
          {/* Create Budget Button */}
          <motion.button
            className="btn btn-primary"
            onClick={() => setShowCreator(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Create Budget
          </motion.button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <BudgetOverview 
        budgets={budgetsWithSpending}
        transactions={transactions}
        period={selectedPeriod}
      />

      {/* Budgets Grid/List */}
      {budgetsWithSpending.length > 0 ? (
        <>
          {/* Period Filter */}
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-6)'
          }}>
            {(['weekly', 'monthly', 'yearly'] as const).map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`btn ${selectedPeriod === period ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: 'var(--font-size-footnote)',
                  textTransform: 'capitalize'
                }}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Budget Cards */}
          <div className={view === 'grid' ? 'grid grid-auto' : 'grid grid-1'} 
            style={{ gap: 'var(--space-6)' }}
          >
            <AnimatePresence>
              {budgetsWithSpending
                .filter(budget => budget.period === selectedPeriod)
                .map((budget, index) => (
                  <motion.div
                    key={`${budget.id}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BudgetCard
                      budget={budget}
                      onEdit={() => {
                        setEditingBudget(budget)
                        setShowCreator(true)
                      }}
                      onDelete={() => handleDeleteBudget(budget.id)}
                      view={view}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* Budget Analytics */}
          <div style={{ marginTop: 'var(--space-12)' }}>
            <BudgetAnalytics
              budgets={budgetsWithSpending}
              transactions={transactions}
              period={selectedPeriod}
            />
          </div>

          {/* AI Recommendations */}
          <div style={{ marginTop: 'var(--space-8)' }}>
            <BudgetRecommendations
              budgets={budgetsWithSpending}
              transactions={transactions}
              onCreateBudget={handleCreateBudget}
            />
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="content-card">
          <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <motion.div
              style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, var(--color-orange) 0%, #e6890a 100%)',
                borderRadius: 'var(--radius-large)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-8) auto',
                fontSize: '60px',
                color: 'white',
                boxShadow: 'var(--shadow-large)'
              }}
              animate={{ 
                rotate: [0, -5, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              🎯
            </motion.div>
            <h2 className="text-title-2" style={{ marginBottom: 'var(--space-4)' }}>
              Start Budget Planning
            </h2>
            <p className="text-body" style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-8)',
              maxWidth: '500px',
              margin: '0 auto var(--space-8) auto'
            }}>
              Create budgets to track your spending across different categories 
              and get alerts before you overspend.
            </p>
            <motion.button
              className="btn btn-primary btn-large"
              onClick={() => setShowCreator(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Your First Budget
            </motion.button>
          </div>
        </div>
      )}

      {/* Budget Creator/Editor Modal */}
      <AnimatePresence>
        {showCreator && (
          <BudgetCreator
            budget={editingBudget}
            existingBudgets={budgets}
            transactions={transactions}
            onSave={editingBudget ? handleUpdateBudget : handleCreateBudget}
            onClose={() => {
              setShowCreator(false)
              setEditingBudget(null)
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}