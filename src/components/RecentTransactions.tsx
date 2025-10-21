'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  date: Date
  type: 'income' | 'expense'
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-card border border-border rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <button
          onClick={() => router.push('/dashboard/transactions')}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View All →
        </button>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={`${transaction.id}-${index}`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => router.push('/dashboard/transactions')}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                transaction.type === 'income' 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-red-500/10 text-red-500'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4" />
                )}
              </div>
              
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.category} • {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            
            <div className={`font-semibold ${
              transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(Math.abs(transaction.amount))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
