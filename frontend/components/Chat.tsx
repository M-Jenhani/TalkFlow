'use client'

import { useEffect, useRef, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const PERSONALITIES = [
  { id: 'default', label: 'Default', icon: '🤖' },
  { id: 'yoda', label: 'Yoda', icon: '🧙' },
  { id: 'pirate', label: 'Pirate', icon: '🏴‍☠️' }
]

const LANGUAGES = [
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' }
]

export default function Chat() {
  const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([])
  const [input, setInput] = useState('')
  const [personality, setPersonality] = useState('default')
  const [lang, setLang] = useState('en')
  const [listening, setListening] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const esRef = useRef<EventSource | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function append(from: string, text: string) {
    setMessages((m) => [...m, { from, text }])
  }

  async function send() {
    if (!input.trim() || isStreaming) return
    const userMessage = input
    append('user', userMessage)
    setInput('')
    setIsStreaming(true)
    
    const q = encodeURIComponent(userMessage)
    const url = `${API_BASE}/stream?q=${q}&session_id=default&personality=${personality}&lang=${lang}`
    
    if (esRef.current) {
      esRef.current.close()
    }
    
    const es = new EventSource(url)
    esRef.current = es
    let assistantText = ''
    
    es.onmessage = (e) => {
      assistantText += e.data
      setMessages((m) => {
        const others = m.filter((x) => x.from !== 'assistant-stream')
        return [...others, { from: 'assistant-stream', text: assistantText }]
      })
    }
    
    es.onerror = () => {
      setMessages((m) => m.map((x) => (x.from === 'assistant-stream' ? { from: 'assistant', text: x.text } : x)))
      es.close()
      setIsStreaming(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'fr-FR'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  function startListening() {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition not available in this browser')
      return
    }
    // @ts-ignore
    const rec = new SpeechRecognition()
    rec.lang = lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'fr-FR'
    rec.interimResults = false
    rec.onresult = (ev: any) => {
      const txt = ev.results[0][0].transcript
      setInput((s) => (s ? s + ' ' + txt : txt))
    }
    rec.onend = () => setListening(false)
    rec.start()
    setListening(true)
  }

  function clearChat() {
    if (confirm('Clear all messages?')) {
      setMessages([])
      if (esRef.current) {
        esRef.current.close()
      }
      setIsStreaming(false)
    }
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '900px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Settings Bar */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        background: 'var(--bg-secondary)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Personality:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {PERSONALITIES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPersonality(p.id)}
                style={{
                  padding: '6px 12px',
                  background: personality === p.id ? 'var(--accent)' : 'var(--bg-tertiary)',
                  border: `1px solid ${personality === p.id ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '6px',
                  color: personality === p.id ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  if (personality !== p.id) e.currentTarget.style.background = 'var(--bg-hover)'
                }}
                onMouseLeave={(e) => {
                  if (personality !== p.id) e.currentTarget.style.background = 'var(--bg-tertiary)'
                }}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Language:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                style={{
                  padding: '6px 12px',
                  background: lang === l.id ? 'var(--accent)' : 'var(--bg-tertiary)',
                  border: `1px solid ${lang === l.id ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '6px',
                  color: lang === l.id ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  if (lang !== l.id) e.currentTarget.style.background = 'var(--bg-hover)'
                }}
                onMouseLeave={(e) => {
                  if (lang !== l.id) e.currentTarget.style.background = 'var(--bg-tertiary)'
                }}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={clearChat}
          disabled={messages.length === 0}
          style={{
            marginLeft: 'auto',
            padding: '6px 12px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: messages.length === 0 ? 'var(--text-tertiary)' : 'var(--text-secondary)',
            cursor: messages.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (messages.length > 0) e.currentTarget.style.borderColor = '#ff4444'
            if (messages.length > 0) e.currentTarget.style.color = '#ff4444'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = messages.length === 0 ? 'var(--text-tertiary)' : 'var(--text-secondary)'
          }}
        >
          Clear
        </button>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-tertiary)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent) 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              💬
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Start a conversation
            </h2>
            <p style={{ fontSize: '14px' }}>
              Ask me anything about your uploaded documents
            </p>
          </div>
        )}

        {messages.map((m, i) => {
          const isUser = m.from === 'user'
          const isStreaming = m.from === 'assistant-stream'
          
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '12px',
                animation: 'fadeIn 0.3s ease-in'
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isUser ? 'var(--user-bg)' : 'linear-gradient(135deg, var(--accent) 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0
              }}>
                {isUser ? '👤' : '🤖'}
              </div>

              {/* Message Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '6px'
                }}>
                  {isUser ? 'You' : 'TalkFlow'}
                </div>
                <div style={{
                  fontSize: '15px',
                  lineHeight: '1.6',
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {m.text}
                  {isStreaming && (
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '16px',
                      background: 'var(--accent)',
                      marginLeft: '2px',
                      animation: 'blink 1s infinite'
                    }} />
                  )}
                </div>
                {!isUser && !isStreaming && (
                  <button
                    onClick={() => speak(m.text)}
                    style={{
                      marginTop: '8px',
                      padding: '4px 10px',
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                      e.currentTarget.style.color = 'var(--accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.color = 'var(--text-tertiary)'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                    Speak
                  </button>
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <button
            onClick={startListening}
            disabled={isStreaming}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: listening ? 'var(--accent)' : 'var(--bg-tertiary)',
              border: `1px solid ${listening ? 'var(--accent)' : 'var(--border)'}`,
              color: listening ? 'white' : 'var(--text-secondary)',
              cursor: isStreaming ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              if (!listening && !isStreaming) e.currentTarget.style.background = 'var(--bg-hover)'
            }}
            onMouseLeave={(e) => {
              if (!listening && !isStreaming) e.currentTarget.style.background = 'var(--bg-tertiary)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
            </svg>
          </button>

          <div style={{
            flex: 1,
            background: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px'
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message TalkFlow..."
              disabled={isStreaming}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '15px',
                resize: 'none',
                maxHeight: '200px',
                minHeight: '24px',
                fontFamily: 'inherit',
                lineHeight: '1.5'
              }}
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = target.scrollHeight + 'px'
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || isStreaming}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: (!input.trim() || isStreaming) ? 'var(--bg-tertiary)' : 'var(--accent)',
                border: 'none',
                color: (!input.trim() || isStreaming) ? 'var(--text-tertiary)' : 'white',
                cursor: (!input.trim() || isStreaming) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (input.trim() && !isStreaming) e.currentTarget.style.background = 'var(--accent-hover)'
              }}
              onMouseLeave={(e) => {
                if (input.trim() && !isStreaming) e.currentTarget.style.background = 'var(--accent)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
        <div style={{
          marginTop: '8px',
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          textAlign: 'center'
        }}>
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
