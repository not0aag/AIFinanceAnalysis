'use client'

import { motion } from 'framer-motion'
import { FinancialMetrics } from '@/types/finance'
import { formatCurrency, formatPercentage } from '@/lib/finance-utils'

interface QuickStatsProps {
  metrics: FinancialMetrics
  period: 'week' | 'month' | 'year'
}

export default function QuickStats({ metrics, period }: QuickStatsProps) {
  const stats = [
    {
      title: 'Net Worth',
      value: metrics.netWorth,
      change: metrics.netWorthChange,
      icon: '💎',
      color: 'blue',
      gradient: 'linear-gradient(135deg, var(--color-blue) 0%, var(--color-blue-dark) 100%)',
      description: `Total assets minus liabilities`
    },
    {
      title: 'Monthly Income',
      value: metrics.income,
      change: metrics.incomeChange,
      icon: '💰',
      color: 'green',
      gradient: 'linear-gradient(135deg, var(--color-green) 0%, var(--color-green-dark) 100%)',
      description: `Average per ${period}`
    },
    {
      title: 'Monthly Expenses',
      value: metrics.expenses,
      change: metrics.expenseChange,
      icon: '💸',
      color: 'red',
      gradient: 'linear-gradient(135deg, var(--color-red) 0%, #dc2626 100%)',
      description: `${metrics.topCategory} is highest`
    },
    {
      title: 'Savings Rate',
      value: metrics.savingsRate,
      change: metrics.savingsRateChange,
      icon: '🎯',
      color: 'purple',
      gradient: 'linear-gradient(135deg, var(--color-purple) 0%, #9333ea 100%)',
      description: `${metrics.savingsRate >= 20 ? 'Excellent!' : 'Can improve'}`,
      isPercentage: true
    }
  ]

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: 'var(--shadow-large)'
          }}
        >
          <div className="stat-header">
            <motion.div 
              className={`stat-icon ${stat.color}`}
              style={{ background: stat.gradient }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {stat.icon}
            </motion.div>
            <motion.div 
              className={`stat-badge ${stat.change >= 0 ? 'positive' : 'negative'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
            >
              {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(1)}%
            </motion.div>
          </div>
          
          <div className="stat-label">{stat.title}</div>
          
          <div className="stat-value">
            {stat.isPercentage 
              ? `${stat.value.toFixed(0)}%`
              : formatCurrency(stat.value)
            }
          </div>
          
          <div className="stat-change">
            {stat.description}
          </div>
          
          {/* Mini chart */}
          <div style={{ 
            marginTop: 'var(--space-4)',
            height: '40px',
            position: 'relative'
          }}>
            <svg width="100%" height="40" style={{ opacity: 0.3 }}>
              <motion.path
                d={`M 0 30 Q 30 ${stat.change >= 0 ? 20 : 35} 60 25 T 120 ${stat.change >= 0 ? 15 : 35}`}
                stroke={stat.change >= 0 ? 'var(--color-green)' : 'var(--color-red)'}
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              />
            </svg>
          </div>
        </motion.div>
      ))}
    </div>
  )
}