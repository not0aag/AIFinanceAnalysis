'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Transaction, SpendingPattern } from '@/types/finance'
import { 
  calculateSpendingPatterns, 
  generateFinancialReport,
  predictFutureSpending 
} from '@/lib/analytics'
import { initializeSampleData } from '@/lib/sample-data'
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
      // Initialize sample data if none exists
      initializeSampleData()
      
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
      {/* Enhanced Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">Analytics Dashboard</h1>
          <p className="page-subtitle">
            Deep insights into your financial patterns and trends
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}>
          <div style={{ 
            background: 'var(--color-surface-secondary)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-medium)',
            border: '1px solid var(--color-border)'
          }}>
            <span className="text-caption" style={{ color: 'var(--color-text-secondary)' }}>
              {analyticsData.report.period.start} - {analyticsData.report.period.end}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <select
              className="input"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              style={{ 
                minWidth: '150px',
                padding: 'var(--space-2) var(--space-4)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-medium)'
              }}
            >
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="quarter">Past Quarter</option>
              <option value="year">Past Year</option>
            </select>
            
            <motion.button
              className="btn btn-secondary"
              onClick={() => setShowExport(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📥 Export Report
            </motion.button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: 'var(--space-8)' }}
      >
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)'
        }}>
          <div className="content-card">
            <div className="content-card-body">
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--space-4)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-medium)',
                  background: 'linear-gradient(135deg, var(--color-green) 0%, var(--color-green-dark) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  📈
                </div>
                <div style={{
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-small)',
                  background: analyticsData.report.income.growth >= 0 ? 'var(--color-green-light)' : 'var(--color-red-light)',
                  color: analyticsData.report.income.growth >= 0 ? 'var(--color-green-dark)' : 'var(--color-red-dark)',
                  fontSize: 'var(--font-size-caption)',
                  fontWeight: '600'
                }}>
                  {analyticsData.report.income.growth >= 0 ? '+' : ''}{analyticsData.report.income.growth.toFixed(1)}%
                </div>
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-caption)', marginBottom: 'var(--space-2)' }}>
                Total Income
              </div>
              <div style={{ fontSize: 'var(--font-size-title-2)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                ${analyticsData.report.income.total.toLocaleString()}
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-caption)' }}>
                vs previous {selectedPeriod}
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--space-4)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-medium)',
                  background: 'linear-gradient(135deg, var(--color-red) 0%, var(--color-red-dark) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  📉
                </div>
                <div style={{
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-small)',
                  background: 'var(--color-orange-light)',
                  color: 'var(--color-orange-dark)',
                  fontSize: 'var(--font-size-caption)',
                  fontWeight: '600'
                }}>
                  {((analyticsData.report.expenses.total / analyticsData.report.income.total) * 100).toFixed(0)}%
                </div>
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-caption)', marginBottom: 'var(--space-2)' }}>
                Total Expenses
              </div>
              <div style={{ fontSize: 'var(--font-size-title-2)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                ${analyticsData.report.expenses.total.toLocaleString()}
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-caption)' }}>
                of total income
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--space-4)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-medium)',
                  background: 'linear-gradient(135deg, var(--color-blue) 0%, var(--color-blue-dark) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  💰
                </div>
                <div style={{
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-small)',
                  background: analyticsData.report.savings.rate >= 20 ? 'var(--color-green-light)' : 'var(--color-orange-light)',
                  color: analyticsData.report.savings.rate >= 20 ? 'var(--color-green-dark)' : 'var(--color-orange-dark)',
                  fontSize: 'var(--font-size-caption)',
                  fontWeight: '600'
                }}>
                  {analyticsData.report.savings.rate.toFixed(0)}%
                </div>
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-caption)', marginBottom: 'var(--space-2)' }}>
                Savings Rate
              </div>
              <div style={{ fontSize: 'var(--font-size-title-2)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                ${analyticsData.report.savings.amount.toLocaleString()}
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-caption)' }}>
                {analyticsData.report.savings.rate >= 20 ? 'Excellent!' : 'Room to improve'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Components */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 'var(--space-8)'
        }}>
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Spending by Category</h3>
            </div>
            <div className="content-card-body">
              <CategoryBreakdown
                data={analyticsData.report.expenses.byCategory}
                total={analyticsData.report.expenses.total}
                onCategorySelect={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Spending Trends</h3>
            </div>
            <div className="content-card-body">
              <TrendAnalysis
                patterns={analyticsData.patterns}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Top Merchants</h3>
            </div>
            <div className="content-card-body">
              <MerchantInsights
                merchants={analyticsData.report.expenses.topMerchants}
                transactions={transactions}
              />
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Financial Predictions</h3>
            </div>
            <div className="content-card-body">
              <PredictiveAnalytics
                predictions={analyticsData.predictions}
                patterns={analyticsData.patterns}
              />
            </div>
          </div>
        </div>
      </motion.div>

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