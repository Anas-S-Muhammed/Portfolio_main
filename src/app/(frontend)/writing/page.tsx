import Link from 'next/link'
import { getPosts } from '@/lib/content'

export const metadata = { title: 'Writing', description: 'Notes on data, software and building useful systems.' }
export default async function WritingPage() {
  const posts = await getPosts()
  return <section className="container-page section-space"><Link href="/#top" className="mono-label">← Home</Link><p className="eyebrow mt-10">Writing</p><h1 className="display-section">Notes from the work.</h1>{posts.length ? <div className="writing-list">{posts.map((post) => <Link className="writing-row" href={`/writing/${post.slug}`} key={post.id}><span className="mono-label">{post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('en', { year: 'numeric', month: 'short' }) : 'NOTE'}</span><span><strong>{post.title}</strong><small>{post.excerpt}</small></span><span>↗</span></Link>)}</div> : <p className="empty-note">No writing has been published yet.</p>}</section>
}
