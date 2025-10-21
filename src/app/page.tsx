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
      padding: '10px'
    }}>
      <div style={{
        maxWidth: '1600px',
        width: '100%',
        margin: '0 auto',
        textAlign: 'center',
        color: 'white'
      }}>
        {/* Logo */}
        <div style={{
          width: '50px',
          height: '50px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 'var(--radius-large)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto',
          backdropFilter: 'blur(10px)',
          boxShadow: 'var(--shadow-large)',
          padding: '8px'
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
          fontSize: 'clamp(1.3rem, 3vw, 1.75rem)',
          fontWeight: '800',
          marginBottom: '8px',
          lineHeight: '1.2',
          textShadow: '0 2px 20px rgba(0,0,0,0.2)',
          textAlign: 'center',
          display: 'block',
          width: '100%'
        }}>
          Welcome to Finance AI
        </h1>

        <p style={{
          fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
          marginBottom: '20px',
          opacity: 0.95,
          maxWidth: '900px',
          margin: '0 auto 20px auto',
          lineHeight: '1.4',
          textAlign: 'center',
          display: 'block',
          width: '100%'
        }}>
          Your AI-powered financial companion that learns from your habits and helps you make smarter money decisions.
        </p>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
          maxWidth: '1400px',
          margin: '0 auto 20px auto',
          width: '100%'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '16px',
            borderRadius: 'var(--radius-large)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '8px' }}>📊</div>
            <h3 style={{
              fontSize: '0.9rem',
              fontWeight: '700',
              marginBottom: '6px',
              textAlign: 'center'
            }}>Smart Analytics</h3>
            <p style={{
              fontSize: '0.75rem',
              opacity: 0.9,
              lineHeight: '1.3',
              textAlign: 'center'
            }}>
              AI-driven insights that adapt to your spending patterns and financial goals.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '16px',
            borderRadius: 'var(--radius-large)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '8px' }}>🤖</div>
            <h3 style={{
              fontSize: '0.9rem',
              fontWeight: '700',
              marginBottom: '6px',
              textAlign: 'center'
            }}>Predictive AI</h3>
            <p style={{
              fontSize: '0.75rem',
              opacity: 0.9,
              lineHeight: '1.3',
              textAlign: 'center'
            }}>
              Forecast future expenses and get alerts before you overspend.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '16px',
            borderRadius: 'var(--radius-large)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '8px' }}>🎯</div>
            <h3 style={{
              fontSize: '0.9rem',
              fontWeight: '700',
              marginBottom: '6px',
              textAlign: 'center'
            }}>Goal Automation</h3>
            <p style={{
              fontSize: '0.75rem',
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
          gap: '8px',
          marginTop: '12px'
        }}>
          <div className="loading-spinner" style={{
            width: '16px',
            height: '16px',
            borderColor: 'rgba(255,255,255,0.3)',
            borderTopColor: 'white'
          }}></div>
          <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Loading your dashboard...</span>
        </div>
      </div>
    </div>
  )
}