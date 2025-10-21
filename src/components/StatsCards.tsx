'use client'

import { formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface StatsCardsProps {
  stats: {
    totalBalance: number
    monthlyIncome: number
    monthlyExpenses: number
    savings: number
  }
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const router = useRouter()

  const cards = [
    {
      title: 'Total Balance',
      value: stats.totalBalance,
      icon: '/icons/categories/Income.jpeg',
      trend: 5.2,
      gradient: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.1) 100%)',
      onClick: () => router.push('/dashboard')
    },
    {
      title: 'Monthly Income',
      value: stats.monthlyIncome,
      icon: '/icons/categories/Income.jpeg',
      trend: 12.5,
      gradient: 'linear-gradient(135deg, #30d158 0%, #00c7be 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(48, 209, 88, 0.1) 0%, rgba(0, 199, 190, 0.1) 100%)',
      onClick: () => router.push('/dashboard/transactions')
    },
    {
      title: 'Monthly Expenses',
      value: stats.monthlyExpenses,
      icon: '/icons/categories/shopping.jpeg',
      trend: -8.1,
      gradient: 'linear-gradient(135deg, #ff9f0a 0%, #ff375f 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 55, 95, 0.1) 100%)',
      onClick: () => router.push('/dashboard/budgets')
    },
    {
      title: 'Savings',
      value: stats.savings,
      icon: '/icons/categories/saving.jpeg',
      trend: 15.3,
      gradient: 'linear-gradient(135deg, #af52de 0%, #ff2d92 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(175, 82, 222, 0.1) 0%, rgba(255, 45, 146, 0.1) 100%)',
      onClick: () => router.push('/dashboard/goals')
    }
  ]

  return (
    <div className="grid grid-4" style={{ gap: 'var(--space-6)' }}>
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
          onClick={card.onClick}
          className="stat-card card-hover"
          style={{
            background: card.bgGradient,
            borderRadius: 'var(--radius-large)',
            padding: 'var(--space-6)',
            border: '1px solid var(--color-border)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Gradient top border */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: card.gradient
          }} />

          {/* Icon and Trend */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)'
          }}>
            <motion.div
              className="icon-container"
              style={{
                background: card.gradient,
                width: '56px',
                height: '56px',
                minWidth: '56px',
                minHeight: '56px',
                maxWidth: '56px',
                maxHeight: '56px',
                overflow: 'hidden'
              }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src={card.icon}
                alt={card.title}
                width="56"
                height="56"
                style={{ 
                  width: '56px', 
                  height: '56px',
                  maxWidth: '56px',
                  maxHeight: '56px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </motion.div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
              className={card.trend > 0 ? 'badge-success' : 'badge-danger'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: '99px',
                fontSize: 'var(--font-size-caption-1)',
                fontWeight: '700'
              }}
            >
              {card.trend > 0 ? '↑' : '↓'}
              {Math.abs(card.trend)}%
            </motion.div>
          </div>
          
          {/* Title */}
          <h3 style={{
            fontSize: 'var(--font-size-callout)',
            fontWeight: '500',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
            letterSpacing: '-0.0043em'
          }}>
            {card.title}
          </h3>
          
          {/* Value */}
          <motion.p
            style={{
              fontSize: 'var(--font-size-large-title)',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.022em',
              background: card.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {formatCurrency(card.value)}
          </motion.p>

          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            bottom: -20,
            right: -20,
            width: '100px',
            height: '100px',
            background: card.gradient,
            borderRadius: '50%',
            filter: 'blur(40px)',
            opacity: 0.15,
            pointerEvents: 'none'
          }} />
        </motion.div>
      ))}
    </div>
  )
}
