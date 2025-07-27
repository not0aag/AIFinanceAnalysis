'use client'

import { Transaction } from '@/types/finance'

interface TransactionListProps {
  transactions: Transaction[]
  selectedTransactions: Set<string>
  onSelectionChange: (selected: Set<string>) => void
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  onDuplicate: (transaction: Transaction) => void
}

export default function TransactionList({ 
  transactions, 
  onEdit, 
  onDelete 
}: TransactionListProps) {
  return (
    <div className="content-card">
      <div className="content-card-body">
        {transactions.map(transaction => (
          <div key={transaction.id}>
            {transaction.name} - ${Math.abs(transaction.amount)}
          </div>
        ))}
      </div>
    </div>
  )
}