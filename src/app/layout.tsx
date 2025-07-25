'use client'

import { useEffect } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({
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
    <html lang="en" suppressHydrationWarning>
      <body className="theme-dark">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}