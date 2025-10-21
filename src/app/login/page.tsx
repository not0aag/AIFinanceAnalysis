'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate loading for better UX
    setTimeout(() => {
      // For localStorage version, just validate and redirect
      if (email && password) {
        // Store a simple auth flag in localStorage
        localStorage.setItem('finance-ai-auth', 'true')
        localStorage.setItem('finance-ai-user', JSON.stringify({ email }))
        router.push('/dashboard')
      } else {
        setError('Please enter your email and password')
        setIsLoading(false)
      }
    }, 500)
  }

  return (
    <div className="login-layout">
      <div className="login-card fade-in">
        {/* Clean Header with Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--color-blue) 0%, var(--color-blue-dark) 100%)',
            borderRadius: 'var(--radius-large)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-6) auto',
            boxShadow: 'var(--shadow-medium)',
            padding: '12px',
            overflow: 'hidden'
          }}>
            <img 
              src="/icons/categories/main-avatar.jpeg"
              alt="Finance AI Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 'var(--radius-medium)'
              }}
            />
          </div>
          <h1 className="text-title-1" style={{ marginBottom: 'var(--space-2)' }}>
            Finance AI
          </h1>
          <p className="text-footnote">
            {isSignUp ? 'Create your intelligent financial companion' : 'Welcome back to your financial dashboard'}
          </p>
        </div>

        {/* Clean Form */}
        <form onSubmit={handleAuth} style={{ display: 'grid', gap: 'var(--space-6)' }}>
          {error && (
            <div style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-medium)',
              backgroundColor: 'rgba(255, 59, 48, 0.1)',
              border: '1px solid rgba(255, 59, 48, 0.3)',
              color: 'var(--color-red)',
              fontSize: 'var(--font-size-footnote)',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-large"
            style={{
              width: '100%',
              marginTop: 'var(--space-4)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div className="loading-spinner" style={{ 
                  width: '16px', 
                  height: '16px',
                  borderWidth: '2px'
                }}></div>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </div>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        {/* Toggle */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            className="btn btn-ghost"
            style={{ fontSize: 'var(--font-size-footnote)' }}
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </button>
        </div>

        {/* Features Preview */}
        <div style={{
          marginTop: 'var(--space-8)',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--color-border)'
        }}>
          <div className="grid grid-3" style={{ gap: 'var(--space-4)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'var(--font-size-title-3)',
                marginBottom: 'var(--space-1)'
              }}>📊</div>
              <p className="text-caption-1">Smart Analytics</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'var(--font-size-title-3)',
                marginBottom: 'var(--space-1)'
              }}>🤖</div>
              <p className="text-caption-1">AI Insights</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'var(--font-size-title-3)',
                marginBottom: 'var(--space-1)'
              }}>🎯</div>
              <p className="text-caption-1">Goal Tracking</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: 'var(--space-8)',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--color-border)'
        }}>
          <p className="text-caption-1">
            Made with ♥ by Alen
          </p>
        </div>
      </div>
    </div>
  )
}