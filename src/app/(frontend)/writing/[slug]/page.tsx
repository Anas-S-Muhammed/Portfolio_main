import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPosts } from '@/lib/content'

type Post = Awaited<ReturnType<typeof getPosts>>[number]
function toText(value: unknown): string {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return ''
  const node = value as { text?: unknown; children?: unknown[]; root?: unknown }
  if (typeof node.text === 'string') return node.text
  if (Array.isArray(node.children)) return node.children.map(toText).filter(Boolean).join(' ')
  return node.root ? toText(node.root) : ''
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = (await getPosts()).find((entry) => entry.slug === slug)
  return post ? { title: post.title, description: post.excerpt || undefined } : {}
}
export default async function WritingDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = (await getPosts()).find((entry) => entry.slug === slug) as Post | undefined
  if (!post) notFound()
  const paragraphs = toText(post.body).split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean)
  return <article className="container-page section-space writing-article"><Link className="mono-label" href="/writing">← Writing</Link><p className="eyebrow mt-10">{post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('en', { dateStyle: 'long' }) : 'Field notes'}</p><h1 className="display-section">{post.title}</h1>{post.excerpt && <p className="section-lede">{post.excerpt}</p>}<div className="prose-content">{paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div></article>
}
