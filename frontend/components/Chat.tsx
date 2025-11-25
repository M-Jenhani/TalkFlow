'use client'

import { useEffect, useRef, useState } from 'react'

const PERSONALITIES = ['default', 'yoda', 'pirate']

export default function Chat() {
  const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([])
  const [input, setInput] = useState('')
  const [personality, setPersonality] = useState('default')
  const [lang, setLang] = useState('en')
  const [listening, setListening] = useState(false)
  const esRef = useRef<EventSource | null>(null)

  function append(from: string, text: string) {
    setMessages((m) => [...m, { from, text }])
  }

  async function send() {
    if (!input.trim()) return
    append('user', input)
    const q = encodeURIComponent(input)
    const url = `http://localhost:8000/stream?q=${q}&session_id=default&personality=${personality}&lang=${lang}`
    // close previous
    if (esRef.current) {
      esRef.current.close()
    }
    const es = new EventSource(url)
    esRef.current = es
    let assistantText = ''
    es.onmessage = (e) => {
      assistantText += e.data
      // update streaming last message
      setMessages((m) => {
        const others = m.filter((x) => x.from !== 'assistant-stream')
        return [...others, { from: 'assistant-stream', text: assistantText }]
      })
    }
    es.onerror = () => {
      // finalize
      setMessages((m) => m.map((x) => (x.from === 'assistant-stream' ? { from: 'assistant', text: x.text } : x)))
      es.close()
    }
    setInput('')
  }

  // Browser speech synthesis for voice out
  function speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const utter = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  // Simple voice-in using Web Speech API
  function startListening() {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('SpeechRecognition not available in this browser')
      return
    }
    // @ts-ignore
    const rec = new SpeechRecognition()
    rec.lang = lang
    rec.interimResults = false
    rec.onresult = (ev: any) => {
      const txt = ev.results[0][0].transcript
      setInput((s) => (s ? s + ' ' + txt : txt))
    }
    rec.onend = () => setListening(false)
    rec.start()
    setListening(true)
  }

  return (
    <section>
      <div style={{ marginBottom: 12 }}>
        <label>Personality: </label>
        <select value={personality} onChange={(e) => setPersonality(e.target.value)}>
          {PERSONALITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <label style={{ marginLeft: 12 }}>Language: </label>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <div style={{ border: '1px solid #ddd', padding: 12, minHeight: 200 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <b>{m.from}:</b> {m.text}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <input style={{ width: '70%' }} value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={send}>Send</button>
        <button onClick={() => { if (messages.length) speak(messages[messages.length-1].text) }}>Play Last</button>
        <button onClick={() => startListening()}>{listening ? 'Listening...' : 'Voice In'}</button>
      </div>
    </section>
  )
}
