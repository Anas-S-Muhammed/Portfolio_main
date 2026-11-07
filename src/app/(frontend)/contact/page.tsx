import { ContactForm } from '@/components/shared/contact-form'
import { getContactSettings } from '@/lib/content/settings'
import { getEnv } from '@/lib/env'

export const metadata = { title: 'Contact', description: 'Get in touch with Anas Muhammed about data engineering and analytics opportunities.' }

export default async function ContactPage() {
  const settings = await getContactSettings()
  const turnstileSiteKey = getEnv().NEXT_PUBLIC_TURNSTILE_SITE_KEY
  return <section className="container-page section-space"><p className="eyebrow">Contact</p><h1 className="display-section">Let’s talk about <span className="text-accent">useful data.</span></h1><p className="section-lede mt-5">For internship opportunities, project questions, or a good data problem to think through.</p><p className="mono-label mt-4 text-muted">{settings.typicalResponseTime || 'Usually replies within 48 hours'}</p><div className="contact-layout"><ContactForm siteKey={turnstileSiteKey} turnstileRequired={Boolean(settings.turnstileEnabled)} />{settings.calendarLink && /^https?:\/\//.test(settings.calendarLink) ? <a className="button button-outline contact-calendar" href={settings.calendarLink} target="_blank" rel="noreferrer">Book a conversation ↗</a> : null}</div></section>
}
