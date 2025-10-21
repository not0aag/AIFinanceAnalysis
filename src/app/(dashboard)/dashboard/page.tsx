'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Onboarding from '@/components/Onboarding'
import { Transaction, FinancialGoal, SpendingPattern } from '@/types/finance'
import { calculateFinancialMetrics, formatCurrency } from '@/lib/finance-utils'
import QuickStats from '@/components/dashboard/QuickStats'
import SpendingTrends from '@/components/dashboard/SpendingTrends'
import GoalProgress from '@/components/dashboard/GoalProgress'
import RecentActivity from '@/components/dashboard/RecentActivity'
import AIAssistant from '@/components/dashboard/AIAssistant'

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  // Load data with error handling
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Load transactions
        const savedTransactions = localStorage.getItem('finance-ai-transactions')
        if (savedTransactions) {
          const parsed = JSON.parse(savedTransactions)
          // Ensure transactions have proper types
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
        
        // Load goals
        const savedGoals = localStorage.getItem('finance-ai-goals')
        if (savedGoals) {
          setGoals(JSON.parse(savedGoals))
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [refreshKey])

  // Calculate financial metrics with memoization
  const metrics = useMemo(() => 
    calculateFinancialMetrics(transactions, selectedPeriod),
    [transactions, selectedPeriod]
  )

  // Handle transaction updates
  const handleTransactionUpdate = useCallback((updatedTransactions: Transaction[]) => {
    setTransactions(updatedTransactions)
    localStorage.setItem('finance-ai-transactions', JSON.stringify(updatedTransactions))
    setRefreshKey(prev => prev + 1)
  }, [])

  // Handle onboarding completion
  const handleOnboardingComplete = useCallback((newTransactions: Transaction[]) => {
    handleTransactionUpdate(newTransactions)
    setShowOnboarding(false)
  }, [handleTransactionUpdate])

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1)
    }, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="text-body">Loading your financial dashboard...</div>
      </div>
    )
  }

  // Show welcome screen for new users
  if (transactions.length === 0) {
    return (
      <div className="welcome-layout">
        <motion.div 
          className="welcome-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Enhanced Hero Section with Animation */}
          <motion.div 
            style={{ marginBottom: 'var(--space-16)' }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="hero-icon">
              <motion.span
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                $
              </motion.span>
            </div>
            
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
              Your AI-powered financial companion that learns from your habits 
              and helps you make smarter money decisions.
            </p>
          </motion.div>

          {/* Enhanced Feature Cards with Stagger Animation */}
          <div className="grid grid-auto" style={{ marginBottom: 'var(--space-16)' }}>
            {[
              {
                icon: '📊',
                title: 'Smart Analytics',
                description: 'AI-driven insights that adapt to your spending patterns and financial goals.',
                gradient: 'linear-gradient(135deg, var(--color-green) 0%, var(--color-green-dark) 100%)'
              },
              {
                icon: '🤖',
                title: 'Predictive AI',
                description: 'Forecast future expenses and get alerts before you overspend.',
                gradient: 'linear-gradient(135deg, var(--color-purple) 0%, #8e44ad 100%)'
              },
              {
                icon: '🎯',
                title: 'Goal Automation',
                description: 'Set it and forget it - we\'ll help you reach your financial goals automatically.',
                gradient: 'linear-gradient(135deg, var(--color-orange) 0%, #e6890a 100%)'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="content-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: 'var(--shadow-large)'
                }}
              >
                <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                  <motion.div
                    style={{
                      width: '64px',
                      height: '64px',
                      background: feature.gradient,
                      borderRadius: 'var(--radius-large)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--space-6) auto',
                      fontSize: 'var(--font-size-title-2)',
                      color: 'white',
                      boxShadow: 'var(--shadow-medium)'
                    }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-title-3" style={{ marginBottom: 'var(--space-3)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced CTA */}
          <motion.div 
            className="content-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <h2 className="text-title-2" style={{ marginBottom: 'var(--space-4)' }}>
                Ready to Transform Your Finances?
              </h2>
              <p className="text-body" style={{ 
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-8)',
                maxWidth: '500px',
                margin: '0 auto var(--space-8) auto'
              }}>
                Start with your first transaction and watch as our AI learns your patterns 
                to provide personalized insights and recommendations.
              </p>
              
              <motion.button
                className="btn btn-primary btn-large"
                onClick={() => setShowOnboarding(true)}
                style={{ minWidth: '250px' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Financial Journey
              </motion.button>
              
              <p className="text-caption-1" style={{ marginTop: 'var(--space-4)' }}>
                Takes less than 2 minutes • No credit card required
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Onboarding Modal */}
        <AnimatePresence>
          {showOnboarding && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <Onboarding onTransactionsAdded={handleOnboardingComplete} />
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Main dashboard with data
  return (
    <motion.div 
      className="fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Enhanced Page Header with Period Selector */}
      <div className="page-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 'var(--space-4)'
      }}>
        <div>
          <h1 className="page-title">Financial Overview</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Period Selector */}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {(['week', 'month', 'year'] as const).map(period => (
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
      </div>
      
      {/* Enhanced Quick Stats */}
      <QuickStats metrics={metrics} period={selectedPeriod} />
      
      {/* Main Content Grid */}
      <div className="grid" style={{ 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: 'var(--space-8)',
        marginTop: 'var(--space-8)'
      }}>
        {/* Spending Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SpendingTrends 
            transactions={transactions} 
            period={selectedPeriod}
          />
        </motion.div>
        
        {/* Goal Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GoalProgress 
            goals={goals}
            onGoalUpdate={(updatedGoals) => {
              setGoals(updatedGoals)
              localStorage.setItem('finance-ai-goals', JSON.stringify(updatedGoals))
            }}
          />
        </motion.div>
      </div>
      
      {/* Recent Activity & AI Assistant */}
      <div className="grid" style={{ 
        gridTemplateColumns: '2fr 1fr',
        gap: 'var(--space-8)',
        marginTop: 'var(--space-8)'
      }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RecentActivity 
            transactions={transactions}
            onTransactionEdit={(transaction) => {
              // Handle transaction edit
              console.log('Edit transaction:', transaction)
            }}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AIAssistant 
            metrics={metrics}
            transactions={transactions}
          />
        </motion.div>
      </div>
      
      {/* Quick Actions FAB */}
      <motion.div
        style={{
          position: 'fixed',
          bottom: 'var(--space-8)',
          right: 'var(--space-8)',
          zIndex: 100
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
      >
        <motion.button
          className="btn btn-primary"
          onClick={() => setShowOnboarding(true)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-size-title-2)',
            boxShadow: 'var(--shadow-large)'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          +
        </motion.button>
      </motion.div>

      {/* Enhanced Add Transaction Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <Onboarding 
                onTransactionsAdded={(newTransactions) => {
                  const allTransactions = [...transactions, ...newTransactions]
                  handleTransactionUpdate(allTransactions)
                  setShowOnboarding(false)
                }}
                existingTransactions={transactions}
              />
              <button
                onClick={() => setShowOnboarding(false)}
                className="modal-close"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}