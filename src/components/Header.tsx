'use client'

import { Bell, Search, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const { theme } = useTheme()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to transactions with search query
      router.push(`/dashboard/transactions?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-card border-b border-border px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </form>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard/insights')}
            className="p-2 rounded-lg hover:bg-secondary transition-colors relative"
            title="View notifications"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button
            onClick={() => router.push('/dashboard/settings')}
            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
            title="View profile"
          >
            <User className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
