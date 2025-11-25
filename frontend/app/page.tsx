'use client'

import Chat from '../components/Chat'
import Upload from '../components/Upload'

export default function Page() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1>TalkFlow</h1>
      <p>Upload documents, choose a personality, and chat (streaming, voice in/out).</p>
      <Upload />
      <Chat />
    </div>
  )
}
