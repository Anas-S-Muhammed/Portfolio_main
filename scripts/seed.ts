/**
 * Seed the database with the owner's real CV content (spec section 13).
 * Nothing here is invented: unknown values stay empty and are flagged in
 * TODO_FOR_OWNER.md. Run with: pnpm seed  (uses `payload run`)
 */
import { getPayload as createPayload } from 'payload'

import config from '../src/payload.config'

const TODO = (label: string) => `TODO_FOR_OWNER: ${label}`

// Awaited IIFE â€” `payload run` awaits the module graph (including this),
// so the seed completes before the process exits. A floating main() promise
// would exit silently before doing any work.
await (async () => {
  const payload = await createPayload({ config })

  // â”€â”€ Idempotency: skip if already seeded â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const existing = await payload.count({ collection: 'projects' })
  if (existing.totalDocs > 0) {
    console.log(`Already seeded (${existing.totalDocs} projects). Nothing to do.`)
    process.exitCode = 0
    return
  }

  console.log('Seeding skill categoriesâ€¦')
  const categories = await Promise.all(
    (
      [
        { title: 'Languages', slug: 'languages', order: 1 },
        { title: 'Data & Analytics', slug: 'data-analytics', order: 2 },
        { title: 'Data Engineering', slug: 'data-engineering', order: 3 },
        { title: 'ML & AI', slug: 'ml-ai', order: 4 },
        { title: 'Tools', slug: 'tools', order: 5 },
        { title: 'Exploring', slug: 'exploring', order: 6 },
      ] as const
    ).map((c) => payload.create({ collection: 'skill-categories', data: { ...c } })),
  )
  const cat = Object.fromEntries(categories.map((c) => [c.slug, c.id as number])) as Record<string, number>

  console.log('Seeding skillsâ€¦')
  const skillDefs: {
    name: string
    category: string
    simpleIconSlug?: string
    exploring?: boolean
    proficiencyNote?: string
    order: number
  }[] = [
    { name: 'Python', category: 'languages', simpleIconSlug: 'python', proficiencyNote: 'daily driver', order: 1 },
    { name: 'SQL', category: 'languages', proficiencyNote: 'daily driver', order: 2 },
    { name: 'Java', category: 'languages', simpleIconSlug: 'openjdk', order: 3 },
    { name: 'TypeScript', category: 'languages', simpleIconSlug: 'typescript', order: 4 },
    { name: 'Pandas', category: 'data-analytics', simpleIconSlug: 'pandas', order: 1 },
    { name: 'NumPy', category: 'data-analytics', simpleIconSlug: 'numpy', order: 2 },
    { name: 'Matplotlib', category: 'data-analytics', simpleIconSlug: 'matplotlib', order: 3 },
    { name: 'Power BI', category: 'data-analytics', order: 4 },
    { name: 'Tableau', category: 'data-analytics', simpleIconSlug: 'tableau', order: 5 },
    { name: 'Excel', category: 'data-analytics', simpleIconSlug: 'microsoftexcel', order: 6 },
    { name: 'PostgreSQL', category: 'data-engineering', simpleIconSlug: 'postgresql', order: 1 },
    { name: 'MySQL', category: 'data-engineering', simpleIconSlug: 'mysql', order: 2 },
    { name: 'Databricks', category: 'data-engineering', simpleIconSlug: 'databricks', order: 3 },
    { name: 'Docker', category: 'data-engineering', simpleIconSlug: 'docker', order: 4 },
    { name: 'Linux', category: 'data-engineering', simpleIconSlug: 'linux', order: 5 },
    { name: 'FastAPI', category: 'data-engineering', simpleIconSlug: 'fastapi', order: 6 },
    { name: 'ETL pipelines', category: 'data-engineering', order: 7 },
    { name: 'scikit-learn', category: 'ml-ai', simpleIconSlug: 'scikitlearn', order: 1 },
    { name: 'PyTorch', category: 'ml-ai', simpleIconSlug: 'pytorch', order: 2 },
    { name: 'XGBoost', category: 'ml-ai', order: 3 },
    { name: 'SHAP', category: 'ml-ai', order: 4, proficiencyNote: 'used in both research projects' },
    { name: 'Jupyter', category: 'ml-ai', simpleIconSlug: 'jupyter', order: 5 },
    { name: 'Git', category: 'tools', simpleIconSlug: 'git', order: 1 },
    { name: 'GitHub', category: 'tools', simpleIconSlug: 'github', order: 2 },
    { name: 'Snowflake', category: 'exploring', simpleIconSlug: 'snowflake', exploring: true, order: 1 },
    { name: 'Apache Airflow', category: 'exploring', simpleIconSlug: 'apacheairflow', exploring: true, order: 2 },
  ]
  const skills = await Promise.all(
    skillDefs.map((s) =>
      payload.create({
        collection: 'skills',
        draft: false,
        data: { ...s, category: cat[s.category]! },
      }),
    ),
  )
  const skill = Object.fromEntries(skills.map((s) => [s.name, s.id as number])) as Record<string, number>

  console.log('Seeding projectsâ€¦')
  await payload.create({
    collection: 'projects',
    data: {
      title: 'Teman',
      slug: 'teman',
      tagline:
        'Safety-gated companion marketplace connecting Malaysian families with vetted student companions for non-medical elderly companionship.',
      statusBadge: 'MMC Upstart 2026 Finalist',
      category: 'full-stack',
      featured: true,
      featuredOrder: 1,
      stack: [skill['TypeScript']!],
      slides: [
        {
          blockType: 'slide-cover',
          heading: 'Teman',
          pitch:
            'A safety-gated marketplace where families find vetted student companions for elderly relatives â€” technology that earns trust before it earns money.',
        },
        {
          blockType: 'slide-problem',
          heading: 'Loneliness is a health problem',
          boldStatement:
            'Malaysian families need safe, trustworthy companionship for elderly relatives â€” and do not know who to trust.',
          supportingText: {
            root: { type: 'root', children: [{ type: 'paragraph', children: [{ mode: 'normal', text: 'Informal arrangements have no vetting, no oversight and no escalation path when something goes wrong. Teman puts safety in front of matchmaking.', format: '', version: 1 }], version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 },
          },
        },
        {
          blockType: 'slide-built',
          heading: 'What I built',
          intro:
            'A companion marketplace with a three-tier safety gate on every message between families and companions.',
          callouts: [
            {
              title: 'Tier 1 â€” Rule-based filters',
              description: 'Keyword and pattern filters catch obvious red flags before anything else runs.',
            },
            {
              title: 'Tier 2 â€” LLM message classifier',
              description: 'A language-model classifier reviews messages that pass the filters for nuanced risk.',
            },
            {
              title: 'Tier 3 â€” Human escalation',
              description: 'Flagged conversations escalate to a human Care Supervisor â€” people decide, software assists.',
            },
          ],
          visuals: [],
        },
        {
          blockType: 'slide-stack-role',
          heading: 'Stack & role',
          notes: TODO('team size, exact timeline and your role on Teman'),
        },
        {
          blockType: 'slide-results',
          heading: 'Results',
          note: TODO('competition outcome details and any product metrics'),
        },
        {
          blockType: 'slide-decisions',
          heading: 'Decision log',
          decisions: [
            {
              chose: 'A three-tier safety gate (filters â†’ LLM classifier â†’ human supervisor)',
              over: 'A single automated moderation pass',
              because:
                'Neither rules nor an LLM alone can be trusted with vulnerable people; layered defense means one failure never becomes the last line.',
            },
          ],
        },
        {
          blockType: 'slide-links',
          heading: 'See it for yourself',
          note: TODO('live demo URL â€” the button appears the moment this is filled in'),
        },
      ],
    },
  })

  await payload.create({
    collection: 'projects',
    data: {
      title: 'Cleveland Heart Disease XAI Benchmark',
      slug: 'cleveland-heart-disease-xai',
      tagline:
        'Benchmarks ML models on the Cleveland heart disease dataset and measures how consistently explainability methods agree across them.',
      category: 'ml-research',
      featured: true,
      featuredOrder: 2,
      stack: [skill['Python']!, skill['scikit-learn']!, skill['XGBoost']!, skill['SHAP']!],
      role: 'Researcher',
      slides: [
        {
          blockType: 'slide-cover',
          heading: 'Cleveland Heart Disease XAI Benchmark',
          pitch:
            'Explainable AI is only trustworthy if explanations are consistent â€” this benchmark measures exactly that across models.',
        },
        {
          blockType: 'slide-problem',
          heading: 'Explanations that disagree are dangerous',
          boldStatement:
            'If SHAP says feature X drove the prediction for one model and contradicts itself on another, which one does a clinician believe?',
          supportingText: {
            root: { type: 'root', children: [{ type: 'paragraph', children: [{ mode: 'normal', text: 'XAI methods are usually validated for plausibility on a single model. This work benchmarks explanation consistency across models on a well-known clinical dataset.', format: '', version: 1 }], version: 1 }], direction: 'ltr', format: '', indent: 0, version: 1 },
          },
        },
        {
          blockType: 'slide-built',
          heading: 'What I built',
          intro:
            'A reproducible pipeline that regenerates every result and the full paper from source â€” one command, same numbers, every time.',
          callouts: [
            {
              title: 'Multi-model benchmark',
              description: 'Classical and boosted models benchmarked on the Cleveland dataset under identical conditions.',
            },
            {
              title: 'Consistency evaluation',
              description: 'SHAP-based explanations compared across models to surface where explainability methods agree â€” and where they quietly diverge.',
            },
            {
              title: 'Reproducible paper',
              description: 'The paper itself is a build artifact of the pipeline: results tables regenerate from source data.',
            },
          ],
          visuals: [],
        },
        {
          blockType: 'slide-stack-role',
          heading: 'Stack & role',
          notes: 'Solo research project under academic supervision.',
        },
        {
          blockType: 'slide-results',
          heading: 'Results',
          note: TODO('status: submitted to the academic advisor â€” add acceptance/news when it exists'),
        },
        {
          blockType: 'slide-links',
          heading: 'Read the work',
          note: TODO('repo URL and paper PDF â€” buttons appear when filled in'),
        },
      ],
    },
  })

  await payload.create({
    collection: 'projects',
    data: {
      title: 'Student Mental Health & Academic Performance',
      slug: 'student-mental-health-analytics',
      tagline:
        'Dual-target classification linking student mental-health indicators to academic performance, with SHAP explanations and bootstrap confidence intervals.',
      category: 'ml-research',
      stack: [skill['Python']!, skill['scikit-learn']!, skill['SHAP']!],
      role: 'Co-author',
      internalNote:
        'PRIVACY RULE: show only aggregate methodology and findings â€” never raw or identifiable survey data. Confirm publication with the co-author and advisor before adding any results.',
      slides: [
        {
          blockType: 'slide-cover',
          heading: 'Student Mental Health & Academic Performance',
          pitch:
            'What actually separates struggling students from thriving ones? A dual-target classification study with explainable outputs.',
        },
        {
          blockType: 'slide-problem',
          heading: 'Wellbeing and grades are linked â€” but how?',
          boldStatement:
            'Universities intervene on intuition; this study replaces intuition with measured, explainable relationships.',
        },
        {
          blockType: 'slide-built',
          heading: 'What I built',
          intro:
            'A full research pipeline from exploratory analysis to a handoff package the co-author can pick up and run.',
          callouts: [
            {
              title: 'Dual-target classification',
              description: 'Two related outcomes modeled side by side, because they inform each other.',
            },
            {
              title: 'Bootstrap confidence intervals',
              description: 'Every headline number ships with an uncertainty interval, not just a point estimate.',
            },
            {
              title: 'SHAP explanations',
              description: 'Findings explained feature-by-feature â€” readable by non-technical faculty.',
            },
          ],
          visuals: [],
        },
        {
          blockType: 'slide-stack-role',
          heading: 'Stack & role',
          notes: TODO('exact collaboration split with the co-author'),
        },
        {
          blockType: 'slide-results',
          heading: 'Results',
          note: 'Held for publication until confirmed with the co-author and advisor.',
        },
      ],
    },
  })

  await payload.create({
    collection: 'projects',
    data: {
      title: 'Customer Revenue & Retention Analytics',
      slug: 'customer-revenue-retention',
      tagline:
        'Cleaned and analyzed transaction data to measure revenue trends and customer retention, surfaced as business-focused insights.',
      category: 'data-analytics',
      stack: [skill['Python']!, skill['SQL']!, skill['Pandas']!],
      slides: [
        {
          blockType: 'slide-cover',
          heading: 'Customer Revenue & Retention Analytics',
          pitch: TODO('one-line pitch â€” refine with the owner'),
        },
        {
          blockType: 'slide-problem',
          heading: 'TODO',
          boldStatement: TODO('the business question this analysis answered'),
        },
        {
          blockType: 'slide-built',
          heading: 'TODO',
          intro: TODO('what was actually built â€” cleaning steps, retention model, visuals'),
          visuals: [],
        },
        {
          blockType: 'slide-results',
          heading: 'TODO',
          note: TODO('metrics and visuals to be supplied by the owner'),
        },
      ],
    },
  })

  await payload.create({
    collection: 'projects',
    data: {
      title: 'End-to-End ETL Pipeline',
      slug: 'etl-pipeline',
      tagline:
        'A structured extract-transform-load workflow automating data cleaning and loading into a relational database.',
      category: 'data-engineering',
      stack: [skill['Python']!, skill['SQL']!, skill['PostgreSQL']!],
      slides: [
        {
          blockType: 'slide-cover',
          heading: 'End-to-End ETL Pipeline',
          pitch: TODO('one-line pitch â€” refine with the owner'),
        },
        {
          blockType: 'slide-architecture',
          heading: 'Architecture',
          diagram: {
            nodes: [
              { id: 'src', label: 'Raw source', icon: 'file', tier: 'source' },
              { id: 'extract', label: 'Extract', icon: 'api', tier: 'transform' },
              { id: 'clean', label: 'Clean & validate', icon: 'gear', tier: 'transform' },
              { id: 'db', label: 'PostgreSQL', icon: 'database', tier: 'store' },
            ],
            edges: [
              { from: 'src', to: 'extract' },
              { from: 'extract', to: 'clean' },
              { from: 'clean', to: 'db' },
            ],
          },
          
        },
        {
          blockType: 'slide-built',
          heading: 'TODO',
          intro: TODO('implementation details, scheduling, error handling'),
          visuals: [],
        },
      ],
    },
  })

  console.log('Seeding certificationsâ€¦')
  const dataCampCerts = [
    ['Introduction to SQL', '2024-06-01'],
    ['Intermediate SQL', '2024-08-01'],
    ['Joining Data in SQL', '2024-10-01'],
    ['Introduction to FastAPI', '2025-02-01'],
    ['Introduction to Deep Learning with PyTorch', '2025-05-01'],
    ['Introduction to GitHub Concepts', '2025-07-01'],
    ['Introduction to AI Agents', '2025-09-01'],
  ] as const
  for (const [i, [title, date]] of dataCampCerts.entries()) {
    await payload.create({
      collection: 'certifications',
      data: {
        title,
        issuer: 'DataCamp',
        // Day is a placeholder â€” the owner corrects exact dates in admin (TODO badge).
        issueDate: date,
        description: TODO('exact completion date and credential URL'),
        order: i + 1,
      },
    })
  }

  console.log('Seeding experienceâ€¦')
  const experiences: {
    role: string
    organization: string
    type: 'work' | 'teaching' | 'leadership' | 'research' | 'volunteering'
    summary?: string
    startDate: string
    endDate?: string
    bullets?: { text: string }[]
    order: number
  }[] = [
    {
      role: 'Teaching Assistant â€” IoT & Software Engineering',
      organization: 'Albukhary International University',
      type: 'teaching',
      startDate: 'Nov 2026',
      endDate: 'Dec 2026',
      bullets: [{ text: 'Supported undergraduate labs and coursework for two courses.' }],
      order: 1,
    },
    {
      role: 'Vice President',
      organization: 'School of Computing and Informatics Committee, AIU',
      type: 'leadership',
      startDate: 'Dec 2025',
      bullets: [
        { text: 'Helped organize SCI Code Quest 2025.' },
        { text: 'Co-ran a tech activity day for school students.' },
      ],
      order: 2,
    },
    {
      role: 'Co-Founder',
      organization: 'TensorOrbit Data Science Club',
      type: 'leadership',
      startDate: '2025',
      bullets: [{ text: 'Runs workshops and events for the data science community.' }],
      order: 3,
    },
    {
      role: 'Head Chair (UNHRC)',
      organization: 'AIU MUN 2026',
      type: 'leadership',
      startDate: '2026',
      bullets: [{ text: 'Chaired the UN Human Rights Council committee.' }],
      order: 4,
    },
    {
      role: 'Media & Creative Team',
      organization: 'AIU Orators Club',
      type: 'leadership',
      startDate: 'Jan 2026',
      order: 5,
    },
    {
      role: 'Vice President II',
      organization: 'Nigerian Students Community',
      type: 'volunteering',
      startDate: 'Apr 2025',
      endDate: 'Apr 2026',
      order: 6,
    },
    {
      role: 'Volunteer',
      organization: 'Malaysian Red Crescent (Kedah)',
      type: 'volunteering',
      startDate: '2025',
      bullets: [
        { text: 'World Blood Donor Day 2025.' },
        { text: 'Domestic Hajj Operations 2025.' },
      ],
      order: 7,
    },
    {
      role: 'Canva digital design session lead',
      organization: 'Kedah school',
      type: 'teaching',
      startDate: 'Aug 2025',
      bullets: [{ text: 'Taught a digital design session to 17 students.' }],
      order: 8,
    },
  ]
  for (const e of experiences) {
    await payload.create({ collection: 'experiences', data: e })
  }

  console.log('Seeding awardsâ€¦')
  const awards = [
    {
      title: 'Finalist',
      event: 'MMC Upstart 2026',
      category: 'Entrepreneurship',
      year: 2026,
      description: 'Selected as a finalist with Teman.',
      order: 1,
    },
    {
      title: 'Most Outstanding Delegate',
      event: 'IPMA MUN 2025',
      category: 'Diplomacy',
      year: 2025,
      description: 'UNHRC, representing Japan.',
      order: 2,
    },
    {
      title: 'Head of Government (Myanmar)',
      event: 'AIU Model ASEAN Meeting 2025',
      category: 'Diplomacy',
      year: 2025,
      order: 3,
    },
  ]
  for (const a of awards) {
    await payload.create({ collection: 'awards', data: a })
  }

  console.log('Seeding beyond-the-codeâ€¦')
  const beyond: { type: 'mun' | 'volunteering' | 'teaching' | 'book' | 'hobby' | 'other'; title: string; description: string; order: number }[] = [
    {
      type: 'mun',
      title: 'Model United Nations',
      description:
        'Chaired UNHRC at AIU MUN 2026, represented Japan at IPMA MUN 2025 (Most Outstanding Delegate), and led Myanmar as Head of Government at AIU Model ASEAN 2025.',
      order: 1,
    },
    {
      type: 'volunteering',
      title: 'Malaysian Red Crescent',
      description:
        'Volunteered at World Blood Donor Day 2025 and Domestic Hajj Operations 2025 with the Kedah chapter.',
      order: 2,
    },
    {
      type: 'teaching',
      title: 'Design teaching',
      description: 'Led a Canva digital design session for 17 students at a school in Kedah.',
      order: 3,
    },
  ]
  for (const b of beyond) {
    await payload.create({ collection: 'beyond-items', data: b })
  }

  console.log('Seeding site settingsâ€¦')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      name: 'Anas Muhammed',
      roleWords: ['Data Engineer', 'Data Analyst', 'ML Builder'],
      valueStatement:
        'I build data pipelines, SQL models and applied ML â€” and I make the results explainable.',
      availability: { enabled: true, label: 'Open to internships', dates: '2027' },
      hero: { mode: 'illustration', badgeText: 'DATA Â· PIPELINES Â· ML Â· SQL Â· ' },
      heroButtons: [
        { label: 'View my work', href: '/#projects', kind: 'primary' },
        { label: 'Download CV', href: '/cv', kind: 'outline' },
        { label: 'Contact', href: '/#contact', kind: 'ink' },
      ],
      socials: [
        { platform: 'github', url: TODO('GitHub profile URL'), label: 'GitHub' },
        { platform: 'linkedin', url: TODO('LinkedIn profile URL'), label: 'LinkedIn' },
        { platform: 'email', url: TODO('contact email â€” mailto:'), label: 'Email' },
      ],
      facts: {
        location: 'Alor Setar, Kedah, Malaysia',
        university: 'Albukhary International University',
        degree: 'BSc Computer Science',
        expectedGraduation: '2027',
        languages: ['English', 'Arabic'],
        cgpa: { value: '3.69', show: true },
        targetRole: 'Data Engineering / Data Analyst internships',
      },
      aboutIntro:
        'I am a Computer Science student at Albukhary International University who likes the unglamorous parts of data work: cleaning the mess, modeling it properly, and being able to explain every number that comes out the other side.',
      traitChips: ['Pipeline-minded', 'Explainable by default', 'Ships reproducibly', 'Teaches what he learns'],
      stats: [
        { label: 'GitHub contributions, past year', value: 681, caption: 'and counting', inverted: false },
        { label: 'Projects shipped', value: 5, caption: 'research, analytics, full-stack', inverted: true },
        { label: 'Students taught', value: 17, caption: 'Canva design session, Kedah', inverted: false },
        { label: 'Certifications earned', value: 7, caption: 'DataCamp', inverted: false },
      ],
      githubUsername: TODO('GitHub username for the activity heatmap'),
    },
  })

  await payload.updateGlobal({
    slug: 'now-entries',
    data: {
      entries: [
        { kind: 'building', text: 'Cleveland Heart Disease XAI benchmark paper â€” with my academic advisor', date: 'Nov 2026' },
        { kind: 'learning', text: 'Databricks and Apache Airflow', date: 'Nov 2026' },
        { kind: 'looking', text: 'A Data Engineering or Data Analyst internship', date: 'Nov 2026' },
      ],
    },
  })

  console.log('âœ” Seed complete.')
  process.exitCode = 0
})()


