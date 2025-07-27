'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Transaction, FinancialMetrics } from '@/types/finance'

interface AIAssistantProps {
  metrics: FinancialMetrics
  transactions: Transaction[]
}

export default function AIAssistant({ metrics, transactions }: AIAssistantProps) {
  const [tip, setTip] = useState('')
  const [isThinking, setIsThinking] = useState(true)

  useEffect(() => {
    // Simulate AI thinking
    const timer = setTimeout(() => {
      const tips = [
        `Your spending is ${metrics.expenseChange > 0 ? 'up' : 'down'} ${Math.abs(metrics.expenseChange).toFixed(0)}% this month. ${metrics.expenseChange > 10 ? 'Consider reviewing your ' + metrics.topCategory + ' expenses.' : 'Great job controlling expenses!'}`,
        `You're saving ${metrics.savingsRate.toFixed(0)}% of your income. ${metrics.savingsRate < 20 ? 'Try to increase this to 20% for better financial health.' : 'Excellent savings rate!'}`,
        `Your top spending category is ${metrics.topCategory}. Have you considered setting a budget for this category?`,
        `With ${transactions.length} transactions this month, you're averaging $${metrics.averageTransactionSize.toFixed(0)} per transaction.`
      ]
      setTip(tips[Math.floor(Math.random() * tips.length)])
      setIsThinking(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [metrics, transactions])

  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">AI Assistant</h3>
        <p className="content-card-subtitle">Quick insights</p>
      </div>
      <div className="content-card-body">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          style={{
            padding: 'var(--space-6)',
            background: 'linear-gradient(135deg, var(--color-purple) 0%, var(--color-blue) 100%)',
            borderRadius: 'var(--radius-large)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '32px', marginBottom: 'var(--space-4)' }}>
              {isThinking ? '🤔' : '💡'}
            </div>
            
            {isThinking ? (
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Analyzing your finances...
              </motion.p>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {tip}
              </motion.p>
            )}
          </div>
        </motion.div>

        <div style={{
          marginTop: 'var(--space-6)',
          display: 'grid',
          gap: 'var(--space-3)'
        }}>
          <button className="btn btn-secondary" style={{ width: '100%' }}>
            Get Full Analysis
          </button>
        </div>
      </div>
    </div>
  )
}