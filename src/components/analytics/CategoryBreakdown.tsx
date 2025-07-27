'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/finance-utils'

interface CategoryBreakdownProps {
  data: Record<string, number>
  total: number
  onCategorySelect?: (category: string | null) => void
  selectedCategory: string | null
}

export default function CategoryBreakdown({ 
  data, 
  total, 
  onCategorySelect, 
  selectedCategory 
}: CategoryBreakdownProps) {
  const pieData = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const COLORS = [
    'var(--color-blue)',
    'var(--color-green)',
    'var(--color-purple)',
    'var(--color-orange)',
    'var(--color-red)',
    'var(--color-teal)',
    'var(--color-pink)',
    'var(--color-indigo)'
  ]

  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Spending by Category</h3>
        <p className="content-card-subtitle">Click to filter</p>
      </div>
      <div className="content-card-body">
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                onClick={(data) => onCategorySelect?.(data.name)}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke={selectedCategory === entry.name ? 'var(--color-text-primary)' : 'none'}
                    strokeWidth={selectedCategory === entry.name ? 2 : 0}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-medium)'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 'var(--space-4)',
              padding: 'var(--space-4)',
              background: 'var(--color-surface-elevated)',
              borderRadius: 'var(--radius-medium)',
              border: '1px solid var(--color-border)'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Filtering by: {selectedCategory}</span>
              <button
                onClick={() => onCategorySelect?.(null)}
                className="btn btn-ghost"
                style={{ padding: 'var(--space-2) var(--space-3)' }}
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}