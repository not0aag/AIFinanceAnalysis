'use client'

import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatsCardsProps {
  stats: {
    totalBalance: number
    monthlyIncome: number
    monthlyExpenses: number
    savings: number
  }
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Balance',
      value: stats.totalBalance,
      icon: DollarSign,
      trend: 5.2,
      color: 'text-blue-500'
    },
    {
      title: 'Monthly Income',
      value: stats.monthlyIncome,
      icon: TrendingUp,
      trend: 12.5,
      color: 'text-green-500'
    },
    {
      title: 'Monthly Expenses',
      value: stats.monthlyExpenses,
      icon: TrendingDown,
      trend: -8.1,
      color: 'text-red-500'
    },
    {
      title: 'Savings',
      value: stats.savings,
      icon: CreditCard,
      trend: 15.3,
      color: 'text-purple-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card border border-border rounded-lg p-6 glass glow hover:scale-105 transition-transform duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-secondary ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div className={`text-sm font-medium ${card.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {card.trend > 0 ? '+' : ''}{card.trend}%
            </div>
          </div>
          
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {card.title}
          </h3>
          
          <p className="text-2xl font-bold">
            {formatCurrency(card.value)}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
