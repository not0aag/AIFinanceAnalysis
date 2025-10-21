'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Transaction, FinancialMetrics } from '@/types/finance'
import { Sparkles, Send } from 'lucide-react'

interface AIAssistantProps {
  metrics: FinancialMetrics
  transactions: Transaction[]
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIAssistant({ metrics, transactions }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your AI financial assistant. I see you have ${transactions.length} transactions. How can I help you today?`
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
      // Call the AI API
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

      const data = await response.json()

      if (!response.ok) {
        // If API fails, provide helpful fallback response
        console.error('API Error:', data)
        throw new Error(data.error || 'Failed to get AI response')
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error processing your request.'
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI Chat Error:', error)
      
      // Provide intelligent fallback response based on user's question
      let fallbackResponse = ''
      const question = currentInput.toLowerCase()
      
      if (question.includes('expend') || question.includes('spending') || question.includes('spend')) {
        const totalExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        
        const categoryBreakdown = transactions
          .filter(t => t.type === 'expense')
          .reduce((acc: any, t) => {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
            return acc
          }, {})
        
        const topCategory = Object.entries(categoryBreakdown)
          .sort(([, a]: any, [, b]: any) => (b as number) - (a as number))[0]
        
        fallbackResponse = `Based on your ${transactions.length} transactions, your total expenses are $${totalExpenses.toFixed(2)}. Your highest spending category is ${topCategory?.[0] || 'Unknown'} at $${(topCategory?.[1] as number || 0).toFixed(2)}. Consider reviewing this category for potential savings opportunities.`
      } else if (question.includes('save') || question.includes('saving')) {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0)
        const savings = income - expenses
        const savingsRate = income > 0 ? ((savings / income) * 100) : 0
        
        fallbackResponse = `Your current savings rate is ${savingsRate.toFixed(1)}%. You've saved $${savings.toFixed(2)} from $${income.toFixed(2)} in income. A good target is 20-30% savings rate. Consider reducing discretionary spending to improve your savings.`
      } else {
        fallbackResponse = `I'm currently experiencing connectivity issues with the AI service. However, I can tell you that you have ${transactions.length} transactions. Your total income is $${transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toFixed(2)} and total expenses are $${transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0).toFixed(2)}. Try asking me about your spending or savings!`
      }
      
      const errorMessage: Message = {
        role: 'assistant',
        content: fallbackResponse
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
      
      <div className="card-header relative z-10" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 overflow-hidden">
            <img 
              src="/icons/categories/main-avatar.jpeg" 
              alt="AI Assistant"
              width="48"
              height="48"
              style={{ 
                width: '48px', 
                height: '48px',
                maxWidth: '48px',
                maxHeight: '48px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 animate-pulse opacity-20 blur-md -z-10"></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-title-2">AI Financial Assistant</h2>
            <Sparkles className="h-4 w-4 text-cyan-500 animate-pulse" />
          </div>
          <p className="text-footnote text-muted-foreground">Powered by GPT-4 • Always here to help</p>
        </div>
      </div>
      
      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        position: 'relative',
        zIndex: 10
      }}>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              alignItems: 'flex-start',
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {message.role === 'assistant' && (
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <img 
                    src="/icons/categories/main-avatar.jpeg" 
                    alt="AI"
                    width="32"
                    height="32"
                    style={{ 
                      width: '32px', 
                      height: '32px',
                      maxWidth: '32px',
                      maxHeight: '32px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
                <div className="absolute inset-0 rounded-lg bg-cyan-500/30 blur-md animate-pulse -z-10"></div>
              </div>
            )}
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-medium)',
                backgroundColor: message.role === 'user' 
                  ? 'var(--color-blue)' 
                  : 'var(--color-fill-secondary)',
                color: message.role === 'user' ? 'white' : 'var(--color-text-primary)',
                boxShadow: message.role === 'user' 
                  ? '0 4px 12px rgba(0, 122, 255, 0.3)' 
                  : 'var(--shadow-small)',
                border: message.role === 'user' 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid var(--color-border)'
              }}
            >
              {message.content}
            </motion.div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              alignItems: 'center',
              alignSelf: 'flex-start'
            }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md animate-pulse overflow-hidden">
                <img 
                  src="/icons/categories/ai-think.jpeg" 
                  alt="Thinking"
                  width="32"
                  height="32"
                  style={{ 
                    width: '32px', 
                    height: '32px',
                    maxWidth: '32px',
                    maxHeight: '32px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>
              <div className="absolute inset-0 rounded-lg bg-purple-500/30 blur-md animate-pulse -z-10"></div>
            </div>
            <div style={{
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-medium)',
              backgroundColor: 'var(--color-fill-secondary)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              gap: 'var(--space-2)',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-blue)' }}
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-blue)' }}
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-blue)' }}
                />
              </div>
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ 
        padding: 'var(--space-4)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        gap: 'var(--space-2)',
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'var(--color-background)'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your spending, budgets, or savings..."
          className="input"
          style={{ flex: 1, backgroundColor: 'var(--color-fill-secondary)', border: '1px solid var(--color-border)' }}
        />
        <motion.button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading || !input.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            minWidth: '90px',
            background: isLoading ? 'var(--color-gray)' : 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
            border: 'none',
            boxShadow: isLoading ? 'none' : '0 4px 12px rgba(0, 122, 255, 0.4)'
          }}
        >
          {isLoading ? 'Sending...' : (
            <>
              Send
              <Send className="h-4 w-4" />
            </>
          )}
        </motion.button>
      </form>
    </div>
  )
}
  