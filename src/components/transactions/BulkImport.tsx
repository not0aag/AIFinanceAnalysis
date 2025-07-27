'use client'

import { Transaction } from '@/types/finance'

interface BulkImportProps {
  onImport: (transactions: Transaction[]) => void
  onClose: () => void
}

export default function BulkImport({ onImport, onClose }: BulkImportProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Import Transactions</h2>
        <button onClick={onClose} className="modal-close">×</button>
      </div>
    </div>
  )
}