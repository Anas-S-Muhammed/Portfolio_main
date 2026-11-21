import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return { name: 'Anas Muhammed — Data Engineering & Analytics', short_name: 'Anas Muhammed', description: 'Portfolio of Anas Muhammed, Computer Science student focused on data engineering and analytics.', start_url: '/', display: 'standalone', background_color: '#f4f1ec', theme_color: '#f4f1ec', icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }] }
}
