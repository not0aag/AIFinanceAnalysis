'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Target,
  Brain,
  Settings,
  LogOut,
  Menu,
  X,
  Heart
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/dashboard/transactions', icon: Receipt },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Budgets', href: '/dashboard/budgets', icon: Target },
  { name: 'AI Insights', href: '/dashboard/insights', icon: Brain },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card glass glass-hover"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed lg:relative w-72 h-full bg-card border-r border-border z-40",
              "flex flex-col"
            )}
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">F</span>
                </div>
                Finance AI
              </h2>
            </div>
            
            <nav className="flex-1 px-4 pb-4">
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            
            <div className="p-4 space-y-4 border-t border-border">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </button>
              
              {/* Made by Alen */}
              <div className="flex items-center justify-center gap-1 made-by-alen">
                <span>Made with</span>
                <Heart className="h-3 w-3 fill-current" />
                <span>by Alen</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
