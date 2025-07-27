'use client'

import { Transaction } from '@/types/finance'
import { motion } from 'framer-motion'

interface TransactionFormProps {
  transaction?: Transaction | null
  onSave: (transaction: any) => void
  onClose: () => void
}

export default function TransactionForm({ transaction, onSave, onClose }: TransactionFormProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h2>Add Transaction</h2>
        <button onClick={onClose} className="modal-close">×</button>
      </motion.div>
    </div>
  )
}