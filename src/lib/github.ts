import { getEnv } from '@/lib/env'

export type GitHubActivity = {
  days: { date: string; count: number; color: string }[]
  events: { repo: string; type: string; date: string; url: string }[]
}
type ContributionDay = { date?: string; contributionCount?: number; color?: string }
type GitHubQueryResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: { weeks?: { contributionDays?: ContributionDay[] }[] }
      }
    }
  }
}

export async function getGitHubActivity(username: string): Promise<GitHubActivity> {
  const empty: GitHubActivity = { days: [], events: [] }
  const safeUsername = username.trim()
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(safeUsername)) return empty
  const env = getEnv()
  const headers: Record<string, string> = { accept: 'application/vnd.github+json' }
  if (env.GITHUB_TOKEN) headers.authorization = `Bearer ${env.GITHUB_TOKEN}`
  try {
    const eventsRequest = fetch(`https://api.github.com/users/${safeUsername}/events/public?per_page=5`, { headers, next: { revalidate: 3600 } })
    const graphRequest = env.GITHUB_TOKEN ? fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({ query: 'query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{weeks{contributionDays{date contributionCount color}}}}}}', variables: { login: safeUsername } }),
      next: { revalidate: 3600 },
    }) : Promise.resolve(null)
    const [eventsResponse, graphResponse] = await Promise.all([eventsRequest, graphRequest])
    const rawEvents = eventsResponse.ok ? await eventsResponse.json() as { type?: string; repo?: { name?: string }; created_at?: string }[] : []
    let days: GitHubActivity['days'] = []
    if (graphResponse?.ok) {
      const data = await graphResponse.json() as GitHubQueryResponse
      days = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks?.flatMap((week) => week.contributionDays || []).flatMap((day) => day.date ? [{ date: day.date, count: day.contributionCount || 0, color: day.color || '#e5e7eb' }] : []) || []
    }
    return {
      days,
      events: rawEvents.filter((event) => event.repo?.name).slice(0, 5).map((event) => ({ repo: event.repo!.name!, type: event.type || 'Activity', date: event.created_at || '', url: `https://github.com/${encodeURIComponent(safeUsername)}/${event.repo!.name!.split('/').map(encodeURIComponent).join('/')}` })),
    }
  } catch {
    return empty
  }
}
