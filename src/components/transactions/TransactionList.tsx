'use client'

import { Transaction } from '@/types/finance'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Edit2, Trash2, Copy } from 'lucide-react'
import { motion } from 'framer-motion'

interface TransactionListProps {
  transactions: Transaction[]
  selectedTransactions: Set<string>
  onSelectionChange: (selected: Set<string>) => void
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  onDuplicate: (transaction: Transaction) => void
}

// Category configuration with images and gradients
const categoryConfig: Record<string, { gradient: string; image: string; borderColor: string }> = {
  'Food & Dining': { 
    gradient: 'from-orange-500/10 to-amber-500/10',
    image: '/icons/categories/coffee.jpeg',
    borderColor: 'border-orange-500/30'
  },
  'Shopping': { 
    gradient: 'from-purple-500/10 to-pink-500/10',
    image: '/icons/categories/shopping.jpeg',
    borderColor: 'border-purple-500/30'
  },
  'Housing': { 
    gradient: 'from-blue-500/10 to-cyan-500/10',
    image: '/icons/categories/house.jpeg',
    borderColor: 'border-blue-500/30'
  },
  'Transportation': { 
    gradient: 'from-yellow-500/10 to-orange-500/10',
    image: '/icons/categories/car.jpeg',
    borderColor: 'border-yellow-500/30'
  },
  'Travel': { 
    gradient: 'from-indigo-500/10 to-blue-500/10',
    image: '/icons/categories/travel.jpeg',
    borderColor: 'border-indigo-500/30'
  },
  'Healthcare': { 
    gradient: 'from-red-500/10 to-pink-500/10',
    image: '/icons/categories/health.jpeg',
    borderColor: 'border-red-500/30'
  },
  'Utilities': { 
    gradient: 'from-cyan-500/10 to-teal-500/10',
    image: '/icons/categories/power.jpeg',
    borderColor: 'border-cyan-500/30'
  },
  'Entertainment': { 
    gradient: 'from-pink-500/10 to-purple-500/10',
    image: '/icons/categories/entertainment.jpeg',
    borderColor: 'border-pink-500/30'
  },
  'Income': { 
    gradient: 'from-green-500/10 to-emerald-500/10',
    image: '/icons/categories/Income.jpeg',
    borderColor: 'border-green-500/30'
  },
  'Salary': { 
    gradient: 'from-green-600/10 to-teal-600/10',
    image: '/icons/categories/Income.jpeg',
    borderColor: 'border-green-600/30'
  },
  'Other': { 
    gradient: 'from-gray-500/10 to-slate-500/10',
    image: '/icons/categories/saving.jpeg',
    borderColor: 'border-gray-500/30'
  }
}

export default function TransactionList({ 
  transactions, 
  onEdit, 
  onDelete,
  onDuplicate 
}: TransactionListProps) {
  return (
    <div className="space-y-3">
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-500/10 to-slate-500/10 mb-4">
            <img 
              src="/icons/categories/saving.jpeg" 
              alt="No transactions"
              className="object-contain opacity-50 w-12 h-12"
            />
          </div>
          <p className="text-muted-foreground font-medium">No transactions found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Add your first transaction to get started</p>
        </div>
      ) : (
        transactions.map((transaction, index) => {
          const config = categoryConfig[transaction.category] || categoryConfig['Other']
          
          return (
            <motion.div 
              key={`${transaction.id}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03, type: 'spring', stiffness: 400, damping: 25 }}
              className="group relative"
            >
              <div className={`glass-card p-4 hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${config.gradient}`}>
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Icon + Name + Category */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className={`w-11 h-11 bg-gradient-to-br ${config.gradient} flex items-center justify-center transition-all duration-200 group-hover:scale-105 overflow-hidden`}>
                        <img 
                          src={config.image}
                          alt={transaction.category}
                          width="44"
                          height="44"
                          style={{ 
                            width: '44px', 
                            height: '44px',
                            maxWidth: '44px',
                            maxHeight: '44px',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                          onError={(e) => {
                            console.error('Image failed to load:', config.image)
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                      {/* Removed glow effect for cleaner look */}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{transaction.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs px-2 py-0.5 bg-secondary/80 font-medium text-muted-foreground">
                          {transaction.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Center: Date */}
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2.5 py-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  
                  {/* Right: Amount + Actions */}
                  <div className="flex items-center gap-3">
                    <div className={`font-bold text-base whitespace-nowrap ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0 translate-x-2">
                      <button
                        onClick={() => onDuplicate(transaction)}
                        className="p-1.5 hover:bg-blue-500/20 hover:scale-105 transition-all duration-150"
                        title="Duplicate"
                      >
                        <Copy className="h-3.5 w-3.5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-1.5 hover:bg-primary/20 hover:scale-105 transition-all duration-150"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-primary" />
                      </button>
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-1.5 hover:bg-red-500/20 hover:scale-105 transition-all duration-150"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })
      )}
    </div>
  )
}