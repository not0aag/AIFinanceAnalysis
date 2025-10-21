'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FinancialGoal } from '@/types/finance'
import { formatCurrency, parseAmount } from '@/lib/finance-utils'
import GoalForm from '@/components/goals/GoalForm'

interface GoalProgressProps {
  goals: FinancialGoal[]
  onGoalUpdate: (goals: FinancialGoal[]) => void
}

export default function GoalProgress({ goals, onGoalUpdate }: GoalProgressProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null)

  const handleSaveGoal = (goalData: Omit<FinancialGoal, 'id' | 'userId'>) => {
    if (editingGoal) {
      const updated = goals.map(g => 
        g.id === editingGoal.id ? { ...goalData, id: editingGoal.id, userId: editingGoal.userId } : g
      )
      onGoalUpdate(updated)
    } else {
      const newGoal: FinancialGoal = {
        ...goalData,
        id: Date.now().toString(),
        userId: 'user-1'
      }
      onGoalUpdate([...goals, newGoal])
    }
    setShowForm(false)
    setEditingGoal(null)
  }

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      onGoalUpdate(goals.filter(g => g.id !== goalId))
    }
  }

  const handleContribute = (goalId: string, amount: number) => {
    const updated = goals.map(g => {
      if (g.id === goalId) {
        const newAmount = Math.min(g.currentAmount + amount, g.targetAmount)
        const milestones = g.milestones?.map(m => ({
          ...m,
          reached: (newAmount / g.targetAmount) * 100 >= m.percentage,
          reachedDate: m.reached ? m.reachedDate : 
            (newAmount / g.targetAmount) * 100 >= m.percentage ? new Date().toISOString() : undefined
        }))
        return { ...g, currentAmount: newAmount, milestones }
      }
      return g
    })
    onGoalUpdate(updated)
  }

  const sortedGoals = [...goals].sort((a, b) => {
    // Sort by priority first, then by deadline
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  })

  return (
    <div className="content-card">
      <div className="content-card-header">
        <div>
          <h3 className="content-card-title">Financial Goals</h3>
          <p className="content-card-subtitle">
            {goals.length} active goal{goals.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <motion.button
          className="btn btn-primary"
          onClick={() => {
            setEditingGoal(null)
            setShowForm(true)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            fontSize: 'var(--font-size-footnote)'
          }}
        >
          + Add Goal
        </motion.button>
      </div>
      
      <div className="content-card-body">
        {sortedGoals.length > 0 ? (
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {sortedGoals.map((goal, index) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
              const monthlyRequired = daysLeft > 0 ? (goal.targetAmount - goal.currentAmount) / (daysLeft / 30) : 0

              return (
                <motion.div
                  key={`${goal.id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    padding: 'var(--space-6)',
                    background: 'var(--color-surface-elevated)',
                    borderRadius: 'var(--radius-large)',
                    border: '1px solid var(--color-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  whileHover={{ 
                    borderColor: 'var(--color-border-subtle)',
                    boxShadow: 'var(--shadow-small)'
                  }}
                >
                  {/* Priority Badge */}
                  <div style={{
                    position: 'absolute',
                    top: 'var(--space-3)',
                    right: 'var(--space-3)',
                    padding: 'var(--space-1) var(--space-3)',
                    borderRadius: 'var(--radius-extra-large)',
                    fontSize: 'var(--font-size-caption-1)',
                    fontWeight: '600',
                    background: goal.priority === 'high' ? 'rgba(255, 59, 48, 0.15)' :
                               goal.priority === 'medium' ? 'rgba(255, 159, 10, 0.15)' : 
                               'rgba(48, 209, 88, 0.15)',
                    color: goal.priority === 'high' ? 'var(--color-red)' :
                           goal.priority === 'medium' ? 'var(--color-orange)' : 
                           'var(--color-green)',
                    border: `1px solid ${
                      goal.priority === 'high' ? 'rgba(255, 59, 48, 0.3)' :
                      goal.priority === 'medium' ? 'rgba(255, 159, 10, 0.3)' : 
                      'rgba(48, 209, 88, 0.3)'
                    }`
                  }}>
                    {goal.priority}
                  </div>

                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <h4 className="text-headline" style={{ marginBottom: 'var(--space-2)' }}>
                      {goal.name}
                    </h4>
                    <p className="text-caption-1">
                      {goal.category} • {daysLeft} days left
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--space-2)'
                    }}>
                      <span className="text-footnote">
                        {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                      </span>
                      <span className="text-footnote" style={{ fontWeight: '600' }}>
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    
                    <div style={{
                      height: '8px',
                      background: 'var(--color-surface)',
                      borderRadius: 'var(--radius-extra-large)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <motion.div
                        style={{
                          height: '100%',
                          background: progress >= 100 ? 'var(--color-green)' :
                                     progress >= 75 ? 'var(--color-blue)' :
                                     progress >= 50 ? 'var(--color-orange)' : 
                                     'var(--color-red)',
                          borderRadius: 'var(--radius-extra-large)'
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                      
                      {/* Milestone markers */}
                      {goal.milestones?.map((milestone, i) => (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            left: `${milestone.percentage}%`,
                            top: 0,
                            bottom: 0,
                            width: '2px',
                            background: milestone.reached ? 'var(--color-green)' : 'var(--color-border)',
                            opacity: 0.5
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-4)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    <div>
                      <p className="text-caption-1">Monthly Target</p>
                      <p className="text-headline" style={{ color: 'var(--color-blue)' }}>
                        {formatCurrency(monthlyRequired)}
                      </p>
                    </div>
                    <div>
                      <p className="text-caption-1">Remaining</p>
                      <p className="text-headline">
                        {formatCurrency(goal.targetAmount - goal.currentAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const amount = parseAmount(prompt('Enter contribution amount:') || '0')
                        if (amount > 0) handleContribute(goal.id, amount)
                      }}
                      style={{ 
                        flex: 1,
                        padding: 'var(--space-2) var(--space-4)',
                        fontSize: 'var(--font-size-footnote)'
                      }}
                    >
                      + Contribute
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingGoal(goal)
                        setShowForm(true)
                      }}
                      style={{ 
                        padding: 'var(--space-2) var(--space-3)',
                        fontSize: 'var(--font-size-footnote)'
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleDeleteGoal(goal.id)}
                      style={{ 
                        padding: 'var(--space-2) var(--space-3)',
                        fontSize: 'var(--font-size-footnote)',
                        color: 'var(--color-red)'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <motion.div
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, var(--color-purple) 0%, #9333ea 100%)',
                borderRadius: 'var(--radius-large)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4) auto',
                fontSize: '40px',
                color: 'white'
              }}
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              🎯
            </motion.div>
            <h4 className="text-headline" style={{ marginBottom: 'var(--space-2)' }}>
              No Goals Yet
            </h4>
            <p className="text-footnote" style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-4)'
            }}>
              Set financial goals to track your progress
            </p>
            <motion.button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create First Goal
            </motion.button>
          </div>
        )}
      </div>

      {/* Goal Form Modal */}
      <AnimatePresence>
        {showForm && (
          <GoalForm
            goal={editingGoal}
            onSave={handleSaveGoal}
            onClose={() => {
              setShowForm(false)
              setEditingGoal(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}