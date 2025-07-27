'use client'

import { SpendingPattern } from '@/types/finance'
import { formatCurrency } from '@/lib/finance-utils'

interface PredictiveAnalyticsProps {
  predictions: {
    nextMonth: number
    trend: number
    confidence: number
    accuracy: number
  }
  patterns: SpendingPattern[]
}

export default function PredictiveAnalytics({ predictions, patterns }: PredictiveAnalyticsProps) {
  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Predictions</h3>
        <p className="content-card-subtitle">AI-powered forecasting</p>
      </div>
      <div className="content-card-body">
        <div style={{
          padding: 'var(--space-6)',
          background: 'linear-gradient(135deg, var(--color-purple) 0%, var(--color-blue) 100%)',
          borderRadius: 'var(--radius-large)',
          color: 'white',
          marginBottom: 'var(--space-6)'
        }}>
          <h4 style={{ marginBottom: 'var(--space-2)' }}>Next Month Forecast</h4>
          <p style={{ fontSize: 'var(--font-size-title-1)', fontWeight: '700' }}>
            {formatCurrency(predictions.nextMonth)}
          </p>
          <p style={{ fontSize: 'var(--font-size-footnote)', opacity: 0.8 }}>
            {predictions.trend > 0 ? '↑' : '↓'} {Math.abs(predictions.trend).toFixed(0)}% from last month
          </p>
        </div>

        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 'var(--space-3)',
            background: 'var(--color-surface-elevated)',
            borderRadius: 'var(--radius-medium)'
          }}>
            <span>Confidence Level</span>
            <span style={{ fontWeight: '600' }}>{predictions.confidence}%</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 'var(--space-3)',
            background: 'var(--color-surface-elevated)',
            borderRadius: 'var(--radius-medium)'
          }}>
            <span>Model Accuracy</span>
            <span style={{ fontWeight: '600' }}>{predictions.accuracy.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}