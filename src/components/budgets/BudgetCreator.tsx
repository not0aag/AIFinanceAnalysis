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

export default function BudgetCreator({ budget, onSave, onClose }: BudgetCreatorProps) {
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    allocated: budget?.allocated || 0,
    period: budget?.period || 'monthly'
  })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h2>Create Budget</h2>
        <button onClick={onClose} className="modal-close">×</button>
      </motion.div>
    </div>
  )
}