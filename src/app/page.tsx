'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('finance-ai-auth')
    if (isAuth) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-blue) 0%, var(--color-purple) 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '95%',
        margin: '0 auto',
        textAlign: 'center',
        color: 'white'
      }}>
        {/* Logo */}
        <div style={{
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 'var(--radius-large)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-4) auto',
          backdropFilter: 'blur(10px)',
          boxShadow: 'var(--shadow-large)',
          padding: '12px'
        }}>
          <img 
            src="/icons/categories/main-avatar.jpeg"
            alt="Finance AI"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'var(--radius-medium)'
            }}
          />
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: '800',
          marginBottom: 'var(--space-3)',
          lineHeight: '1.2',
          textShadow: '0 2px 20px rgba(0,0,0,0.2)'
        }}>
          Welcome to Finance AI
        </h1>

        <p style={{
          fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
          marginBottom: 'var(--space-6)',
          opacity: 0.95,
          maxWidth: '700px',
          margin: '0 auto var(--space-6) auto',
          lineHeight: '1.5'
        }}>
          Your AI-powered financial companion that learns from your habits and helps you make smarter money decisions.
        </p>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)',
          maxWidth: '1000px',
          margin: '0 auto var(--space-8) auto'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-large)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>📊</div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              marginBottom: 'var(--space-2)'
            }}>Smart Analytics</h3>
            <p style={{
              fontSize: '0.875rem',
              opacity: 0.9,
              lineHeight: '1.4'
            }}>
              AI-driven insights that adapt to your spending patterns and financial goals.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-large)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>🤖</div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              marginBottom: 'var(--space-2)'
            }}>Predictive AI</h3>
            <p style={{
              fontSize: '0.875rem',
              opacity: 0.9,
              lineHeight: '1.4'
            }}>
              Forecast future expenses and get alerts before you overspend.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-large)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>🎯</div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              marginBottom: 'var(--space-2)'
            }}>Goal Automation</h3>
            <p style={{
              fontSize: '0.875rem',
              opacity: 0.9,
              lineHeight: '1.4'
            }}>
              Set it and forget it - we'll help you reach your financial goals automatically.
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          marginTop: 'var(--space-4)'
        }}>
          <div className="loading-spinner" style={{
            width: '20px',
            height: '20px',
            borderColor: 'rgba(255,255,255,0.3)',
            borderTopColor: 'white'
          }}></div>
          <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Loading your dashboard...</span>
        </div>
      </div>
    </div>
  )
}