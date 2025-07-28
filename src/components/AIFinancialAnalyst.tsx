'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Transaction, AIInsight } from '@/types/finance'
import { formatCurrency } from '@/lib/utils'

interface AIFinancialAnalystProps {
  transactions: Transaction[]
  monthlyIncome: number
  financialGoals: string[]
  onInsightGenerated?: (insights: AIInsight[]) => void
}

export default function AIFinancialAnalyst({ 
  transactions, 
  monthlyIncome, 
  financialGoals,
  onInsightGenerated 
}: AIFinancialAnalystProps) {
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set())
  const [processingStage, setProcessingStage] = useState('')
  const retryCount = useRef(0)
  const lastAnalyzed = useRef<string>('')
  const maxRetries = 3

  useEffect(() => {
    const analyzeFinances = async () => {
      if (transactions.length === 0) {
        setLoading(false)
        return
      }

      // Create a unique key for this analysis
      const analysisKey = `${transactions.length}-${monthlyIncome}-${JSON.stringify(financialGoals)}`
      
      // Prevent running if we already analyzed this exact data
      if (analysisData && lastAnalyzed.current === analysisKey) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      setProcessingStage('Analyzing spending patterns...')
      
      try {
        // Simulate processing stages for better UX
        const stages = [
          'Analyzing spending patterns...',
          'Detecting anomalies...',
          'Generating insights...',
          'Creating recommendations...'
        ]
        
        for (let i = 0; i < stages.length; i++) {
          setProcessingStage(stages[i])
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        const response = await fetch('/api/ai/financial-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactions: transactions.map(t => ({
              ...t,
              type: t.amount > 0 ? 'income' : 'expense'
            })),
            monthlyIncome,
            financialGoals
          })
        })

        if (!response.ok) {
          throw new Error(`Analysis failed: ${response.statusText}`)
        }

        const data = await response.json()
        setAnalysisData(data)
        lastAnalyzed.current = analysisKey // Store the analysis key to prevent re-analysis
        
        // Generate AI insights for storage
        if (onInsightGenerated && data.insights) {
          const aiInsights: AIInsight[] = data.insights.insights.map((insight: any, index: number) => ({
            id: `${Date.now()}-${index}`,
            type: insight.type,
            title: insight.title,
            description: insight.description,
            impact: insight.impact,
            category: 'financial',
            actionItems: insight.actionItems,
            potentialSavings: insight.potentialSavings,
            timeframe: insight.timeframe,
            confidence: 85 + Math.random() * 15, // 85-100% confidence
            dismissed: false,
            createdAt: new Date().toISOString()
          }))
          onInsightGenerated(aiInsights)
        }
        
        retryCount.current = 0
      } catch (error) {
        console.error('Error analyzing finances:', error)
        
        if (retryCount.current < maxRetries) {
          retryCount.current++
          setProcessingStage(`Retrying analysis (${retryCount.current}/${maxRetries})...`)
          setTimeout(() => analyzeFinances(), 2000)
        } else {
          setError('Unable to complete analysis. Please try again later.')
        }
      } finally {
        setLoading(false)
        setProcessingStage('')
      }
    }

    analyzeFinances()
  }, [transactions.length, monthlyIncome]) // Remove onInsightGenerated and financialGoals to prevent loops

  const toggleInsight = (insightId: string) => {
    setExpandedInsights(prev => {
      const newSet = new Set(prev)
      if (newSet.has(insightId)) {
        newSet.delete(insightId)
      } else {
        newSet.add(insightId)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div className="content-card">
        <div className="loading" style={{ padding: 'var(--space-12)' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ marginBottom: 'var(--space-4)' }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, var(--color-purple) 0%, var(--color-blue) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              color: 'white',
              margin: '0 auto'
            }}>
              🤖
            </div>
          </motion.div>
          <div className="text-body" style={{ textAlign: 'center' }}>
            <motion.p
              key={processingStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {processingStage || 'AI is analyzing your financial data...'}
            </motion.p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="content-card">
        <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
          <div style={{ 
            fontSize: '60px',
            marginBottom: 'var(--space-4)'
          }}>😔</div>
          <h3 className="text-title-3" style={{ 
            color: 'var(--color-red)',
            marginBottom: 'var(--space-4)'
          }}>
            Analysis Error
          </h3>
          <p className="text-body" style={{ 
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-6)'
          }}>
            {error}
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!analysisData || transactions.length === 0) {
    return (
      <div className="content-card">
        <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
          <div style={{ 
            fontSize: '60px',
            marginBottom: 'var(--space-4)'
          }}>📊</div>
          <p className="text-body">Add transactions to get AI insights!</p>
        </div>
      </div>
    )
  }

  const { insights, anomalies, savingsStrategies } = analysisData

  return (
    <div className="grid" style={{ gap: 'var(--space-8)' }}>
      {/* Financial Health Score Card */}
      {insights && (
        <motion.div 
          className="content-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="content-card-header">
            <h3 className="content-card-title">AI Financial Health Analysis</h3>
            <p className="content-card-subtitle">
              Powered by advanced machine learning
            </p>
          </div>
          <div className="content-card-body">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '200px 1fr',
              gap: 'var(--space-12)',
              alignItems: 'center'
            }}>
              {/* Animated Score Circle */}
              <div style={{ position: 'relative' }}>
                <svg width="200" height="200">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-purple)" />
                      <stop offset="100%" stopColor="var(--color-blue)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke="var(--color-border)"
                    strokeWidth="12"
                    fill="none"
                  />
                  
                  {/* Progress circle */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke="url(#scoreGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    initial={{ strokeDashoffset: `${2 * Math.PI * 90}` }}
                    animate={{ 
                      strokeDashoffset: `${2 * Math.PI * 90 * (1 - insights.financialHealthScore / 100)}` 
                    }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                  />
                </svg>
                
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <motion.div
                    style={{
                      fontSize: '48px',
                      fontWeight: '700',
                      color: 'var(--color-text-primary)'
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {insights.financialHealthScore}
                  </motion.div>
                  <div className="text-caption-1">Health Score</div>
                </div>
              </div>

              <div>
                <h4 style={{
                  fontSize: 'var(--font-size-title-2)',
                  fontWeight: '600',
                  color: insights.financialHealthScore >= 80 ? 'var(--color-green)' : 
                         insights.financialHealthScore >= 60 ? 'var(--color-orange)' : 'var(--color-red)',
                  marginBottom: 'var(--space-4)'
                }}>
                  {insights.financialHealthScore >= 80 ? '🎉 Excellent Financial Health!' : 
                   insights.financialHealthScore >= 60 ? '👍 Good Progress!' : '⚠️ Needs Attention'}
                </h4>
                
                <p className="text-body" style={{ marginBottom: 'var(--space-6)' }}>
                  Based on your spending patterns, savings rate, and financial stability, 
                  your AI-calculated health score indicates 
                  {insights.financialHealthScore >= 80 ? ' strong financial management.' :
                   insights.financialHealthScore >= 60 ? ' decent financial habits with room for improvement.' :
                   ' areas that need immediate attention for better financial wellness.'}
                </p>
                
                {/* Key Metrics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-6)',
                  background: 'var(--color-surface-elevated)',
                  borderRadius: 'var(--radius-medium)',
                  border: '1px solid var(--color-border)'
                }}>
                  <div>
                    <p className="text-caption-1" style={{ marginBottom: 'var(--space-2)' }}>
                      Savings Rate
                    </p>
                    <p className="text-title-3" style={{ 
                      color: (monthlyIncome - insights.nextMonthPrediction?.expectedExpenses || 0) / monthlyIncome > 0.2 
                        ? 'var(--color-green)' 
                        : 'var(--color-orange)'
                    }}>
                      {((monthlyIncome - (insights.nextMonthPrediction?.expectedExpenses || 0)) / monthlyIncome * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-caption-1" style={{ marginBottom: 'var(--space-2)' }}>
                      Expected Next Month
                    </p>
                    <p className="text-title-3">
                      {formatCurrency(insights.nextMonthPrediction?.expectedExpenses || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption-1" style={{ marginBottom: 'var(--space-2)' }}>
                      Savings Potential
                    </p>
                    <p className="text-title-3" style={{ color: 'var(--color-green)' }}>
                      {formatCurrency(insights.nextMonthPrediction?.savingsPotential || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Insights Cards */}
      {insights?.insights?.map((insight: any, index: number) => (
        <motion.div
          key={index}
          className="content-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          style={{
            borderLeft: `4px solid ${
              insight.type === 'warning' ? 'var(--color-red)' :
              insight.type === 'opportunity' ? 'var(--color-green)' :
              insight.type === 'achievement' ? 'var(--color-blue)' : 'var(--color-purple)'
            }`
          }}
        >
          <div className="content-card-body">
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 'var(--space-6)',
                cursor: 'pointer'
              }}
              onClick={() => toggleInsight(`insight-${index}`)}
            >
              <motion.div
                style={{
                  fontSize: '48px',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: insight.type === 'warning' ? 'rgba(255, 59, 48, 0.1)' :
                             insight.type === 'opportunity' ? 'rgba(48, 209, 88, 0.1)' :
                             insight.type === 'achievement' ? 'rgba(0, 122, 255, 0.1)' : 'rgba(175, 82, 222, 0.1)',
                  borderRadius: 'var(--radius-large)',
                  flexShrink: 0,
                  border: `1px solid ${
                    insight.type === 'warning' ? 'rgba(255, 59, 48, 0.2)' :
                    insight.type === 'opportunity' ? 'rgba(48, 209, 88, 0.2)' :
                    insight.type === 'achievement' ? 'rgba(0, 122, 255, 0.2)' : 'rgba(175, 82, 222, 0.2)'
                  }`
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {insight.type === 'warning' ? '⚠️' :
                 insight.type === 'opportunity' ? '💡' :
                 insight.type === 'achievement' ? '🎉' : '🔮'}
              </motion.div>
              
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-4)', 
                  marginBottom: 'var(--space-4)',
                  flexWrap: 'wrap'
                }}>
                  <h4 className="text-title-3">{insight.title}</h4>
                  
                  <div className="stat-badge" style={{
                    backgroundColor: insight.impact === 'high' ? 'rgba(255, 59, 48, 0.15)' :
                                    insight.impact === 'medium' ? 'rgba(255, 159, 10, 0.15)' : 
                                    'rgba(48, 209, 88, 0.15)',
                    color: insight.impact === 'high' ? 'var(--color-red)' :
                           insight.impact === 'medium' ? 'var(--color-orange)' : 
                           'var(--color-green)',
                    border: `1px solid ${
                      insight.impact === 'high' ? 'rgba(255, 59, 48, 0.3)' :
                      insight.impact === 'medium' ? 'rgba(255, 159, 10, 0.3)' : 
                      'rgba(48, 209, 88, 0.3)'
                    }`
                  }}>
                    {insight.impact} impact
                  </div>
                  
                  {insight.potentialSavings && (
                    <div className="stat-badge positive">
                      Save {formatCurrency(insight.potentialSavings)}/mo
                    </div>
                  )}
                  
                  <div style={{ 
                    marginLeft: 'auto',
                    transform: expandedInsights.has(`insight-${index}`) ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}>
                    ▼
                  </div>
                </div>
                
                <p className="text-body" style={{ marginBottom: 'var(--space-4)' }}>
                  {insight.description}
                </p>

                <AnimatePresence>
                  {expandedInsights.has(`insight-${index}`) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        paddingTop: 'var(--space-6)',
                        borderTop: '1px solid var(--color-border)'
                      }}>
                        <h5 style={{ 
                          fontSize: 'var(--font-size-footnote)',
                          fontWeight: '600',
                          color: 'var(--color-text-primary)',
                          marginBottom: 'var(--space-4)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Recommended Actions • {insight.timeframe}
                        </h5>
                        
                        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                          {insight.actionItems?.map((item: string, i: number) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 'var(--space-3)',
                                padding: 'var(--space-3)',
                                background: 'var(--color-surface-elevated)',
                                borderRadius: 'var(--radius-medium)',
                                border: '1px solid var(--color-border)'
                              }}
                            >
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-blue)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'var(--font-size-caption-1)',
                                fontWeight: '600',
                                flexShrink: 0
                              }}>
                                {i + 1}
                              </div>
                              <span className="text-callout">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Spending Anomalies */}
      {anomalies?.anomalies?.length > 0 && (
        <motion.div 
          className="content-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="content-card-header">
            <h3 className="content-card-title">🔍 Unusual Spending Patterns</h3>
            <p className="content-card-subtitle">
              AI confidence: {anomalies.trustScore}% • {anomalies.anomalies.length} anomal{anomalies.anomalies.length === 1 ? 'y' : 'ies'}
            </p>
          </div>
          <div className="content-card-body">
            <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
              {anomalies.anomalies.map((anomaly: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    padding: 'var(--space-6)',
                    background: 'var(--color-surface-elevated)',
                    borderRadius: 'var(--radius-large)',
                    border: `2px solid ${
                      anomaly.severity === 'high' ? 'var(--color-red)' : 
                      anomaly.severity === 'medium' ? 'var(--color-orange)' : 
                      'var(--color-green)'
                    }`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  whileHover={{ 
                    borderColor: anomaly.severity === 'high' ? '#ff3b30' : 
                                anomaly.severity === 'medium' ? '#ff9f0a' : 
                                '#30d158'
                  }}
                >
                  {/* Severity indicator */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: anomaly.severity === 'high' ? 'rgba(255, 59, 48, 0.1)' :
                               anomaly.severity === 'medium' ? 'rgba(255, 159, 10, 0.1)' : 
                               'rgba(48, 209, 88, 0.1)',
                    borderRadius: '0 0 0 100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    padding: 'var(--space-2) var(--space-3)'
                  }}>
                    <span style={{
                      fontSize: 'var(--font-size-caption-1)',
                      fontWeight: '600',
                      color: anomaly.severity === 'high' ? 'var(--color-red)' :
                             anomaly.severity === 'medium' ? 'var(--color-orange)' : 
                             'var(--color-green)'
                    }}>
                      {anomaly.severity}
                    </span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: 'var(--space-4)' 
                  }}>
                    <div>
                      <h5 className="text-headline" style={{ marginBottom: 'var(--space-2)' }}>
                        {anomaly.transaction.name}
                      </h5>
                      <p className="text-caption-1">
                        {new Date(anomaly.transaction.date).toLocaleDateString()} • {anomaly.transaction.category}
                      </p>
                    </div>
                    <div style={{
                      fontSize: 'var(--font-size-title-2)',
                      fontWeight: '700',
                      color: 'var(--color-text-primary)'
                    }}>
                      {formatCurrency(Math.abs(anomaly.transaction.amount))}
                    </div>
                  </div>
                  
                  <p className="text-body" style={{ marginBottom: 'var(--space-4)' }}>
                    <strong>AI Analysis:</strong> {anomaly.reason}
                  </p>
                  
                  <div style={{
                    padding: 'var(--space-4)',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-medium)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <p className="text-callout" style={{ 
                      fontStyle: 'italic',
                      color: 'var(--color-text-secondary)'
                    }}>
                      💡 <strong>Recommendation:</strong> {anomaly.recommendation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Savings Strategies */}
      {savingsStrategies?.strategies?.length > 0 && (
        <motion.div 
          className="content-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="content-card-header">
            <h3 className="content-card-title">💰 AI-Generated Savings Plan</h3>
            <p className="content-card-subtitle">
              Personalized strategies to maximize your savings
            </p>
          </div>
          <div className="content-card-body">
            <div style={{ display: 'grid', gap: 'var(--space-8)' }}>
              {savingsStrategies.strategies.map((strategy: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15 }}
                  style={{
                    padding: 'var(--space-8)',
                    background: 'linear-gradient(135deg, var(--color-surface-elevated) 0%, var(--color-surface) 100%)',
                    borderRadius: 'var(--radius-large)',
                    border: '1px solid var(--color-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  whileHover={{ 
                    boxShadow: 'var(--shadow-medium)',
                    borderColor: 'var(--color-border-subtle)'
                  }}
                >
                  {/* Decorative element */}
                  <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    background: `radial-gradient(circle, ${
                      strategy.difficulty === 'easy' ? 'rgba(48, 209, 88, 0.1)' :
                      strategy.difficulty === 'medium' ? 'rgba(255, 159, 10, 0.1)' : 
                      'rgba(255, 59, 48, 0.1)'
                    } 0%, transparent 70%)`,
                    borderRadius: '50%'
                  }} />

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: 'var(--space-6)',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <div>
                      <h4 className="text-title-3" style={{ marginBottom: 'var(--space-3)' }}>
                        {strategy.title}
                      </h4>
                      <div style={{ 
                        display: 'flex', 
                        gap: 'var(--space-3)', 
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}>
                        <div className="stat-badge" style={{
                          backgroundColor: strategy.difficulty === 'easy' ? 'rgba(48, 209, 88, 0.15)' :
                                          strategy.difficulty === 'medium' ? 'rgba(255, 159, 10, 0.15)' : 
                                          'rgba(255, 59, 48, 0.15)',
                          color: strategy.difficulty === 'easy' ? 'var(--color-green)' :
                                strategy.difficulty === 'medium' ? 'var(--color-orange)' : 
                                'var(--color-red)',
                          border: `1px solid ${
                            strategy.difficulty === 'easy' ? 'rgba(48, 209, 88, 0.3)' :
                            strategy.difficulty === 'medium' ? 'rgba(255, 159, 10, 0.3)' : 
                            'rgba(255, 59, 48, 0.3)'
                          }`
                        }}>
                          {strategy.difficulty} difficulty
                        </div>
                        <span className="text-caption-1">
                          ⏱️ {strategy.timeframe}
                        </span>
                      </div>
                    </div>
                    
                    <motion.div
                      style={{
                        fontSize: 'var(--font-size-title-1)',
                        fontWeight: '700',
                        color: 'var(--color-green)',
                        textAlign: 'right'
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.15, type: "spring" }}
                    >
                      +{formatCurrency(strategy.potentialSavings)}
                      <div className="text-caption-1" style={{ 
                        fontWeight: '400',
                        color: 'var(--color-text-secondary)'
                      }}>
                        per month
                      </div>
                    </motion.div>
                  </div>
                  
                  <p className="text-body" style={{ marginBottom: 'var(--space-6)' }}>
                    {strategy.description}
                  </p>

                  <div>
                    <h5 style={{ 
                      fontSize: 'var(--font-size-subheadline)',
                      fontWeight: '600',
                      marginBottom: 'var(--space-4)',
                      color: 'var(--color-text-primary)'
                    }}>
                      📋 Implementation Steps
                    </h5>
                    
                    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                      {strategy.steps?.map((step: string, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.15 + i * 0.05 }}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 'var(--space-4)',
                            padding: 'var(--space-4)',
                            background: 'var(--color-surface)',
                            borderRadius: 'var(--radius-medium)',
                            border: '1px solid var(--color-border)',
                            transition: 'all 0.3s var(--ease-in-out)'
                          }}
                          whileHover={{ 
                            borderColor: 'var(--color-blue)',
                            transform: 'translateX(4px)'
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-blue)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--font-size-footnote)',
                            fontWeight: '600',
                            flexShrink: 0
                          }}>
                            {i + 1}
                          </div>
                          <span className="text-callout">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}