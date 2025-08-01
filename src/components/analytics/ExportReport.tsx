'use client'

import { motion } from 'framer-motion'
import { FinancialReport } from '@/types/finance'

interface ExportReportProps {
  report: FinancialReport
  onClose: () => void
}

export default function ExportReport({ report, onClose }: ExportReportProps) {
  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    // Implement export logic
    console.log(`Exporting as ${format}`)
    onClose()
  }

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '500px', padding: 'var(--space-8)' }}
      >
        <h2 className="text-title-2" style={{ marginBottom: 'var(--space-6)' }}>
          Export Financial Report
        </h2>
        
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <button
            className="btn btn-secondary"
            onClick={() => handleExport('pdf')}
            style={{ justifyContent: 'flex-start' }}
          >
            📄 Export as PDF
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleExport('csv')}
            style={{ justifyContent: 'flex-start' }}
          >
            📊 Export as CSV
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleExport('json')}
            style={{ justifyContent: 'flex-start' }}
          >
            📋 Export as JSON
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 'var(--space-6)' }}
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  )
}