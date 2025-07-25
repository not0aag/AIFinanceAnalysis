'use client'

import { Bell, Search } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

export default function Header() {
  const { theme } = useTheme()

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-card border-b border-border px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </button>
          
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-medium">A</span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
