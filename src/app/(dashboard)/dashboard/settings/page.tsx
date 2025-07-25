'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Alen',
    email: '' // Will be populated from auth
  })
  
  const [selectedTheme, setSelectedTheme] = useState('Dark')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  // Get user data and apply theme on component mount
  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (user && user.email) {
          setProfile(prev => ({
            ...prev,
            email: user.email || ''
          }))
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    getCurrentUser()

    // Apply saved theme
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('finance-ai-theme') || 'Dark'
      setSelectedTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (theme: string) => {
    if (typeof window === 'undefined') return
    
    const body = document.body
    
    // Remove all existing theme classes
    body.classList.remove('theme-light', 'theme-dark')
    
    if (theme === 'Light') {
      body.classList.add('theme-light')
    } else if (theme === 'Dark') {
      body.classList.add('theme-dark')
    } else if (theme === 'System') {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        body.classList.add('theme-dark')
      } else {
        body.classList.add('theme-light')
      }
    }
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('finance-ai-theme', theme)
    }
    
    // Apply immediately
    applyTheme(theme)
  }

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Settings</h1>
          <p style={{ color: '#94a3b8' }}>Loading your profile...</p>
        </div>
        
        <div className="stat-card">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '2rem',
            color: '#94a3b8' 
          }}>
            Loading...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Settings</h1>
        <p style={{ color: '#94a3b8' }}>Manage your account and application preferences</p>
      </div>
      
      {/* Profile Settings */}
      <form onSubmit={handleSaveProfile}>
        <div className="stat-card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Profile Settings</h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: '#94a3b8'
              }}>Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: '#94a3b8'
              }}>Email Address</label>
              <input
                type="email"
                value={profile.email}
                readOnly
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#2d3748', // Slightly darker to show it's read-only
                  border: '1px solid #4b5563',
                  borderRadius: '0.5rem',
                  color: '#94a3b8', // Muted color for read-only
                  fontSize: '0.875rem',
                  cursor: 'not-allowed'
                }}
                title="Email cannot be changed - this is your login email"
              />
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280', 
                marginTop: '0.25rem',
                fontStyle: 'italic'
              }}>
                This is your login email and cannot be changed
              </p>
            </div>
          </div>
          
          <button
            type="submit"
            style={{
              marginTop: '1rem',
              backgroundColor: saved ? '#10b981' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem 1.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            {saved ? '✅ Saved!' : 'Save Changes'}
          </button>
        </div>
      </form>
      
      {/* Theme Settings */}
      <div className="stat-card">
        <h3 style={{ marginBottom: '1rem' }}>Appearance</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Choose how Finance AI looks to you. Select a single theme, or sync with your system and automatically switch between day and night themes.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { name: 'Light', icon: '☀️', desc: 'Clean and bright' },
            { name: 'Dark', icon: '🌙', desc: 'Easy on the eyes' },
            { name: 'System', icon: '💻', desc: 'Matches your device' }
          ].map((theme, index) => (
            <button
              key={index}
              onClick={() => handleThemeChange(theme.name)}
              style={{
                padding: '1.5rem 1rem',
                border: selectedTheme === theme.name ? '3px solid #3b82f6' : '2px solid #374151',
                borderRadius: '0.75rem',
                backgroundColor: selectedTheme === theme.name ? 'rgba(59, 130, 246, 0.2)' : 'rgba(55, 65, 81, 0.3)',
                color: 'white',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedTheme !== theme.name) {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.6)'
                  e.currentTarget.style.borderColor = '#4b5563'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTheme !== theme.name) {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.3)'
                  e.currentTarget.style.borderColor = '#374151'
                }
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{theme.icon}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>{theme.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{theme.desc}</div>
              {selectedTheme === theme.name && (
                <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '0.5rem', fontWeight: '700' }}>
                  ✓ ACTIVE
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Made by Alen */}
      <div style={{
        textAlign: 'center',
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: '1px solid #374151'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem',
          fontSize: '1rem',
          color: '#6b7280'
        }}>
          <span>Made with</span>
          <span style={{ color: '#ef4444' }}>❤️</span>
          <span>by Alen</span>
        </div>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginTop: '0.5rem'
        }}>
          Finance AI Dashboard - Your intelligent financial companion
        </p>
      </div>
    </div>
  )
}