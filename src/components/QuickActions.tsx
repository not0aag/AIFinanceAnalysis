'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function QuickActions() {
  const router = useRouter()

  const actions = [
    { 
      name: 'Add Transaction', 
      icon: '➕', 
      gradient: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
      description: 'Record income or expense',
      onClick: () => router.push('/dashboard/transactions')
    },
    { 
      name: 'View Analytics', 
      icon: '📊', 
      gradient: 'linear-gradient(135deg, #30d158 0%, #00c7be 100%)',
      description: 'Deep dive into stats',
      onClick: () => router.push('/dashboard/analytics')
    },
    { 
      name: 'Set Budget', 
      icon: '🎯', 
      gradient: 'linear-gradient(135deg, #af52de 0%, #ff2d92 100%)',
      description: 'Create spending limits',
      onClick: () => router.push('/dashboard/budgets')
    },
    { 
      name: 'Export Data', 
      icon: '📥', 
      gradient: 'linear-gradient(135deg, #ff9f0a 0%, #ff375f 100%)',
      description: 'Download your data',
      onClick: () => {
        // Export all data as JSON
        const transactions = localStorage.getItem('finance-ai-transactions')
        const budgets = localStorage.getItem('finance-ai-budgets')
        const goals = localStorage.getItem('finance-ai-goals')
        
        const exportData = {
          transactions: transactions ? JSON.parse(transactions) : [],
          budgets: budgets ? JSON.parse(budgets) : [],
          goals: goals ? JSON.parse(goals) : [],
          exportDate: new Date().toISOString()
        }
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    },
  ]

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="content-card"
    >
      <div className="content-card-header">
        <h3 className="content-card-title">Quick Actions</h3>
        <p className="content-card-subtitle">Shortcuts to common tasks</p>
      </div>
      
      <div className="content-card-body">
        <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
          {actions.map((action, index) => (
            <motion.button
              key={action.name}
              onClick={action.onClick}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-6)',
                background: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-large)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s var(--ease-in-out)'
              }}
              className="card-hover"
            >
              {/* Gradient background on hover */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: action.gradient,
                  opacity: 0
                }}
                whileHover={{ opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Icon */}
              <motion.div
                style={{
                  width: '64px',
                  height: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: action.gradient,
                  borderRadius: 'var(--radius-medium)',
                  fontSize: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-medium)'
                }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))'
                }} />
                {action.icon}
              </motion.div>

              {/* Text */}
              <div style={{ 
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  fontSize: 'var(--font-size-callout)',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-1)',
                  letterSpacing: '-0.0043em'
                }}>
                  {action.name}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-caption-1)',
                  color: 'var(--color-text-secondary)'
                }}>
                  {action.description}
                </div>
              </div>

              {/* Subtle glow */}
              <div style={{
                position: 'absolute',
                bottom: -30,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '60px',
                background: action.gradient,
                borderRadius: '50%',
                filter: 'blur(30px)',
                opacity: 0.2,
                pointerEvents: 'none'
              }} />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
