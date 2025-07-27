'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Transaction } from '@/types/finance'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { formatCurrency } from '@/lib/finance-utils'

interface SpendingTrendsProps {
  transactions: Transaction[]
  period: 'week' | 'month' | 'year'
}

export default function SpendingTrends({ transactions, period }: SpendingTrendsProps) {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'pie'>('area')
  const [showIncome, setShowIncome] = useState(true)
  const [showExpenses, setShowExpenses] = useState(true)

  const chartData = useMemo(() => {
    // Group transactions by time period
    const groupedData = new Map<string, { income: number; expenses: number; date: Date }>()
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date)
      let key: string
      
      switch (period) {
        case 'week':
          // Group by day for week view
          key = date.toISOString().split('T')[0]
          break
        case 'month':
          // Group by week for month view
          const weekOfMonth = Math.ceil(date.getDate() / 7)
          key = `Week ${weekOfMonth}`
          break
        case 'year':
          // Group by month for year view
          key = date.toLocaleDateString('en-US', { month: 'short' })
          break
      }
      
      if (!groupedData.has(key)) {
        groupedData.set(key, { income: 0, expenses: 0, date })
      }
      
      const data = groupedData.get(key)!
      if (transaction.type === 'income') {
        data.income += transaction.amount
      } else {
        data.expenses += Math.abs(transaction.amount)
      }
    })
    
    // Convert to array and sort by date
    return Array.from(groupedData.entries())
      .map(([label, data]) => ({
        label,
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses,
        date: data.date
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [transactions, period])

  const pieData = useMemo(() => {
    const categoryTotals = new Map<string, number>()
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = categoryTotals.get(t.category) || 0
        categoryTotals.set(t.category, current + Math.abs(t.amount))
      })
    
    return Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({ name: category, value: amount }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6) // Top 6 categories
  }, [transactions])

  const COLORS = [
    'var(--color-blue)',
    'var(--color-green)',
    'var(--color-purple)',
    'var(--color-orange)',
    'var(--color-red)',
    'var(--color-teal)'
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-medium)',
          padding: 'var(--space-4)',
          boxShadow: 'var(--shadow-medium)'
        }}>
          <p style={{ fontWeight: '600', marginBottom: 'var(--space-2)' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color, fontSize: 'var(--font-size-footnote)' }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="content-card">
      <div className="content-card-header">
        <div>
          <h3 className="content-card-title">Spending Trends</h3>
          <p className="content-card-subtitle">
            {period === 'week' ? 'Daily' : period === 'month' ? 'Weekly' : 'Monthly'} breakdown
          </p>
        </div>
        
        {/* Chart Controls */}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {/* Chart Type Selector */}
          <div style={{ 
            display: 'flex', 
            background: 'var(--color-surface-elevated)',
            borderRadius: 'var(--radius-medium)',
            padding: 'var(--space-1)'
          }}>
            {[
              { type: 'area', icon: '📈' },
              { type: 'bar', icon: '📊' },
              { type: 'pie', icon: '🥧' }
            ].map(({ type, icon }) => (
              <button
                key={type}
                onClick={() => setChartType(type as any)}
                className={chartType === type ? 'btn btn-primary' : 'btn btn-ghost'}
                style={{ 
                  padding: 'var(--space-2) var(--space-3)',
                  fontSize: 'var(--font-size-footnote)'
                }}
                title={`${type} chart`}
              >
                {icon}
              </button>
            ))}
          </div>
          
          {/* Legend Toggle (for non-pie charts) */}
          {chartType !== 'pie' && (
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={showIncome}
                  onChange={(e) => setShowIncome(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: 'var(--font-size-footnote)' }}>Income</span>
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={showExpenses}
                  onChange={(e) => setShowExpenses(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: 'var(--font-size-footnote)' }}>Expenses</span>
              </label>
            </div>
          )}
        </div>
      </div>
      
      <div className="content-card-body">
        <motion.div 
          style={{ height: '300px' }}
          key={chartType}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-green)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-green)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-red)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-red)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="label" 
                  stroke="var(--color-text-secondary)"
                  style={{ fontSize: 'var(--font-size-caption-1)' }}
                />
                <YAxis 
                  stroke="var(--color-text-secondary)"
                  style={{ fontSize: 'var(--font-size-caption-1)' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    fontSize: 'var(--font-size-footnote)',
                    color: 'var(--color-text-secondary)'
                  }}
                />
                {showIncome && (
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="var(--color-green)" 
                    fillOpacity={1} 
                    fill="url(#colorIncome)"
                    strokeWidth={2}
                  />
                )}
                {showExpenses && (
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="var(--color-red)" 
                    fillOpacity={1} 
                    fill="url(#colorExpenses)"
                    strokeWidth={2}
                  />
                )}
              </AreaChart>
            ) : chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="label" 
                  stroke="var(--color-text-secondary)"
                  style={{ fontSize: 'var(--font-size-caption-1)' }}
                />
                <YAxis 
                  stroke="var(--color-text-secondary)"
                  style={{ fontSize: 'var(--font-size-caption-1)' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    fontSize: 'var(--font-size-footnote)',
                    color: 'var(--color-text-secondary)'
                  }}
                />
                {showIncome && (
                  <Bar 
                    dataKey="income" 
                    fill="var(--color-green)"
                    radius={[4, 4, 0, 0]}
                  />
                )}
                {showExpenses && (
                  <Bar 
                    dataKey="expenses" 
                    fill="var(--color-red)"
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </motion.div>
        
        {/* Summary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-4)',
          marginTop: 'var(--space-6)',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--color-border)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p className="text-caption-1">Total Income</p>
            <p className="text-title-3" style={{ color: 'var(--color-green)' }}>
              {formatCurrency(chartData.reduce((sum, d) => sum + d.income, 0))}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p className="text-caption-1">Total Expenses</p>
            <p className="text-title-3" style={{ color: 'var(--color-red)' }}>
              {formatCurrency(chartData.reduce((sum, d) => sum + d.expenses, 0))}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p className="text-caption-1">Net Income</p>
            <p className="text-title-3" style={{ 
              color: chartData.reduce((sum, d) => sum + d.net, 0) >= 0 
                ? 'var(--color-green)' 
                : 'var(--color-red)' 
            }}>
              {formatCurrency(chartData.reduce((sum, d) => sum + d.net, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}