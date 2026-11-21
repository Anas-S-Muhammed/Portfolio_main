'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string; sources?: { title: string; url: string }[] }

export function ChatWidget({ enabled, greeting, chips }: { enabled?: boolean | null; greeting?: string | null; chips?: (string | null)[] | null }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const hello: Message = { role: 'assistant', content: greeting || 'Hi. Ask me about Anas’s published projects, skills, or availability.' }

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function ask(question: string) {
    const value = question.trim()
    if (!value || busy) return
    setDraft('')
    const prior = messages.length ? messages : [hello]
    setMessages([...prior, { role: 'user', content: value }, { role: 'assistant', content: '' }])
    setBusy(true)
    const sessionId = sessionStorage.getItem('portfolio-chat-session') || crypto.randomUUID()
    sessionStorage.setItem('portfolio-chat-session', sessionId)
    const path = window.location.pathname
    const projectSlug = path.startsWith('/projects/') ? path.split('/')[2] : undefined
    const controller = new AbortController()
    controllerRef.current = controller
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, signal: controller.signal, body: JSON.stringify({ message: value, history: prior.slice(-8).map(({ role, content }) => ({ role, content })), sessionId, projectSlug }) })
      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error?.message || 'The assistant is unavailable right now.')
      }
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { value: chunk, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(chunk, { stream: true })
        const frames = buffer.split(/\r?\n\r?\n/)
        buffer = frames.pop() || ''
        for (const frame of frames) {
          const line = frame.split(/\r?\n/).find((item) => item.startsWith('data:'))?.slice(5).trim()
          if (!line) continue
          const event = JSON.parse(line) as { type: string; text?: string; message?: string; sources?: Message['sources'] }
          if (event.type === 'text' && event.text) setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content: item.content + event.text } : item))
          if (event.type === 'sources') setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, sources: event.sources } : item))
          if (event.type === 'error') throw new Error(event.message || 'The assistant could not finish this response.')
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      const content = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, content } : item))
    } finally { setBusy(false); controllerRef.current = null }
  }

  if (!enabled) return null
  const shown = messages.length ? messages : [hello]
  return <>
    <button className="chat-launcher" type="button" aria-label={open ? 'Close portfolio assistant' : 'Open portfolio assistant'} aria-expanded={open} onClick={() => setOpen((value) => !value)}><MessageCircle aria-hidden size={21} /><span className="chat-launcher-label">Ask about Anas</span></button>
    {open && <section className="chat-panel" role="dialog" aria-modal="true" aria-labelledby="chat-title" onKeyDown={(event) => { if (event.key !== 'Tab') return; const items = event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),a[href]'); if (!items.length) return; if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1]?.focus() } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0]?.focus() } }}>
      <header className="chat-header"><div><span className="mono-label">PORTFOLIO ASSISTANT</span><h2 id="chat-title">A quick introduction</h2></div><button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat"><X size={19} /></button></header>
      <div className="chat-messages" aria-live="polite" aria-busy={busy}>{shown.map((item, i) => <article className={`chat-message chat-${item.role}`} key={`${item.role}-${i}`}><p>{item.content || (busy && i === shown.length - 1 ? 'Thinking…' : '')}</p>{item.sources?.length ? <div className="chat-sources">{item.sources.map((source) => <a key={`${source.title}-${source.url}`} href={source.url}>{source.title} ↗</a>)}</div> : null}</article>)}</div>
      {shown.length === 1 && chips?.filter((chip): chip is string => Boolean(chip)).length ? <div className="chat-suggestions">{chips.filter((chip): chip is string => Boolean(chip)).map((chip) => <button type="button" key={chip} onClick={() => void ask(chip)}>{chip}</button>)}</div> : null}
      <form className="chat-compose" onSubmit={(event) => { event.preventDefault(); void ask(draft) }}><input ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={1000} aria-label="Ask a question" placeholder="Ask about a project…" disabled={busy} /><button className="chat-send" type="submit" disabled={busy || !draft.trim()} aria-label="Send message"><Send size={17} /></button></form>
      <p className="chat-privacy">Answers use published portfolio content. Conversations are stored without your raw IP and can be deleted by the owner.</p>
    </section>}
  </>
}
