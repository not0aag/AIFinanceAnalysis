'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Budget } from '@/types/finance'
import { parseAmount } from '@/lib/finance-utils'

interface BudgetCreatorProps {
  budget?: Budget | null
  existingBudgets: Budget[]
  transactions: any[]
  onSave: (budget: any) => void
  onClose: () => void
}

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Bills & Utilities',
  'Education',
  'Travel',
  'Other'
]

export default function BudgetCreator({ budget, existingBudgets, transactions, onSave, onClose }: BudgetCreatorProps) {
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    allocated: budget?.allocated || 0,
    period: budget?.period || 'monthly',
    notifications: budget?.notifications || { enabled: true, threshold: 80 },
    rollover: budget?.rollover || false
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Calculate suggested budget based on past spending
  const suggestedAmount = formData.category 
    ? Math.ceil(
        transactions
          .filter(t => t.category === formData.category && t.type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0) / 3 * 1.2
      )
    : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    
    if (formData.allocated <= 0) {
      newErrors.allocated = 'Amount must be greater than 0'
    }
    
    // Check for duplicate category in same period
    const duplicate = existingBudgets.find(
      b => b.category === formData.category && 
           b.period === formData.period && 
           b.id !== budget?.id
    )
    
    if (duplicate) {
      newErrors.category = `You already have a ${formData.period} budget for ${formData.category}`
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    const now = new Date()
    const budgetData = {
      ...formData,
      startDate: budget?.startDate || now.toISOString(),
      endDate: budget?.endDate || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
    
    onSave(budgetData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{ maxWidth: '500px', width: '90%' }}
      >
        <div className="content-card-header">
          <h2 className="content-card-title">
            {budget ? 'Edit Budget' : 'Create Budget'}
          </h2>
          <button 
            onClick={onClose} 
            className="modal-close"
            style={{
              position: 'absolute',
              right: 'var(--space-6)',
              top: 'var(--space-6)',
              background: 'none',
              border: 'none',
              fontSize: '32px',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="content-card-body">
          <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
            {/* Category Selection */}
            <div>
              <label className="text-callout" style={{ 
                display: 'block', 
                marginBottom: 'var(--space-2)',
                fontWeight: '600'
              }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value })
                  setErrors({ ...errors, category: '' })
                }}
                className="input"
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-medium)',
                  border: `1px solid ${errors.category ? 'var(--color-red)' : 'var(--color-border)'}`,
                  background: 'var(--color-surface-elevated)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-body)'
                }}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p style={{ color: 'var(--color-red)', fontSize: 'var(--font-size-caption-1)', marginTop: 'var(--space-2)' }}>
                  {errors.category}
                </p>
              )}
            </div>

            {/* Budget Amount */}
            <div>
              <label className="text-callout" style={{ 
                display: 'block', 
                marginBottom: 'var(--space-2)',
                fontWeight: '600'
              }}>
                Budget Amount *
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ 
                  position: 'absolute', 
                  left: 'var(--space-3)', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)'
                }}>
                  $
                </span>
                <input
                  type="number"
                  value={formData.allocated || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, allocated: parseAmount(e.target.value) })
                    setErrors({ ...errors, allocated: '' })
                  }}
                  className="input"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-3) var(--space-3) var(--space-8)',
                    borderRadius: 'var(--radius-medium)',
                    border: `1px solid ${errors.allocated ? 'var(--color-red)' : 'var(--color-border)'}`,
                    background: 'var(--color-surface-elevated)',
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-body)'
                  }}
                />
              </div>
              {suggestedAmount > 0 && !budget && (
                <p style={{ 
                  color: 'var(--color-text-secondary)', 
                  fontSize: 'var(--font-size-caption-1)', 
                  marginTop: 'var(--space-2)' 
                }}>
                  💡 Suggested: ${suggestedAmount.toFixed(2)} based on your spending
                </p>
              )}
              {errors.allocated && (
                <p style={{ color: 'var(--color-red)', fontSize: 'var(--font-size-caption-1)', marginTop: 'var(--space-2)' }}>
                  {errors.allocated}
                </p>
              )}
            </div>

            {/* Period Selection */}
            <div>
              <label className="text-callout" style={{ 
                display: 'block', 
                marginBottom: 'var(--space-2)',
                fontWeight: '600'
              }}>
                Period
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {(['weekly', 'monthly', 'yearly'] as const).map(period => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setFormData({ ...formData, period })}
                    className={`btn ${formData.period === period ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, textTransform: 'capitalize' }}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert Threshold */}
            <div>
              <label className="text-callout" style={{ 
                display: 'block', 
                marginBottom: 'var(--space-2)',
                fontWeight: '600'
              }}>
                Alert at {formData.notifications.threshold}% of budget
              </label>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={formData.notifications.threshold}
                onChange={(e) => setFormData({
                  ...formData,
                  notifications: { ...formData.notifications, threshold: parseInt(e.target.value) }
                })}
                style={{ width: '100%' }}
              />
            </div>

            {/* Rollover Option */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-3)',
              padding: 'var(--space-4)',
              background: 'var(--color-surface-elevated)',
              borderRadius: 'var(--radius-medium)',
              border: '1px solid var(--color-border)'
            }}>
              <input
                type="checkbox"
                id="rollover"
                checked={formData.rollover}
                onChange={(e) => setFormData({ ...formData, rollover: e.target.checked })}
                style={{ width: '20px', height: '20px' }}
              />
              <label htmlFor="rollover" className="text-body" style={{ cursor: 'pointer', userSelect: 'none' }}>
                Roll over unused budget to next period
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-3)', 
            marginTop: 'var(--space-8)',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {budget ? 'Update Budget' : 'Create Budget'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}