'use client'

import { Plus, TrendingUp, Target, Download } from 'lucide-react'
import { motion } from 'framer-motion'

export default function QuickActions() {
  const actions = [
    { name: 'Add Transaction', icon: Plus, color: 'bg-blue-500' },
    { name: 'View Analytics', icon: TrendingUp, color: 'bg-green-500' },
    { name: 'Set Budget', icon: Target, color: 'bg-purple-500' },
    { name: 'Export Data', icon: Download, color: 'bg-orange-500' },
  ]

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="bg-card border border-border rounded-lg p-6"
    >
      <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            <div className={`p-3 rounded-lg ${action.color} text-white`}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">{action.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
