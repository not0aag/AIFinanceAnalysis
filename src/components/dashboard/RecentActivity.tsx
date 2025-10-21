'use client'

import { motion } from 'framer-motion'
import { Transaction } from '@/types/finance'
import { formatCurrency } from '@/lib/utils'
import { formatDate } from '@/lib/finance-utils'

interface RecentActivityProps {
  transactions: Transaction[]
  onTransactionEdit?: (transaction: Transaction) => void
}

// Category configuration with images and gradients
const categoryConfig: Record<string, { gradient: string; image: string }> = {
  'Food & Dining': { 
    gradient: 'from-orange-500/20 to-amber-500/20',
    image: '/icons/categories/coffee.jpeg'
  },
  'Shopping': { 
    gradient: 'from-purple-500/20 to-pink-500/20',
    image: '/icons/categories/shopping.jpeg'
  },
  'Housing': { 
    gradient: 'from-blue-500/20 to-cyan-500/20',
    image: '/icons/categories/house.jpeg'
  },
  'Transportation': { 
    gradient: 'from-yellow-500/20 to-orange-500/20',
    image: '/icons/categories/car.jpeg'
  },
  'Travel': { 
    gradient: 'from-indigo-500/20 to-blue-500/20',
    image: '/icons/categories/travel.jpeg'
  },
  'Healthcare': { 
    gradient: 'from-red-500/20 to-pink-500/20',
    image: '/icons/categories/health.jpeg'
  },
  'Utilities': { 
    gradient: 'from-cyan-500/20 to-teal-500/20',
    image: '/icons/categories/power.jpeg'
  },
  'Entertainment': { 
    gradient: 'from-pink-500/20 to-purple-500/20',
    image: '/icons/categories/entertainment.jpeg'
  },
  'Income': { 
    gradient: 'from-green-500/20 to-emerald-500/20',
    image: '/icons/categories/Income.jpeg'
  },
  'Salary': { 
    gradient: 'from-green-600/20 to-teal-600/20',
    image: '/icons/categories/Income.jpeg'
  },
  'Other': { 
    gradient: 'from-gray-500/20 to-slate-500/20',
    image: '/icons/categories/saving.jpeg'
  }
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
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {recentTransactions.map((transaction, index) => {
            const config = categoryConfig[transaction.category] || categoryConfig['Other']
            
            return (
            <motion.div
              key={`${transaction.id}-${index}`}
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
                  minWidth: '40px',
                  minHeight: '40px',
                  maxWidth: '40px',
                  maxHeight: '40px',
                  borderRadius: 'var(--radius-medium)',
                  background: `linear-gradient(to bottom right, ${config.gradient})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <img 
                    src={config.image}
                    alt={transaction.category}
                    width="40"
                    height="40"
                    style={{ 
                      width: '40px', 
                      height: '40px',
                      maxWidth: '40px',
                      maxHeight: '40px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
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
                color: transaction.amount > 0 ? 'var(--color-green)' : 'var(--color-text-primary)'
              }}>
                {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </div>
  )
}