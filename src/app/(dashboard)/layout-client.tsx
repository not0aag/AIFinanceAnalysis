'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '◼' },
    { href: '/dashboard/transactions', label: 'Transactions', icon: '⟷' },
    { href: '/dashboard/analytics', label: 'Analytics', icon: '◢' },
    { href: '/dashboard/budgets', label: 'Budgets', icon: '○' },
    { href: '/dashboard/insights', label: 'AI Insights', icon: '✦' },
    { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
  ]

  const handleSignOut = () => {
    // Clear any stored data
    localStorage.removeItem('finance-ai-transactions')
    window.location.href = '/login'
  }

  return (
    <div className="dashboard-layout">
      {/* Apple-style Sidebar */}
      <div className="sidebar">
        <div className="sidebar-content">
          {/* Logo */}
          <div className="sidebar-header">
            <div className="logo">
              <div className="logo-icon">$</div>
              <div className="logo-text">Finance AI</div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                <div className="nav-icon">{item.icon}</div>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* User Profile */}
        <div className="sidebar-footer">
          <div className="profile-section">
            <div className="profile-info">
              <div className="profile-avatar">👤</div>
              <div className="profile-details">
                <div className="profile-name">Demo User</div>
                <div className="profile-email">demo@example.com</div>
              </div>
            </div>
            <button onClick={handleSignOut} className="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  )
}
