'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Transaction, AIInsight, FinancialGoal } from '@/types/finance'
import AIFinancialAnalyst from '@/components/AIFinancialAnalyst'
import InsightFilters from '@/components/insights/InsightFilters'
import ActionableInsights from '@/components/insights/ActionableInsights'
import GoalRecommendations from '@/components/insights/GoalRecommendations'
import FinancialHealthScore from '@/components/insights/FinancialHealthScore'

export default function InsightsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'insights'>('overview')
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | AIInsight['type'],
    impact: 'all' as 'all' | AIInsight['impact'],
    category: 'all',
    timeframe: 'all'
  })
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
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
        
        // Load goals
        const savedGoals = localStorage.getItem('finance-ai-goals')
        if (savedGoals) {
          setGoals(JSON.parse(savedGoals))
        }
        
        // Load cached insights
        const savedInsights = localStorage.getItem('finance-ai-insights')
        if (savedInsights) {
          setInsights(JSON.parse(savedInsights))
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle insight actions
  const handleInsightAction = useCallback((insightId: string, action: 'dismiss' | 'complete') => {
    setInsights(prev => {
      const updated = prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, dismissed: action === 'dismiss' }
          : insight
      )
      localStorage.setItem('finance-ai-insights', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Calculate monthly income
  const calculateMonthlyIncome = () => {
    const incomeTransactions = transactions.filter(t => t.type === 'income')
    if (incomeTransactions.length === 0) return 0
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
    return Math.round(totalIncome)
  }

  const monthlyIncome = calculateMonthlyIncome()

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="text-body">Generating AI insights...</div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <motion.div 
        className="fade-in"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="page-header">
          <h1 className="page-title">AI Financial Insights</h1>
          <p className="page-subtitle">Your personal AI financial advisor</p>
        </div>

        <div className="content-card">
          <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <motion.div
              style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, var(--color-purple) 0%, #8e44ad 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-8) auto',
                fontSize: '60px',
                color: 'white',
                boxShadow: 'var(--shadow-large)'
              }}
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              🤖
            </motion.div>
            <h2 className="text-title-2" style={{ marginBottom: 'var(--space-4)' }}>
              Your AI Assistant is Ready
            </h2>
            <p className="text-body" style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-8)',
              maxWidth: '500px',
              margin: '0 auto var(--space-8) auto'
            }}>
              Add transactions to unlock AI-powered insights, personalized recommendations, 
              and predictive analytics tailored to your financial habits.
            </p>
            <button
              className="btn btn-primary btn-large"
              onClick={() => window.location.href = '/dashboard'}
            >
              Get Started
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Filter insights based on current filters
  const filteredInsights = insights.filter(insight => {
    if (filters.type !== 'all' && insight.type !== filters.type) return false
    if (filters.impact !== 'all' && insight.impact !== filters.impact) return false
    if (filters.category !== 'all' && insight.category !== filters.category) return false
    if (insight.dismissed) return false
    return true
  })

  return (
    <motion.div 
      className="fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Enhanced Header with Tabs */}
      <div className="page-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="page-title">AI Financial Insights</h1>
        <p className="page-subtitle">
          Powered by advanced machine learning algorithms
        </p>
        
        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--space-2)',
          marginTop: 'var(--space-6)',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: 'var(--space-1)'
        }}>
          {[
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'insights', label: 'Insights', icon: '💡' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: 'none',
                border: 'none',
                color: activeTab === tab.key ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === tab.key ? '600' : '400',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s var(--ease-in-out)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--color-blue)',
                    borderRadius: 'var(--radius-small)'
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Financial Health Score */}
            <FinancialHealthScore 
              transactions={transactions}
              goals={goals}
              monthlyIncome={monthlyIncome}
            />
            
            {/* AI Analysis Component */}
            <div style={{ marginTop: 'var(--space-8)' }}>
              <AIFinancialAnalyst 
                transactions={transactions}
                monthlyIncome={monthlyIncome}
                financialGoals={goals.map(g => g.name)}
                onInsightGenerated={(newInsights: AIInsight[]) => {
                  const merged = [...insights, ...newInsights]
                  setInsights(merged)
                  localStorage.setItem('finance-ai-insights', JSON.stringify(merged))
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Insight Filters */}
            <InsightFilters 
              filters={filters}
              onFilterChange={setFilters}
              insightCounts={{
                total: insights.length,
                byType: insights.reduce((acc, i) => {
                  acc[i.type] = (acc[i.type] || 0) + 1
                  return acc
                }, {} as Record<string, number>)
              }}
            />
            
            {/* Actionable Insights Grid */}
            <ActionableInsights
              insights={filteredInsights}
              onAction={handleInsightAction}
              transactions={transactions}
            />
            
            {/* Goal Recommendations */}
            <div style={{ marginTop: 'var(--space-8)' }}>
              <GoalRecommendations
                transactions={transactions}
                existingGoals={goals}
                monthlyIncome={monthlyIncome}
                onGoalCreate={(newGoal: FinancialGoal) => {
                  const updated = [...goals, newGoal]
                  setGoals(updated)
                  localStorage.setItem('finance-ai-goals', JSON.stringify(updated))
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}