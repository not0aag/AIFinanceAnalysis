'use client'

import { motion } from 'framer-motion'
import { Transaction } from '@/types/finance'
import { formatCurrency, formatDate } from '@/lib/utils'

interface RecentActivityProps {
  transactions: Transaction[]
  onTransactionEdit?: (transaction: Transaction) => void
}

export default function RecentActivity({ transactions, onTransactionEdit }: RecentActivityProps) {
  const recentTransactions = transactions.slice(0, 10)

  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Recent Activity</h3>
        <p className="content-card-subtitle">Your latest transactions</p>
      </div>
      <div className="content-card-body">
        {transactions.length === 0 ? (
          // Empty state when no transactions
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            textAlign: 'center',
            gap: 'var(--space-4)'
          }}>
            <div style={{
              fontSize: '48px',
              opacity: 0.5
            }}>
              📝
            </div>
            <div>
              <h4 style={{
                margin: 0,
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--font-size-headline)',
                fontWeight: '600',
                color: 'var(--color-text-primary)'
              }}>
                No transactions yet
              </h4>
              <p style={{
                margin: 0,
                fontSize: 'var(--font-size-body)',
                color: 'var(--color-text-secondary)'
              }}>
                Click the + button to add your first transaction
              </p>
            </div>
          </div>
        ) : (
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-4)',
                background: 'var(--color-surface-elevated)',
                borderRadius: 'var(--radius-medium)',
                border: '1px solid var(--color-border)',
                cursor: onTransactionEdit ? 'pointer' : 'default'
              }}
              whileHover={{ 
                borderColor: 'var(--color-border-subtle)',
                transform: 'translateX(4px)'
              }}
              onClick={() => onTransactionEdit?.(transaction)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-medium)',
                  background: transaction.amount > 0 ? 'rgba(48, 209, 88, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-size-body)'
                }}>
                  {transaction.amount > 0 ? '💰' : '💸'}
                </div>
                <div>
                  <p className="text-headline">{transaction.name}</p>
                  <p className="text-caption-1">
                    {transaction.category} • {formatDate(transaction.date, 'relative')}
                  </p>
                </div>
              </div>
              <div style={{
                fontWeight: '600',
                color: transaction.amount > 0 ? 'var(--color-green)' : 'var(--color-red)'
              }}>
                {transaction.amount > 0 ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </div>
  )
}