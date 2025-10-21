// src/components/Logo.tsx
export function Logo() {
  return (
    <div className="logo">
      <div className="logo-icon">
        <img 
          src="/icons/categories/main-avatar.jpeg"
          alt="Finance AI Logo"
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />
      </div>
      <span className="logo-text">Finance AI</span>
    </div>
  )
}