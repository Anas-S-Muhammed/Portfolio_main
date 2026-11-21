import type { Metadata, Viewport } from 'next'

import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteNav } from '@/components/layout/site-nav'
import { Providers } from '@/components/providers/providers'
import { SmoothScroll } from '@/components/providers/smooth-scroll'
import { ChatWidget } from '@/components/shared/chat-widget'
import { PageTracker } from '@/components/shared/page-tracker'
import { CommandPalette } from '@/components/shared/command-palette'
import { getAISettings, getGlobalSettings, getThemeSettings } from '@/lib/content/settings'
import { getPosts, getProjects } from '@/lib/content'

import '@/styles/globals.css'

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getGlobalSettings()
  const title = site.seo?.defaultTitle || 'Anas Muhammed - Data Engineering & Analytics'
  const description = site.seo?.description || 'Computer Science student building data pipelines, SQL models and explainable ML.'
  const canonical = site.seo?.canonicalUrl || serverURL
  const image = typeof site.seo?.ogImage === 'object' ? site.seo.ogImage?.url : undefined
  return {
    metadataBase: new URL(canonical),
    title: { default: title, template: '%s - ' + (site.name || 'Anas Muhammed') },
    description,
    keywords: site.seo?.keywords?.filter((value): value is string => Boolean(value)),
    alternates: { canonical },
    openGraph: { type: 'website', siteName: site.name || 'Anas Muhammed', url: canonical, title, description, images: image ? [image] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
    robots: { index: true, follow: true },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f1ec' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0b0c' },
  ],
}

/**
 * Applied before first paint so the theme never flashes.
 * Reads the same localStorage key the ThemeProvider persists to.
 */
const themeNoFlashScript = `
(function(){try{
  var m=localStorage.getItem('theme')||'system';
  var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark',d);
  document.documentElement.style.colorScheme=d?'dark':'light';
}catch(e){}})();
`

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [theme, site, ai, projects, posts] = await Promise.all([getThemeSettings(), getGlobalSettings(), getAISettings(), getProjects({ limit: 50 }), getPosts(20)])
  const paletteItems = [
    ...projects.map((project) => ({ label: project.title, href: `/projects/${project.slug}`, type: 'Project' })),
    ...posts.map((post) => ({ label: post.title, href: `/writing/${post.slug}`, type: 'Writing' })),
  ]

  const accent = theme.accentPreset === 'custom' && theme.customAccent ? theme.customAccent : null

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-accent={accent ? 'custom' : (theme.accentPreset ?? 'ember')}
      data-motion={theme.animationIntensity ?? 'full'}
      data-grain={theme.grain === false ? 'off' : 'on'}
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeNoFlashScript }} />
        {accent ? <style>{`:root{--accent:${accent}}`}</style> : null}
      </head>
      <body>
        <Providers defaultTheme={theme.defaultMode ?? 'system'}>
          <SmoothScroll />
          <PageTracker />
          {theme.grain === false ? null : <div aria-hidden className="grain-overlay" />}
          <a
            href="#main"
            className="mono-label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
          >
            Skip to content
          </a>
          <SiteNav />
          <main id="main">{children}</main>
          <SiteFooter />
          <ChatWidget enabled={ai.enabled} greeting={ai.greeting} chips={ai.suggestedChips} />
          <CommandPalette items={paletteItems} />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: site?.name ?? 'Anas Muhammed',
              jobTitle: 'Data Engineering & Analytics student',
              affiliation: site?.facts?.university ?? 'Albukhary International University',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Alor Setar',
                addressRegion: 'Kedah',
                addressCountry: 'MY',
              },
              url: serverURL,
            }),
          }}
        />
      </body>
    </html>
  )
}

