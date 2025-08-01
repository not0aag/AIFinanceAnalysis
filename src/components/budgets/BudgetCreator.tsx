'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Budget } from '@/types/finance'

interface BudgetCreatorProps {
  budget?: Budget | null
  existingBudgets: Budget[]
  transactions: any[]
  onSave: (budget: any) => void
  onClose: () => void
}

export default function BudgetCreator({ budget, existingBudgets, transactions, onSave, onClose }: BudgetCreatorProps) {
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    allocated: budget?.allocated || 0,
    period: budget?.period || 'monthly',
    startDate: budget?.startDate || new Date().toISOString().split('T')[0]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get unique categories from transactions
  const categories = Array.from(new Set(
    transactions
      .filter(t => t.type === 'expense')
      .map(t => t.category)
  )).sort()

  const commonCategories = [
    'Housing', 'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Healthcare', 'Utilities', 'Education', 'Travel', 'Subscriptions'
  ]

  const allCategories = Array.from(new Set([...commonCategories, ...categories]))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: Record<string, string> = {}
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }
    
    if (formData.allocated <= 0) {
      newErrors.allocated = 'Budget amount must be greater than 0'
    }

    // Check if category already exists (for new budgets)
    if (!budget && existingBudgets.some(b => b.category.toLowerCase() === formData.category.toLowerCase())) {
      newErrors.category = 'A budget for this category already exists'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Create budget object
    const budgetData = {
      ...formData,
      id: budget?.id || Date.now().toString(),
      userId: 'user-1',
      spent: budget?.spent || 0,
      endDate: budget?.endDate || '',
      notifications: budget?.notifications || { enabled: true, threshold: 80 },
      rollover: budget?.rollover || false
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
        style={{
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div className="modal-header">
          <h2>{budget ? 'Edit Budget' : 'Create Budget'}</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Category Selection */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={allCategories.includes(formData.category) ? formData.category : 'custom'}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setFormData(prev => ({ ...prev, category: '' }))
                } else {
                  setFormData(prev => ({ ...prev, category: e.target.value }))
                }
                setErrors(prev => ({ ...prev, category: '' }))
              }}
              className={`form-control ${errors.category ? 'error' : ''}`}
              required
            >
              <option value="">Select a category</option>
              {allCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="custom">➕ Add custom category</option>
            </select>
            {errors.category && (
              <span className="error-message">{errors.category}</span>
            )}
          </div>

          {/* Custom Category Input */}
          {(!allCategories.includes(formData.category) || formData.category === '') && (
            <div className="form-group">
              <label htmlFor="customCategory">Custom Category</label>
              <input
                id="customCategory"
                type="text"
                value={formData.category}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, category: e.target.value }))
                  setErrors(prev => ({ ...prev, category: '' }))
                }}
                className="form-control"
                placeholder="Enter category name (e.g., Pet Care, Hobbies)"
                required={!allCategories.includes(formData.category)}
              />
            </div>
          )}

          {/* Budget Amount */}
          <div className="form-group">
            <label htmlFor="allocated">Budget Amount</label>
            <input
              id="allocated"
              type="number"
              min="0"
              step="0.01"
              value={formData.allocated}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, allocated: parseFloat(e.target.value) || 0 }))
                setErrors(prev => ({ ...prev, allocated: '' }))
              }}
              className={`form-control ${errors.allocated ? 'error' : ''}`}
              placeholder="0.00"
              required
            />
            {errors.allocated && (
              <span className="error-message">{errors.allocated}</span>
            )}
          </div>

          {/* Period */}
          <div className="form-group">
            <label htmlFor="period">Budget Period</label>
            <select
              id="period"
              value={formData.period}
              onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as any }))}
              className="form-control"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="form-control"
            />
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {budget ? 'Update Budget' : 'Create Budget'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}