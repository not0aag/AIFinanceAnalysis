'use client'

import { useState, useEffect } from 'react'

interface AIFinancialAnalystProps {
  transactions: any[]
  monthlyIncome: number
  financialGoals: string[]
}

export default function AIFinancialAnalyst({ 
  transactions, 
  monthlyIncome, 
  financialGoals 
}: AIFinancialAnalystProps) {
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const analyzeFinances = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/ai/financial-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactions,
            monthlyIncome,
            financialGoals
          })
        })

        if (!response.ok) {
          throw new Error('Failed to analyze financial data')
        }

        const data = await response.json()
        setAnalysisData(data)
      } catch (error) {
        console.error('Error analyzing finances:', error)
        setError('Unable to analyze your financial data at this time. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (transactions.length > 0) {
      analyzeFinances()
    } else {
      setLoading(false)
    }
  }, [transactions, monthlyIncome, financialGoals])

  if (loading) {
    return (
      <div className="content-card">
        <div className="loading">
          <div className="loading-spinner"></div>
          <div className="text-body">AI is analyzing your financial data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="content-card">
        <div className="loading">
          <div style={{ 
            fontSize: 'var(--font-size-large-title)',
            marginBottom: 'var(--space-6)'
          }}>⚠️</div>
          <div className="text-body" style={{ 
            color: 'var(--color-red)',
            textAlign: 'center',
            marginBottom: 'var(--space-6)'
          }}>
            {error}
          </div>
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

  if (!analysisData) {
    return (
      <div className="content-card">
        <div className="loading">
          <div style={{ 
            fontSize: 'var(--font-size-large-title)',
            marginBottom: 'var(--space-6)'
          }}>📊</div>
          <div className="text-body">Add some transactions to get AI insights!</div>
        </div>
      </div>
    )
  }

  const { insights, anomalies, savingsStrategies } = analysisData

  return (
    <div className="grid" style={{ gap: 'var(--space-8)' }}>
      {/* Financial Health Score */}
      {insights && (
        <div className="content-card fade-in">
          <div className="content-card-header">
            <h3 className="content-card-title">Financial Health Score</h3>
            <p className="content-card-subtitle">
              Your overall financial wellness based on spending patterns
            </p>
          </div>
          <div className="content-card-body">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-12)',
              flexWrap: 'wrap'
            }}>
              {/* Circular Progress */}
              <div style={{
                position: 'relative',
                width: '160px',
                height: '160px',
                flexShrink: 0
              }}>
                <svg
                  width="160"
                  height="160"
                  style={{ transform: 'rotate(-90deg)' }}
                >
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="var(--color-border)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="var(--color-green)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - insights.financialHealthScore / 100)}`}
                    style={{ 
                      transition: 'stroke-dashoffset 1.5s ease-in-out',
                      strokeLinecap: 'round'
                    }}
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: 'var(--font-size-large-title)',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)'
                  }}>
                    {insights.financialHealthScore}
                  </div>
                  <div className="text-caption-1">Score</div>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '300px' }}>
                <h4 style={{
                  fontSize: 'var(--font-size-title-2)',
                  fontWeight: '600',
                  color: insights.financialHealthScore >= 80 ? 'var(--color-green)' : 
                         insights.financialHealthScore >= 60 ? 'var(--color-orange)' : 'var(--color-red)',
                  marginBottom: 'var(--space-3)'
                }}>
                  {insights.financialHealthScore >= 80 ? 'Excellent' : 
                   insights.financialHealthScore >= 60 ? 'Good' : 'Needs Improvement'}
                </h4>
                <p className="text-body" style={{ marginBottom: 'var(--space-6)' }}>
                  Your financial health reflects your income-to-expense ratio, savings rate, and spending consistency.
                </p>
                
                {/* Next Month Prediction */}
                <div style={{
                  padding: 'var(--space-6)',
                  background: 'var(--color-surface-elevated)',
                  borderRadius: 'var(--radius-medium)',
                  border: '1px solid var(--color-border)'
                }}>
                  <h5 className="text-headline" style={{ marginBottom: 'var(--space-3)' }}>
                    Next Month Forecast
                  </h5>
                  <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
                    <div>
                      <div className="text-caption-1" style={{ marginBottom: 'var(--space-1)' }}>
                        Expected Expenses
                      </div>
                      <div className="text-title-3">
                        ${insights.nextMonthPrediction?.expectedExpenses?.toLocaleString() || '0'}
                      </div>
                    </div>
                    <div>
                      <div className="text-caption-1" style={{ marginBottom: 'var(--space-1)' }}>
                        Savings Potential
                      </div>
                      <div className="text-title-3" style={{ color: 'var(--color-green)' }}>
                        ${insights.nextMonthPrediction?.savingsPotential?.toLocaleString() || '0'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insights?.insights?.map((insight: any, index: number) => (
        <div key={index} className="content-card slide-up" style={{
          borderLeft: `4px solid ${
            insight.type === 'warning' ? 'var(--color-red)' :
            insight.type === 'opportunity' ? 'var(--color-green)' :
            insight.type === 'achievement' ? 'var(--color-blue)' : 'var(--color-blue)'
          }`,
          animationDelay: `${index * 0.1}s`
        }}>
          <div className="content-card-body">
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 'var(--space-6)' 
            }}>
              <div style={{
                fontSize: 'var(--font-size-title-1)',
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: insight.type === 'warning' ? 'rgba(255, 59, 48, 0.1)' :
                           insight.type === 'opportunity' ? 'rgba(48, 209, 88, 0.1)' :
                           insight.type === 'achievement' ? 'rgba(0, 122, 255, 0.1)' : 'rgba(0, 122, 255, 0.1)',
                borderRadius: 'var(--radius-large)',
                flexShrink: 0,
                border: `1px solid ${
                  insight.type === 'warning' ? 'rgba(255, 59, 48, 0.2)' :
                  insight.type === 'opportunity' ? 'rgba(48, 209, 88, 0.2)' :
                  insight.type === 'achievement' ? 'rgba(0, 122, 255, 0.2)' : 'rgba(0, 122, 255, 0.2)'
                }`
              }}>
                {insight.type === 'warning' ? '⚠️' :
                 insight.type === 'opportunity' ? '💡' :
                 insight.type === 'achievement' ? '🎉' : '🔮'}
              </div>
              
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
                                    insight.impact === 'medium' ? 'rgba(255, 159, 10, 0.15)' : 'rgba(48, 209, 88, 0.15)',
                    color: insight.impact === 'high' ? 'var(--color-red)' :
                           insight.impact === 'medium' ? 'var(--color-orange)' : 'var(--color-green)'
                  }}>
                    {insight.impact} impact
                  </div>
                  
                  {insight.potentialSavings && (
                    <div className="stat-badge positive">
                      Save ${insight.potentialSavings}/mo
                    </div>
                  )}
                </div>
                
                <p className="text-body" style={{ marginBottom: 'var(--space-6)' }}>
                  {insight.description}
                </p>

                <div>
                  <h5 style={{ 
                    fontSize: 'var(--font-size-footnote)',
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Action Items ({insight.timeframe})
                  </h5>
                  <div style={{ 
                    display: 'grid',
                    gap: 'var(--space-3)'
                  }}>
                    {insight.actionItems?.map((item: string, i: number) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'var(--space-3)'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-blue)',
                          marginTop: '8px',
                          flexShrink: 0
                        }} />
                        <span className="text-callout">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Spending Anomalies - Only show if there are actual anomalies */}
      {anomalies?.anomalies?.length > 0 && (
        <div className="content-card">
          <div className="content-card-header">
            <h3 className="content-card-title">Unusual Spending Detected</h3>
            <p className="content-card-subtitle">
              Trust Score: {anomalies.trustScore}/100 • {anomalies.anomalies.length} anomal{anomalies.anomalies.length === 1 ? 'y' : 'ies'} found
            </p>
          </div>
          <div className="content-card-body">
            <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
              {anomalies.anomalies.map((anomaly: any, index: number) => (
                <div key={index} style={{
                  padding: 'var(--space-6)',
                  background: 'var(--color-surface-elevated)',
                  borderRadius: 'var(--radius-large)',
                  border: `1px solid ${anomaly.severity === 'high' ? 'var(--color-red)' : 
                                       anomaly.severity === 'medium' ? 'var(--color-orange)' : 'var(--color-green)'}`
                }}>
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
                        {anomaly.transaction.date} • {anomaly.transaction.category}
                      </p>
                    </div>
                    <div style={{
                      fontSize: 'var(--font-size-title-3)',
                      fontWeight: '700',
                      color: 'var(--color-text-primary)',
                      textAlign: 'right'
                    }}>
                      ${Math.abs(anomaly.transaction.amount).toFixed(2)}
                      <div className="text-caption-1" style={{ fontWeight: '400' }}>
                        {anomaly.severity} severity
                      </div>
                    </div>
                  </div>
                  <p className="text-body" style={{ marginBottom: 'var(--space-3)' }}>
                    {anomaly.reason}
                  </p>
                  <p className="text-callout" style={{ 
                    fontStyle: 'italic',
                    color: 'var(--color-text-secondary)'
                  }}>
                    💡 {anomaly.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Savings Strategies */}
      {savingsStrategies?.strategies?.length > 0 && (
        <div className="content-card">
          <div className="content-card-header">
            <h3 className="content-card-title">AI-Powered Savings Strategies</h3>
            <p className="content-card-subtitle">
              Personalized recommendations to maximize your savings potential
            </p>
          </div>
          <div className="content-card-body">
            <div style={{ display: 'grid', gap: 'var(--space-8)' }}>
              {savingsStrategies.strategies.map((strategy: any, index: number) => (
                <div key={index} style={{
                  padding: 'var(--space-8)',
                  background: 'var(--color-surface-elevated)',
                  borderRadius: 'var(--radius-large)',
                  border: '1px solid var(--color-border)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: 'var(--space-6)' 
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
                                          strategy.difficulty === 'medium' ? 'rgba(255, 159, 10, 0.15)' : 'rgba(255, 59, 48, 0.15)',
                          color: strategy.difficulty === 'easy' ? 'var(--color-green)' :
                                strategy.difficulty === 'medium' ? 'var(--color-orange)' : 'var(--color-red)'
                        }}>
                          {strategy.difficulty}
                        </div>
                        <span className="text-caption-1">
                          {strategy.timeframe}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      fontSize: 'var(--font-size-title-2)',
                      fontWeight: '700',
                      color: 'var(--color-green)',
                      textAlign: 'right'
                    }}>
                      +${strategy.potentialSavings}
                      <div className="text-caption-1" style={{ fontWeight: '400' }}>
                        per month
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-body" style={{ marginBottom: 'var(--space-6)' }}>
                    {strategy.description}
                  </p>

                  <div>
                    <h5 style={{ 
                      fontSize: 'var(--font-size-footnote)',
                      fontWeight: '600',
                      marginBottom: 'var(--space-4)',
                      color: 'var(--color-text-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Implementation Steps
                    </h5>
                    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                      {strategy.steps?.map((step: string, i: number) => (
                        <div key={i} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 'var(--space-4)'
                        }}>
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
                            flexShrink: 0,
                            marginTop: '2px'
                          }}>
                            {i + 1}
                          </div>
                          <span className="text-callout">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}