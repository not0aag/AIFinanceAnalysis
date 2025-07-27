'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Transaction, SpendingPattern } from '@/types/finance'
import { 
  calculateSpendingPatterns, 
  generateFinancialReport,
  predictFutureSpending 
} from '@/lib/analytics'
import CategoryBreakdown from '@/components/analytics/CategoryBreakdown'
import TrendAnalysis from '@/components/analytics/TrendAnalysis'
import MerchantInsights from '@/components/analytics/MerchantInsights'
import PredictiveAnalytics from '@/components/analytics/PredictiveAnalytics'
import ExportReport from '@/components/analytics/ExportReport'

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showExport, setShowExport] = useState(false)

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
          updatedAt: t.updatedAt || t.date
        }))
        setTransactions(typedTransactions)
      }
      
      setIsLoading(false)
    }

    loadTransactions()
  }, [])

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    if (transactions.length === 0) return null
    
    return {
      patterns: calculateSpendingPatterns(transactions, selectedPeriod),
      report: generateFinancialReport(transactions, selectedPeriod),
      predictions: predictFutureSpending(transactions)
    }
  }, [transactions, selectedPeriod])

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="text-body">Analyzing your financial data...</div>
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
        {/* Empty State */}
        <div className="page-header">
          <h1 className="page-title">Analytics Dashboard</h1>
          <p className="page-subtitle">Deep insights into your financial patterns</p>
        </div>

        <div className="content-card">
          <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
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
                color: 'white',
                boxShadow: 'var(--shadow-large)'
              }}
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              📊
            </motion.div>
            <h2 className="text-title-2" style={{ marginBottom: 'var(--space-4)' }}>
              No Data to Analyze Yet
            </h2>
            <p className="text-body" style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-8)',
              maxWidth: '500px',
              margin: '0 auto var(--space-8) auto'
            }}>
              Add transactions to unlock powerful analytics including spending patterns, 
              trend analysis, and AI-powered predictions.
            </p>
            <button
              className="btn btn-primary btn-large"
              onClick={() => window.location.href = '/dashboard'}
            >
              Add Your First Transaction
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!analyticsData) return null

  return (
    <motion.div 
      className="fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Enhanced Header with Controls */}
      <div className="page-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-12)'
      }}>
        <div>
          <h1 className="page-title">Analytics Dashboard</h1>
          <p className="page-subtitle">
            {analyticsData.report.period.start} - {analyticsData.report.period.end}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          {/* Period Selector */}
          <select
            className="input"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            style={{ 
              minWidth: '150px',
              padding: 'var(--space-2) var(--space-4)'
            }}
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="quarter">Past Quarter</option>
            <option value="year">Past Year</option>
          </select>
          
          {/* Export Button */}
          <button
            className="btn btn-secondary"
            onClick={() => setShowExport(true)}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
          >
            <span>📥</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-12)' }}>
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-header">
            <div className="stat-icon green">📈</div>
            <div className={`stat-badge ${analyticsData.report.income.growth >= 0 ? 'positive' : 'negative'}`}>
              {analyticsData.report.income.growth >= 0 ? '+' : ''}{analyticsData.report.income.growth.toFixed(1)}%
            </div>
          </div>
          <div className="stat-label">Total Income</div>
          <div className="stat-value">${analyticsData.report.income.total.toLocaleString()}</div>
          <div className="stat-change positive">
            vs previous {selectedPeriod}
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-header">
            <div className="stat-icon red">📉</div>
            <div className="stat-badge negative">
              {((analyticsData.report.expenses.total / analyticsData.report.income.total) * 100).toFixed(0)}%
            </div>
          </div>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">${analyticsData.report.expenses.total.toLocaleString()}</div>
          <div className="stat-change">
            of total income
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-header">
            <div className="stat-icon blue">💰</div>
            <div className={`stat-badge ${analyticsData.report.savings.rate >= 20 ? 'positive' : 'negative'}`}>
              {analyticsData.report.savings.rate.toFixed(0)}%
            </div>
          </div>
          <div className="stat-label">Savings Rate</div>
          <div className="stat-value">${analyticsData.report.savings.amount.toLocaleString()}</div>
          <div className="stat-change">
            {analyticsData.report.savings.rate >= 20 ? 'Excellent!' : 'Room to improve'}
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stat-header">
            <div className="stat-icon purple">🎯</div>
            <div className="stat-badge positive">
              {analyticsData.predictions.accuracy.toFixed(0)}%
            </div>
          </div>
          <div className="stat-label">Prediction Accuracy</div>
          <div className="stat-value">${analyticsData.predictions.nextMonth.toLocaleString()}</div>
          <div className="stat-change">
            projected next month
          </div>
        </motion.div>
      </div>

      {/* Main Analytics Content */}
      <div className="grid" style={{ 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: 'var(--space-8)'
      }}>
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CategoryBreakdown
            data={analyticsData.report.expenses.byCategory}
            total={analyticsData.report.expenses.total}
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </motion.div>

        {/* Trend Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <TrendAnalysis
            patterns={analyticsData.patterns}
            selectedCategory={selectedCategory}
          />
        </motion.div>
      </div>

      {/* Additional Insights Row */}
      <div className="grid" style={{ 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: 'var(--space-8)',
        marginTop: 'var(--space-8)'
      }}>
        {/* Merchant Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <MerchantInsights
            merchants={analyticsData.report.expenses.topMerchants}
            transactions={transactions}
          />
        </motion.div>

        {/* Predictive Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <PredictiveAnalytics
            predictions={analyticsData.predictions}
            patterns={analyticsData.patterns}
          />
        </motion.div>
      </div>

      {/* Export Modal */}
      {showExport && (
        <ExportReport
          report={analyticsData.report}
          onClose={() => setShowExport(false)}
        />
      )}
    </motion.div>
  )
}