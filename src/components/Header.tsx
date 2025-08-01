'use client'

import { Bell, Search, LogOut, User, Settings, ChevronDown, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Ensure component is mounted before showing theme-dependent content
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      // Clear local storage
      localStorage.removeItem('finance-ai-transactions')
      localStorage.removeItem('finance-ai-goals')
      localStorage.removeItem('finance-ai-budgets')
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleThemeChange = (newTheme: string) => {
    const themeValue = newTheme.toLowerCase()
    setTheme(themeValue)
    setIsThemeMenuOpen(false)
  }

  const getCurrentThemeIcon = () => {
    if (!mounted) return <Monitor className="h-4 w-4" />
    
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
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

          {/* Theme Toggle */}
          <div className="relative">
            <motion.button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {getCurrentThemeIcon()}
            </motion.button>

            {/* Theme Dropdown */}
            <AnimatePresence>
              {isThemeMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50"
                  style={{ boxShadow: 'var(--shadow-large)' }}
                >
                  <div className="p-2">
                    <button
                      onClick={() => handleThemeChange('Light')}
                      className={`flex items-center gap-3 w-full px-3 py-2 text-sm text-left hover:bg-secondary rounded-md transition-colors ${theme === 'light' ? 'bg-secondary' : ''}`}
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange('Dark')}
                      className={`flex items-center gap-3 w-full px-3 py-2 text-sm text-left hover:bg-secondary rounded-md transition-colors ${theme === 'dark' ? 'bg-secondary' : ''}`}
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange('System')}
                      className={`flex items-center gap-3 w-full px-3 py-2 text-sm text-left hover:bg-secondary rounded-md transition-colors ${theme === 'system' ? 'bg-secondary' : ''}`}
                    >
                      <Monitor className="h-4 w-4" />
                      System
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Backdrop to close menu */}
            {isThemeMenuOpen && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsThemeMenuOpen(false)}
              />
            )}
          </div>
          
          {/* User Menu Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">A</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50"
                  style={{ boxShadow: 'var(--shadow-large)' }}
                >
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium">A</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Demo User</p>
                        <p className="text-xs text-muted-foreground">demo@example.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        // Navigate to profile/settings
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-left hover:bg-secondary rounded-md transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        router.push('/dashboard/settings')
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-left hover:bg-secondary rounded-md transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    
                    <div className="border-t border-border my-2"></div>
                    
                    <motion.button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        handleSignOut()
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-left hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Backdrop to close menu */}
            {isUserMenuOpen && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsUserMenuOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
