'use client'

import { useState } from 'react'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  async function onUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file || uploading) return
    const fd = new FormData()
    fd.append('file', file)
    fd.append('metadata', 'uploaded-from-frontend')
    setStatus(null)
    setUploading(true)
    try {
      const res = await fetch('http://localhost:8000/upload', { method: 'POST', body: fd })
      const j = await res.json()
      if (res.ok) {
        setStatus('✓ Upload successful')
        setFile(null)
      } else {
        setStatus('✗ Upload failed: ' + (j.detail || 'Unknown error'))
      }
    } catch (err) {
      setStatus('✗ Upload failed: ' + (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div>
      <form onSubmit={onUpload} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            flex: 1,
            border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '8px',
            padding: '20px',
            background: dragActive ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative'
          }}
        >
          <input
            type="file"
            accept=".txt,.md,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer'
            }}
          />
          <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ margin: '0 auto 8px', color: 'var(--text-tertiary)' }}
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
            {file ? (
              <div>
                <p style={{ color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }}>
                  {file.name}
                </p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }}>
                  Drop file here or click to browse
                </p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                  Supports .txt, .md, .pdf
                </p>
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={!file || uploading}
          style={{
            padding: '12px 24px',
            background: !file || uploading ? 'var(--bg-tertiary)' : 'var(--accent)',
            border: 'none',
            borderRadius: '8px',
            color: !file || uploading ? 'var(--text-tertiary)' : 'white',
            cursor: !file || uploading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s',
            height: '80px'
          }}
          onMouseEnter={(e) => {
            if (file && !uploading) e.currentTarget.style.background = 'var(--accent-hover)'
          }}
          onMouseLeave={(e) => {
            if (file && !uploading) e.currentTarget.style.background = 'var(--accent)'
          }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {status && (
        <div style={{
          marginTop: '12px',
          padding: '12px 16px',
          borderRadius: '8px',
          background: status.startsWith('✓') ? '#0d4d2d' : '#4d0d0d',
          color: status.startsWith('✓') ? '#5ef48e' : '#f45e5e',
          fontSize: '14px',
          border: `1px solid ${status.startsWith('✓') ? '#1a6b3f' : '#6b1a1a'}`
        }}>
          {status}
        </div>
      )}
    </div>
  )
}
