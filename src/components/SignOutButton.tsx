'use client'

import { LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SignOutButtonProps {
  variant?: 'default' | 'compact' | 'icon-only'
  size?: 'small' | 'medium' | 'large'
  className?: string
  showIcon?: boolean
}

export default function SignOutButton({ 
  variant = 'default', 
  size = 'medium',
  className = '',
  showIcon = true 
}: SignOutButtonProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      
      // Clear all finance-related localStorage data
      localStorage.removeItem('finance-ai-transactions')
      localStorage.removeItem('finance-ai-goals')
      localStorage.removeItem('finance-ai-budgets')
      
      // Redirect to login
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      // Still redirect to login even if there's an error
      router.push('/login')
    }
  }

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-2 text-sm',
    large: 'px-4 py-3 text-base'
  }

  const iconSizes = {
    small: 'h-3 w-3',
    medium: 'h-4 w-4', 
    large: 'h-5 w-5'
  }

  const baseClasses = "flex items-center gap-2 font-medium rounded-lg transition-all duration-200"

  const variantClasses = {
    default: "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg",
    compact: "text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300",
    'icon-only': "text-red-600 hover:bg-red-50 rounded-full aspect-square justify-center"
  }

  return (
    <motion.button
      onClick={handleSignOut}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Sign Out"
    >
      {showIcon && <LogOut className={iconSizes[size]} />}
      {variant !== 'icon-only' && (
        <span>{variant === 'compact' ? 'Sign Out' : 'Sign Out'}</span>
      )}
    </motion.button>
  )
}
