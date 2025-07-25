'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const data = [
  { month: 'Jan', spending: 2400, income: 3200 },
  { month: 'Feb', spending: 1398, income: 3200 },
  { month: 'Mar', spending: 9800, income: 3200 },
  { month: 'Apr', spending: 3908, income: 3200 },
  { month: 'May', spending: 4800, income: 3200 },
  { month: 'Jun', spending: 3800, income: 3200 },
]

export default function SpendingChart() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-lg p-6"
    >
      <h3 className="text-lg font-semibold mb-6">Spending Overview</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" className="text-muted-foreground" />
            <YAxis className="text-muted-foreground" />
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Area type="monotone" dataKey="income" stroke="#82ca9d" fillOpacity={1} fill="url(#colorIncome)" />
            <Area type="monotone" dataKey="spending" stroke="#8884d8" fillOpacity={1} fill="url(#colorSpending)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
