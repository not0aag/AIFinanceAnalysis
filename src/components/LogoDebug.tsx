// Debug component to test image loading
import Image from 'next/image'

export function LogoDebug() {
  return (
    <div style={{ padding: '20px', border: '1px solid red' }}>
      <h3>Logo Debug Test</h3>
      
      {/* Test 1: Direct image */}
      <div style={{ marginBottom: '20px' }}>
        <h4>Test 1: Direct img tag</h4>
        <img 
          src="/images/logo.png" 
          alt="Direct logo test" 
          width="48" 
          height="48"
          onLoad={() => console.log('✅ Direct img loaded successfully')}
          onError={() => console.error('❌ Direct img failed to load')}
        />
      </div>

      {/* Test 2: Next.js Image component */}
      <div style={{ marginBottom: '20px' }}>
        <h4>Test 2: Next.js Image component</h4>
        <Image 
          src="/images/logo.png" 
          alt="Next.js logo test" 
          width={48} 
          height={48}
          onLoad={() => console.log('✅ Next.js Image loaded successfully')}
          onError={() => console.error('❌ Next.js Image failed to load')}
        />
      </div>

      {/* Test 3: Check file path */}
      <div>
        <h4>Test 3: Expected file path</h4>
        <p>Should be accessible at: <code>/images/logo.png</code></p>
        <p>Full URL: <code>{typeof window !== 'undefined' ? window.location.origin : ''}/images/logo.png</code></p>
      </div>
    </div>
  )
}
