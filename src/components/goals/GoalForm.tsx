'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { FinancialGoal } from '@/types/finance'
import { parseAmount } from '@/lib/finance-utils'

interface GoalFormProps {
  goal?: FinancialGoal | null
  onSave: (goal: Omit<FinancialGoal, 'id' | 'userId'>) => void
  onClose: () => void
}

export default function GoalForm({ goal, onSave, onClose }: GoalFormProps) {
  const [formData, setFormData] = useState({
    name: goal?.name || '',
    category: goal?.category || 'savings',
    targetAmount: goal?.targetAmount || 0,
    currentAmount: goal?.currentAmount || 0,
    deadline: goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
    priority: goal?.priority || 'medium',
    autoSave: goal?.autoSave || false,
    linkedAccount: goal?.linkedAccount || undefined,
    notes: goal?.notes || undefined
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      alert('Please fill in all required fields')
      return
    }

    onSave({
      name: formData.name,
      category: formData.category as any,
      targetAmount: parseAmount(formData.targetAmount.toString()),
      currentAmount: parseAmount(formData.currentAmount.toString()),
      deadline: new Date(formData.deadline).toISOString(),
      priority: formData.priority as any,
      autoSave: formData.autoSave,
      linkedAccount: formData.linkedAccount,
      notes: formData.notes
    })
  }

  return (
    <motion.div 
      className="modal-overlay" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-6)'
        }}>
          <h2 className="text-title-1">
            {goal ? 'Edit Goal' : 'Create New Goal'}
          </h2>
          <button 
            onClick={onClose} 
            className="modal-close"
            style={{
              fontSize: '32px',
              lineHeight: '1',
              padding: '0',
              width: '40px',
              height: '40px'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {/* Goal Name */}
          <div className="form-group">
            <label className="form-label">
              Goal Name *
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Emergency Fund, Vacation, New Car"
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">
              Category *
            </label>
            <select
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="savings">💰 Savings</option>
              <option value="investment">📈 Investment</option>
              <option value="debt">💳 Debt Payoff</option>
              <option value="emergency">🚨 Emergency Fund</option>
              <option value="travel">✈️ Travel</option>
              <option value="education">🎓 Education</option>
              <option value="home">🏠 Home</option>
              <option value="other">📌 Other</option>
            </select>
          </div>

          {/* Target Amount & Current Amount */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">
                Target Amount *
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.targetAmount || ''}
                onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Current Amount
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.currentAmount || ''}
                onChange={(e) => setFormData({ ...formData, currentAmount: Number(e.target.value) })}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Deadline & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">
                Deadline *
              </label>
              <input
                type="date"
                className="form-input"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Priority
              </label>
              <select
                className="form-input"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">
              Notes (Optional)
            </label>
            <textarea
              className="form-input"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional details about this goal..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Auto-Save Toggle */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.autoSave}
                onChange={(e) => setFormData({ ...formData, autoSave: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <span className="text-footnote">
                Enable automatic savings towards this goal
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-3)', 
            marginTop: 'var(--space-4)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--color-border)'
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {goal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}