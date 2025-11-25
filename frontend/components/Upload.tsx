'use client'

import { useState } from 'react'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  async function onUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    fd.append('metadata', 'uploaded-from-frontend')
    setStatus('Uploading...')
    const res = await fetch('http://localhost:8000/upload', { method: 'POST', body: fd })
    const j = await res.json()
    setStatus(JSON.stringify(j))
  }

  return (
    <section style={{ marginBottom: 24 }}>
      <form onSubmit={onUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button type="submit">Upload</button>
      </form>
      {status && <pre>{status}</pre>}
    </section>
  )
}
