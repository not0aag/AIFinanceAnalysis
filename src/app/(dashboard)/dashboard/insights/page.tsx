'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Transaction, AIInsight, FinancialGoal } from '@/types/finance'
import AIFinancialAnalyst from '@/components/AIFinancialAnalyst'
import FinancialHealthScore from '@/components/insights/FinancialHealthScore'

export default function InsightsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
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
            userId: t.userId || 'user-1',
            // Preserve the original type and amount as they are correctly set
            type: t.type || (t.amount > 0 ? 'income' : 'expense'),
            // Keep the original amount - sample data already has correct signs
            amount: t.amount,
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
      </div>

      {/* AI Insights Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
    </motion.div>
  )
}