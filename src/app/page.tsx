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
      padding: '15px'
    }}>
      <div style={{
        maxWidth: '1400px',
        width: '98%',
        margin: '0 auto',
        textAlign: 'center',
        color: 'white'
      }}>
        {/* Logo */}
        <div style={{
          width: '60px',
          height: '60px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 'var(--radius-large)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-3) auto',
          backdropFilter: 'blur(10px)',
          boxShadow: 'var(--shadow-large)',
          padding: '10px'
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
          fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
          fontWeight: '800',
          marginBottom: 'var(--space-2)',
          lineHeight: '1.2',
          textShadow: '0 2px 20px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          Welcome to Finance AI
        </h1>

        <p style={{
          fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
          marginBottom: 'var(--space-5)',
          opacity: 0.95,
          maxWidth: '800px',
          margin: '0 auto var(--space-5) auto',
          lineHeight: '1.4',
          textAlign: 'center'
        }}>
          Your AI-powered financial companion that learns from your habits and helps you make smarter money decisions.
        </p>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
          maxWidth: '1200px',
          margin: '0 auto var(--space-6) auto'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: 'var(--space-5)',
            borderRadius: 'var(--radius-large)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📊</div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '700',
              marginBottom: 'var(--space-2)',
              textAlign: 'center'
            }}>Smart Analytics</h3>
            <p style={{
              fontSize: '0.8rem',
              opacity: 0.9,
              lineHeight: '1.3',
              textAlign: 'center'
            }}>
              AI-driven insights that adapt to your spending patterns and financial goals.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: 'var(--space-5)',
            borderRadius: 'var(--radius-large)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🤖</div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '700',
              marginBottom: 'var(--space-2)',
              textAlign: 'center'
            }}>Predictive AI</h3>
            <p style={{
              fontSize: '0.8rem',
              opacity: 0.9,
              lineHeight: '1.3',
              textAlign: 'center'
            }}>
              Forecast future expenses and get alerts before you overspend.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: 'var(--space-5)',
            borderRadius: 'var(--radius-large)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🎯</div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '700',
              marginBottom: 'var(--space-2)',
              textAlign: 'center'
            }}>Goal Automation</h3>
            <p style={{
              fontSize: '0.8rem',
              opacity: 0.9,
              lineHeight: '1.3',
              textAlign: 'center'
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
          marginTop: 'var(--space-3)'
        }}>
          <div className="loading-spinner" style={{
            width: '18px',
            height: '18px',
            borderColor: 'rgba(255,255,255,0.3)',
            borderTopColor: 'white'
          }}></div>
          <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Loading your dashboard...</span>
        </div>
      </div>
    </div>
  )
}