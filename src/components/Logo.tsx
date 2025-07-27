// src/components/Logo.tsx
import Image from 'next/image'

export function Logo() {
  return (
    <div className="logo">
      <div className="logo-icon">
        <Image 
          src="/images/logo.svg"  // Note: path starts from public folder
          alt="AI Finance Logo"
          width={48}
          height={48}
          priority
        />
      </div>
      <span className="logo-text">AI Finance</span>
    </div>
  )
}