'use client'

import { useEffect } from 'react'
import { ThemeProvider } from '@/components/theme-provider'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Apply saved theme on app load
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('finance-ai-theme') || 'Dark'
      applyTheme(savedTheme)
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('finance-ai-theme') === 'System') {
        applyTheme('System')
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const applyTheme = (theme: string) => {
    if (typeof window === 'undefined') return
    
    const body = document.body
    body.classList.remove('theme-light', 'theme-dark')
    
    if (theme === 'Light') {
      body.classList.add('theme-light')
    } else if (theme === 'Dark') {
      body.classList.add('theme-dark')
    } else if (theme === 'System') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      body.classList.add(prefersDark ? 'theme-dark' : 'theme-light')
    }
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="theme-dark">
        {children}
      </div>
    </ThemeProvider>
  )
}
