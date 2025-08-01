// src/components/Logo.tsx
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
  className?: string
}

export function Logo({ size = 'medium', showText = true, className = '' }: LogoProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const sizeMap = {
    small: { width: 32, height: 32, fontSize: 'text-lg', iconSize: '16px' },
    medium: { width: 48, height: 48, fontSize: 'text-xl', iconSize: '24px' },
    large: { width: 72, height: 72, fontSize: 'text-2xl', iconSize: '36px' }
  }
  
  const { width, height, fontSize, iconSize } = sizeMap[size]
  
  // Test if image exists
  useEffect(() => {
    const testImage = new window.Image()
    testImage.onload = () => {
      console.log('✅ Logo image found and loaded')
      setImageLoaded(true)
    }
    testImage.onerror = () => {
      console.error('❌ Logo image not found at /images/logo.png')
      setImageError(true)
    }
    testImage.src = '/images/logo.png'
  }, [])
  
  return (
    <div className={`logo flex items-center gap-3 ${className}`}>
      <div className="logo-icon" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-large)',
        boxShadow: size === 'large' ? 'var(--shadow-medium)' : 'var(--shadow-small)',
        padding: size === 'large' ? 'var(--space-4)' : 'var(--space-2)',
        background: 'linear-gradient(135deg, var(--color-green) 0%, var(--color-blue) 100%)',
        overflow: 'hidden',
        width: `${width + (size === 'large' ? 24 : size === 'medium' ? 16 : 8)}px`,
        height: `${height + (size === 'large' ? 24 : size === 'medium' ? 16 : 8)}px`
      }}>
        {!imageError && imageLoaded ? (
          <Image 
            src="/images/logo.png"
            alt="AI Finance Logo"
            width={width}
            height={height}
            priority
            style={{
              objectFit: 'contain',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
            onError={() => {
              console.error('Next.js Image component failed to load logo')
              setImageError(true)
            }}
          />
        ) : (
          // Fallback icon - using a financial emoji that fits the theme
          <span style={{
            color: 'white',
            fontSize: iconSize,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            💰
          </span>
        )}
      </div>
      {showText && (
        <span className={`logo-text ${fontSize} font-semibold tracking-tight`} style={{
          background: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-green) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Finance AI
        </span>
      )}
    </div>
  )
}