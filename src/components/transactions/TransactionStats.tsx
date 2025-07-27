'use client'

import { Transaction } from '@/types/finance'

interface TransactionStatsProps {
  transactions: Transaction[]
  allTransactions: Transaction[]
}

export default function TransactionStats({ transactions, allTransactions }: TransactionStatsProps) {
  return (
    <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
      <div className="stat-card">
        <div className="stat-label">Total Transactions</div>
        <div className="stat-value">{transactions.length}</div>
      </div>
    </div>
  )
}