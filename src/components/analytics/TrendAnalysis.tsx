'use client'

import { SpendingPattern } from '@/types/finance'
import { formatCurrency } from '@/lib/finance-utils'

interface TrendAnalysisProps {
  patterns: SpendingPattern[]
  selectedCategory: string | null
}

export default function TrendAnalysis({ patterns, selectedCategory }: TrendAnalysisProps) {
  const displayPatterns = selectedCategory 
    ? patterns.filter(p => p.category === selectedCategory)
    : patterns.slice(0, 5)

  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Spending Trends</h3>
        <p className="content-card-subtitle">Category analysis</p>
      </div>
      <div className="content-card-body">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {displayPatterns.map((pattern, index) => (
            <div
              key={pattern.category}
              style={{
                padding: 'var(--space-4)',
                background: 'var(--color-surface-elevated)',
                borderRadius: 'var(--radius-medium)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-3)'
              }}>
                <h4 className="text-headline">{pattern.category}</h4>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: pattern.trend === 'increasing' ? 'var(--color-red)' :
                         pattern.trend === 'decreasing' ? 'var(--color-green)' : 
                         'var(--color-text-secondary)'
                }}>
                  <span style={{ fontSize: 'var(--font-size-caption-1)' }}>
                    {pattern.trend === 'increasing' ? '↑' :
                     pattern.trend === 'decreasing' ? '↓' : '→'}
                  </span>
                  <span style={{ fontWeight: '600' }}>
                    {Math.abs(pattern.percentageChange).toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-4)'
              }}>
                <div>
                  <p className="text-caption-1">Monthly Avg</p>
                  <p className="text-headline">
                    {formatCurrency(pattern.averageMonthly)}
                  </p>
                </div>
                <div>
                  <p className="text-caption-1">Next Month</p>
                  <p className="text-headline">
                    {formatCurrency(pattern.forecast.nextMonth)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}