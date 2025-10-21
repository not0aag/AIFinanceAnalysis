'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Transaction, FinancialGoal, AIInsight } from '@/types/finance'

interface ChatAssistantProps {
  transactions: Transaction[]
  goals: FinancialGoal[]
  insights: AIInsight[]
  monthlyIncome: number
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatAssistant({ transactions, goals, insights, monthlyIncome }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I can help you understand your financial insights better. You have ${transactions.length} transactions, ${goals.length} goals, and ${insights.length} AI insights. What would you like to know?`
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      // Calculate metrics for context
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)

      const metrics = {
        netWorth: totalIncome - totalExpenses,
        income: totalIncome,
        expenses: totalExpenses,
        savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
        transactionCount: transactions.length,
        goalsCount: goals.length,
        insightsCount: insights.length
      }

      // Call the real AI API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          transactions: transactions,
          metrics: metrics
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error processing your request.'
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please make sure your OpenAI API key is configured correctly.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-title-2">Chat with AI</h2>
        <p className="text-footnote">Get personalized financial advice</p>
      </div>
      
      <div style={{ 
        height: '500px', 
        overflowY: 'auto', 
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)'
      }}>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-medium)',
              backgroundColor: message.role === 'user' 
                ? 'var(--color-blue)' 
                : 'var(--color-fill-secondary)',
              color: message.role === 'user' ? 'white' : 'var(--color-text-primary)'
            }}
          >
            {message.content}
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              alignSelf: 'flex-start',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-medium)',
              backgroundColor: 'var(--color-fill-secondary)'
            }}
          >
            <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ 
        padding: 'var(--space-4)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        gap: 'var(--space-2)'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your insights..."
          className="input"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  )
}
