import Link from 'next/link'
import { getAISettings } from '@/lib/content/settings'

export const metadata = { title: 'Ask the assistant', description: 'A grounded assistant for questions about Anas Muhammed?s published portfolio.' }
export default async function ChatPage() {
  const ai = await getAISettings()
  return <section className="container-page section-space chat-page"><p className="eyebrow">Ask a question</p><h1 className="display-section">A faster way to explore the work.</h1><p className="section-lede">The assistant answers from published portfolio content and links to the sources it used.</p>{ai.enabled ? <p className="empty-note">The assistant is ready in the lower corner of this page.</p> : <p className="empty-note">The assistant is currently resting. Please use the <Link href="/contact">contact page</Link>.</p>}</section>
}
