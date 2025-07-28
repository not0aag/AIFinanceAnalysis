'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Transaction, FinancialGoal, FinancialProfile } from '@/types/finance'

interface FinancialHealthScoreProps {
  transactions: Transaction[]
  goals: FinancialGoal[]
  monthlyIncome: number
}

export default function FinancialHealthScore({ transactions, goals, monthlyIncome }: FinancialHealthScoreProps) {
  const [healthScore, setHealthScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<any[]>([])

  useEffect(() => {
    const calculateHealthScore = async () => {
      if (transactions.length === 0) {
        setLoading(false)
        return
      }

      try {
        // Calculate expenses for profile
        const monthlyExpenses = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)

        // Create financial profile
        const profile: FinancialProfile = {
          userId: 'user-1',
          monthlyIncome,
          monthlyExpenses,
          savingsGoal: Math.max(1000, monthlyIncome * 0.2),
          riskTolerance: 'moderate',
          financialGoals: goals || [],
          preferences: {
            currency: 'USD',
            timezone: 'UTC',
            fiscalYearStart: 1,
            notifications: {
              email: true,
              push: true,
              sms: false
            }
          }
        }

        // Call our AI analysis
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
            financialGoals: goals.map(g => g.name) || []
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.insights && data.insights.financialHealthScore) {
            setHealthScore(data.insights.financialHealthScore)
            setInsights(data.insights.insights || [])
          }
        }
      } catch (error) {
        console.error('Error calculating health score:', error)
      } finally {
        setLoading(false)
      }
    }

    calculateHealthScore()
  }, [transactions, monthlyIncome, goals])

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e' // green
    if (score >= 60) return '#eab308' // yellow
    if (score >= 40) return '#f97316' // orange
    return '#ef4444' // red
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  if (loading) {
    return (
      <div className="content-card">
        <div className="content-card-header">
          <h3 className="content-card-title">Financial Health Score</h3>
        </div>
        <div className="content-card-body">
          <div className="loading">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                width: '24px',
                height: '24px',
                border: '2px solid transparent',
                borderTop: '2px solid var(--color-primary)',
                borderRadius: '50%'
              }}
            />
            <span style={{ marginLeft: '8px' }}>Calculating score...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Financial Health Score</h3>
      </div>
      <div className="content-card-body">
        {healthScore !== null ? (
          <div style={{ textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: `8px solid ${getScoreColor(healthScore)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                position: 'relative'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: getScoreColor(healthScore) 
                }}>
                  {healthScore}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'var(--color-text-secondary)' 
                }}>
                  /100
                </div>
              </div>
            </motion.div>
            
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: getScoreColor(healthScore),
              marginBottom: '8px'
            }}>
              {getScoreLabel(healthScore)}
            </div>
            
            {insights.length > 0 && (
              <div style={{ 
                fontSize: '14px', 
                color: 'var(--color-text-secondary)',
                lineHeight: '1.4'
              }}>
                {insights.slice(0, 1).map((insight, index) => (
                  <div key={index}>
                    {insight.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Unable to calculate score. Please ensure you have transaction data.
          </div>
        )}
      </div>
    </div>
  )
}