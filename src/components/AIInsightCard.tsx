'use client'

import { Brain, Lightbulb } from 'lucide-react'
import { motion } from 'framer-motion'

interface AIInsightCardProps {
  insight: string
  loading?: boolean
}

export default function AIInsightCard({ insight, loading }: AIInsightCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-6 glass glow"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <Brain className="h-5 w-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold">AI Insight</h3>
        <Lightbulb className="h-4 w-4 text-yellow-400 animate-pulse" />
      </div>
      
      {loading ? (
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
        </div>
      ) : (
        <p className="text-muted-foreground leading-relaxed">
          {insight}
        </p>
      )}
    </motion.div>
  )
}
