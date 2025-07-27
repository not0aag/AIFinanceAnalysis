'use client'

import { FinancialGoal } from '@/types/finance'

interface GoalFormProps {
  goal?: FinancialGoal | null
  onSave: (goal: any) => void
  onClose: () => void
}

export default function GoalForm({ goal, onSave, onClose }: GoalFormProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create Goal</h2>
        <button onClick={onClose} className="modal-close">×</button>
      </div>
    </div>
  )
}