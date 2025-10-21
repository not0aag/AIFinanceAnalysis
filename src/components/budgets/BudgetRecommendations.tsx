'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Budget, Transaction } from '@/types/finance'

interface BudgetRecommendationsProps {
  budgets: Budget[]
  transactions: Transaction[]
  onCreateBudget: (budget: any) => void
}

const BUDGET_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Bills & Utilities',
  'Education',
  'Travel'
]

export default function BudgetRecommendations({ budgets, transactions, onCreateBudget }: BudgetRecommendationsProps) {
  const recommendations = useMemo(() => {
    const recs: any[] = []

    // Analyze spending by category
    const categorySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
        return acc
      }, {} as Record<string, number>)

    // Find categories without budgets but have spending
    BUDGET_CATEGORIES.forEach(category => {
      const spending = categorySpending[category] || 0
      const hasBudget = budgets.some(b => b.category === category)

      if (spending > 0 && !hasBudget) {
        const avgMonthly = spending / 3 // Assuming 3 months of data
        const suggested = Math.ceil(avgMonthly * 1.2) // 20% buffer

        recs.push({
          type: 'create',
          category,
          title: `Create ${category} Budget`,
          description: `You've spent $${spending.toFixed(2)} in ${category}. Consider setting a monthly budget.`,
          suggestedAmount: suggested,
          priority: spending > 200 ? 'high' : spending > 50 ? 'medium' : 'low',
          icon: getCategoryIcon(category)
        })
      }
    })

    // Find budgets that are consistently under-utilized
    budgets.forEach(budget => {
      const utilization = budget.spent && budget.allocated > 0 
        ? (budget.spent / budget.allocated) * 100 
        : 0

      if (utilization < 30 && budget.spent && budget.spent > 0) {
        recs.push({
          type: 'reduce',
          category: budget.category,
          title: `Reduce ${budget.category} Budget`,
          description: `You've only used ${utilization.toFixed(0)}% of your budget. Consider reducing it to $${Math.ceil(budget.spent * 1.2)}.`,
          suggestedAmount: Math.ceil(budget.spent * 1.2),
          priority: 'low',
          icon: getCategoryIcon(budget.category)
        })
      }

      // Find budgets consistently over limit
      if (budget.spent && budget.spent > budget.allocated * 1.1) {
        recs.push({
          type: 'increase',
          category: budget.category,
          title: `Increase ${budget.category} Budget`,
          description: `You're consistently over budget. Consider increasing to $${Math.ceil(budget.spent * 1.1)}.`,
          suggestedAmount: Math.ceil(budget.spent * 1.1),
          priority: 'high',
          icon: getCategoryIcon(budget.category)
        })
      }
    })

    // Sort by priority
    return recs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
    })
  }, [budgets, transactions])

  if (recommendations.length === 0) {
    return (
      <div className="content-card">
        <div className="content-card-header">
          <h3 className="content-card-title">AI Budget Recommendations</h3>
        </div>
        <div className="content-card-body" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
          <motion.div
            style={{ fontSize: '60px', marginBottom: 'var(--space-4)' }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🤖
          </motion.div>
          <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
            Your budgets look great! Keep tracking your spending for personalized recommendations.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">AI Budget Recommendations</h3>
        <p className="content-card-subtitle">
          Smart suggestions based on your spending patterns
        </p>
      </div>
      <div className="content-card-body">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {recommendations.slice(0, 5).map((rec, index) => (
            <motion.div
              key={`${rec.category}-${rec.type}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                padding: 'var(--space-6)',
                background: 'var(--color-surface-elevated)',
                borderRadius: 'var(--radius-large)',
                border: `2px solid ${
                  rec.priority === 'high' ? 'var(--color-red)' :
                  rec.priority === 'medium' ? 'var(--color-orange)' : 'var(--color-border)'
                }`,
                position: 'relative'
              }}
            >
              {/* Priority Badge */}
              {rec.priority !== 'low' && (
                <div style={{
                  position: 'absolute',
                  top: 'var(--space-3)',
                  right: 'var(--space-3)',
                  padding: 'var(--space-1) var(--space-3)',
                  background: rec.priority === 'high' ? 'var(--color-red)' : 'var(--color-orange)',
                  color: 'white',
                  borderRadius: 'var(--radius-small)',
                  fontSize: 'var(--font-size-caption-2)',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {rec.priority}
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                <div style={{
                  fontSize: '48px',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-medium)',
                  flexShrink: 0
                }}>
                  {rec.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <h4 className="text-headline" style={{ marginBottom: 'var(--space-2)' }}>
                    {rec.title}
                  </h4>
                  <p className="text-body" style={{ 
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    {rec.description}
                  </p>

                  {rec.type === 'create' && (
                    <motion.button
                      className="btn btn-primary"
                      onClick={() => onCreateBudget({
                        category: rec.category,
                        allocated: rec.suggestedAmount,
                        period: 'monthly',
                        notifications: { enabled: true, threshold: 80 },
                        rollover: false
                      })}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ marginTop: 'var(--space-2)' }}
                    >
                      Create ${rec.suggestedAmount} Budget
                    </motion.button>
                  )}

                  {rec.type !== 'create' && (
                    <div style={{
                      padding: 'var(--space-3)',
                      background: 'var(--color-surface)',
                      borderRadius: 'var(--radius-medium)',
                      marginTop: 'var(--space-3)'
                    }}>
                      <p className="text-callout" style={{ color: 'var(--color-blue)' }}>
                        💡 Suggested: ${rec.suggestedAmount}/month
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Food & Dining': '🍔',
    'Transportation': '🚗',
    'Shopping': '🛍️',
    'Housing': '🏠',
    'Entertainment': '🎬',
    'Healthcare': '⚕️',
    'Bills & Utilities': '📄',
    'Education': '📚',
    'Travel': '✈️',
    'Other': '📌'
  }
  return icons[category] || '💰'
}