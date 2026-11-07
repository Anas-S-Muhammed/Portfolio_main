'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (target: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void }) => string
      remove: (widgetId: string) => void
    }
  }
}

export function ContactForm({ siteKey, turnstileRequired = false }: { siteKey?: string; turnstileRequired?: boolean }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')
  const challengeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!siteKey || !turnstileRequired || !challengeRef.current) return
    let widgetId: string | undefined
    const render = () => {
      if (!window.turnstile || !challengeRef.current || widgetId) return
      widgetId = window.turnstile.render(challengeRef.current, { sitekey: siteKey, callback: setToken, 'expired-callback': () => setToken('') })
    }
    if (window.turnstile) render()
    else {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.addEventListener('load', render)
      document.head.append(script)
    }
    return () => { if (widgetId) window.turnstile?.remove(widgetId) }
  }, [siteKey, turnstileRequired])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('sending')
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const payload = { ...Object.fromEntries(form.entries()), turnstileToken: token }
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error?.message || 'Please try again.')
      setState('sent')
      setMessage(result.message || 'Thanks. Your message is in.')
      formElement.reset()
      setToken('')
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : 'The message could not be sent.')
    }
  }

  return <form className="contact-form" onSubmit={submit}>
    <label>Name<input name="name" autoComplete="name" required maxLength={120} /></label>
    <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    <label>Subject<input name="subject" maxLength={160} /></label>
    <label>Message<textarea name="message" required minLength={10} maxLength={5000} rows={6} /></label>
    <label className="contact-honeypot" aria-hidden="true">Leave this field empty<input tabIndex={-1} name="website" autoComplete="off" /></label>
    {turnstileRequired && siteKey ? <div ref={challengeRef} aria-label="Spam protection verification" /> : null}
    {turnstileRequired && !siteKey ? <p className="text-muted">Spam verification is enabled in Admin but its public key is missing.</p> : null}
    <button className="button button-primary" type="submit" disabled={state === 'sending' || (turnstileRequired && (!siteKey || !token))}>{state === 'sending' ? 'Sending?' : 'Send message ?'}</button>
    <p className="mono-label" role="status" aria-live="polite">{message}</p>
  </form>
}
