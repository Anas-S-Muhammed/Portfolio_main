import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Portfolio page preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get('title') || 'Anas Muhammed').slice(0, 100)
  const subtitle = (searchParams.get('subtitle') || 'Data Engineering · Analytics · Applied ML').slice(0, 140)
  return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#f4f1ec', color: '#0e0e0e', fontFamily: 'sans-serif' }}><div style={{ display: 'flex', fontSize: 22, letterSpacing: 8, color: '#ff5a1f' }}>ANAS MUHAMMED / PORTFOLIO</div><div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}><div style={{ display: 'flex', maxWidth: 1000, fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02 }}>{title}</div><div style={{ display: 'flex', fontSize: 30, color: '#6b6b6b' }}>{subtitle}</div></div><div style={{ display: 'flex', width: 92, height: 10, background: '#ff5a1f' }} /></div>, size)
}
