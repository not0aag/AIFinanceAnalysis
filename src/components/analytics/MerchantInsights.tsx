'use client'

import { Transaction } from '@/types/finance'
import { formatCurrency } from '@/lib/finance-utils'

interface MerchantInsightsProps {
  merchants: Array<{ name: string; amount: number; count: number }>
  transactions: Transaction[]
}

export default function MerchantInsights({ merchants, transactions }: MerchantInsightsProps) {
  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Top Merchants</h3>
        <p className="content-card-subtitle">Where you spend most</p>
      </div>
      <div className="content-card-body">
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {merchants.slice(0, 5).map((merchant, index) => (
            <div
              key={merchant.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3)',
                background: 'var(--color-surface-elevated)',
                borderRadius: 'var(--radius-medium)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-medium)',
                  background: `hsl(${index * 60}, 50%, 50%)`,
                  opacity: 0.2
                }} />
                <div>
                  <p className="text-headline">{merchant.name}</p>
                  <p className="text-caption-1">{merchant.count} transactions</p>
                </div>
              </div>
              <p className="text-headline">{formatCurrency(merchant.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}