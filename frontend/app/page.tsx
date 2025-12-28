'use client'

import Chat from '../components/Chat'
import Upload from '../components/Upload'
import { useEffect, useState } from 'react'

export default function Page() {
  const [showUpload, setShowUpload] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'active'>('checking')
  const [showBackendBanner, setShowBackendBanner] = useState(false)

  useEffect(() => {
    let didCancel = false;
    let timeoutId: NodeJS.Timeout;
    const checkBackend = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/health`)
        if (!didCancel) {
          if (res.ok) {
            setBackendStatus('active')
            setShowBackendBanner(false)
          } else {
            setShowBackendBanner(true)
          }
        }
      } catch {
        if (!didCancel) setShowBackendBanner(true)
      }
    }
    checkBackend()
    // Show banner if backend doesn't respond in 5 seconds
    timeoutId = setTimeout(() => {
      if (!didCancel && backendStatus === 'checking') {
        setShowBackendBanner(true)
      }
    }, 5000)
    // Keep polling until backend is up
    const poll = setInterval(() => {
      if (backendStatus === 'checking') checkBackend()
      else clearInterval(poll)
    }, 3000)
    return () => {
      didCancel = true
      clearTimeout(timeoutId)
      clearInterval(poll)
    }
  }, [backendStatus])

  // Always render the UI, but show banner/spinner if backend is not ready
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
      {/* Backend status banner */}
      {backendStatus === 'checking' && (
        <div style={{
          width: '100%',
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          padding: '8px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontSize: '16px',
          borderBottom: '1px solid var(--border)',
          zIndex: 1000
        }}>
          <div className="spinner" style={{
            width: '24px',
            height: '24px',
            border: '3px solid var(--bg-primary)',
            borderTop: '3px solid var(--accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px'
          }}></div>
          Checking backend status...
        </div>
      )}
      {showBackendBanner && (
        <div style={{
          width: '100%',
          background: '#f59e42',
          color: '#222',
          padding: '8px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '15px',
          borderBottom: '1px solid #eab308',
          zIndex: 1000
        }}>
          <span style={{marginLeft: '8px'}}>The backend is waking up due to inactivity on Render's free tier. This may take 30-60 seconds. Please wait.</span>
        </div>
      )}
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent) 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '18px'
          }}>
            T
          </div>
          <div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>TalkFlow</h1>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              margin: 0
            }}>AI Assistant with RAG</p>
          </div>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          style={{
            padding: '8px 16px',
            background: showUpload ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = showUpload ? 'var(--bg-hover)' : 'var(--bg-tertiary)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Documents
        </button>
      </header>

      {/* Upload Section */}
      {showUpload && (
        <div style={{
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px',
          background: 'var(--bg-secondary)',
          flexShrink: 0
        }}>
          <Upload />
        </div>
      )}

      {/* Chat Section */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Chat />
      </div>

      <style global jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
