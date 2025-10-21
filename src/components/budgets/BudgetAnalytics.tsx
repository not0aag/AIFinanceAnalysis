'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Budget, Transaction } from '@/types/finance'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface BudgetAnalyticsProps {
  budgets: Budget[]
  transactions: Transaction[]
  period: 'weekly' | 'monthly' | 'yearly'
}

export default function BudgetAnalytics({ budgets, transactions, period }: BudgetAnalyticsProps) {
  const filteredBudgets = budgets.filter(b => b.period === period)
  
  const chartData = useMemo(() => {
    return filteredBudgets.map(budget => ({
      category: budget.category,
      allocated: budget.allocated,
      spent: budget.spent || 0,
      remaining: Math.max(0, budget.allocated - (budget.spent || 0))
    }))
  }, [filteredBudgets])

  const totalAllocated = filteredBudgets.reduce((sum, b) => sum + b.allocated, 0)
  const totalSpent = filteredBudgets.reduce((sum, b) => sum + (b.spent || 0), 0)
  const utilizationRate = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0

  const overBudgetCount = filteredBudgets.filter(b => (b.spent || 0) > b.allocated).length
  const onTrackCount = filteredBudgets.filter(b => {
    const spent = b.spent || 0
    return spent <= b.allocated && spent > b.allocated * 0.5
  }).length

  if (filteredBudgets.length === 0) {
    return (
      <div className="content-card">
        <div className="content-card-header">
          <h3 className="content-card-title">Budget Analytics</h3>
        </div>
        <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
          <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
            Create a {period} budget to see analytics
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Budget Analytics</h3>
        <p className="content-card-subtitle">Performance insights for {period} budgets</p>
      </div>
      <div className="content-card-body">
        {/* Summary Stats */}
        <div className="grid grid-3" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: 'var(--space-6)',
              background: 'var(--color-surface-elevated)',
              borderRadius: 'var(--radius-large)',
              border: '1px solid var(--color-border)'
            }}
          >
            <p className="text-caption-1" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
              Utilization Rate
            </p>
            <p className="text-title-1" style={{ 
              color: utilizationRate > 90 ? 'var(--color-red)' : 
                     utilizationRate > 70 ? 'var(--color-orange)' : 'var(--color-green)'
            }}>
              {utilizationRate.toFixed(1)}%
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              padding: 'var(--space-6)',
              background: 'var(--color-surface-elevated)',
              borderRadius: 'var(--radius-large)',
              border: '1px solid var(--color-border)'
            }}
          >
            <p className="text-caption-1" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
              On Track
            </p>
            <p className="text-title-1" style={{ color: 'var(--color-green)' }}>
              {onTrackCount}/{filteredBudgets.length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              padding: 'var(--space-6)',
              background: 'var(--color-surface-elevated)',
              borderRadius: 'var(--radius-large)',
              border: '1px solid var(--color-border)'
            }}
          >
            <p className="text-caption-1" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
              Over Budget
            </p>
            <p className="text-title-1" style={{ color: overBudgetCount > 0 ? 'var(--color-red)' : 'var(--color-green)' }}>
              {overBudgetCount}
            </p>
          </motion.div>
        </div>

        {/* Budget Comparison Chart */}
        <div style={{ marginTop: 'var(--space-8)' }}>
          <h4 className="text-headline" style={{ marginBottom: 'var(--space-4)' }}>
            Budget vs Actual Spending
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="category" 
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  background: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-medium)',
                  color: 'var(--color-text-primary)'
                }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Bar dataKey="allocated" fill="var(--color-blue)" name="Budgeted" radius={[8, 8, 0, 0]} />
              <Bar dataKey="spent" name="Spent" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.spent > entry.allocated ? 'var(--color-red)' : 'var(--color-green)'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div style={{ 
          marginTop: 'var(--space-8)',
          padding: 'var(--space-6)',
          background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(0, 122, 255, 0.05) 100%)',
          borderRadius: 'var(--radius-large)',
          border: '1px solid rgba(0, 122, 255, 0.2)'
        }}>
          <h4 className="text-headline" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-blue)' }}>
            💡 Quick Insights
          </h4>
          <ul style={{ 
            display: 'grid', 
            gap: 'var(--space-3)',
            listStyle: 'none',
            padding: 0
          }}>
            {utilizationRate < 50 && (
              <li className="text-body">
                ✓ You're doing great! You've only used {utilizationRate.toFixed(1)}% of your budgets
              </li>
            )}
            {overBudgetCount > 0 && (
              <li className="text-body" style={{ color: 'var(--color-red)' }}>
                ⚠️ {overBudgetCount} budget{overBudgetCount > 1 ? 's are' : ' is'} over the limit
              </li>
            )}
            {onTrackCount === filteredBudgets.length && (
              <li className="text-body" style={{ color: 'var(--color-green)' }}>
                🎉 All budgets are on track! Keep up the great work!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}