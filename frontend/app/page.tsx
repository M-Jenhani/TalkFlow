'use client'

import Chat from '../components/Chat'
import Upload from '../components/Upload'
import { useState } from 'react'

export default function Page() {
  const [showUpload, setShowUpload] = useState(false)

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
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
    </div>
  )
}
