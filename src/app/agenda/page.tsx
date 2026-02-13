import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Section, Container } from '@/components/layout'
import { PageHeader } from '@/components/sections'
import styles from './page.module.css'

/**
 * Agenda Page
 * Story 6.2: Build Agenda Public Page
 *
 * Design from cie4/agenda.html prototype
 */

// SEO Metadata
export const metadata = {
  title: 'Agenda - CIE Enghien',
  description:
    "Consultez notre agenda des activités, formations et stages à venir au CIE d'Enghien.",
  openGraph: {
    title: 'Agenda - CIE Enghien',
    description: 'Agenda des activités et événements.',
    type: 'website',
    locale: 'fr_BE',
  },
}

// Month names in French
const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

const MONTH_ABBR = [
  'Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin',
  'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'
]

// Filter options
const FILTERS = [
  { value: '', label: 'Tout voir' },
  { value: 'formation', label: 'Formations' },
  { value: 'stage', label: 'Stages' },
  { value: 'animation', label: 'Animations' },
]

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AgendaPage({ searchParams }: PageProps) {
  const params = await searchParams

  // Get filter and month/year from params
  const filter = typeof params.type === 'string' ? params.type : ''
  const now = new Date()
  const currentYear = now.getFullYear()

  // Fetch upcoming events (next 6 months)
  const startDate = new Date(currentYear, now.getMonth(), 1)
  const endDate = new Date(currentYear, now.getMonth() + 6, 0, 23, 59, 59)

  const events = await prisma.agendaEvent.findMany({
    where: {
      published: true,
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(filter && { sourceType: filter }),
    },
    include: {
      tags: true,
    },
    orderBy: { date: 'asc' },
  })

  // Group events by month
  const eventsByMonth: Record<string, typeof events> = {}
  for (const event of events) {
    const monthKey = `${event.date.getFullYear()}-${event.date.getMonth()}`
    if (!eventsByMonth[monthKey]) {
      eventsByMonth[monthKey] = []
    }
    eventsByMonth[monthKey].push(event)
  }

  // Format time
  const formatTime = (date: Date, endDate?: Date | null) => {
    const start = date.toLocaleTimeString('fr-BE', {
      hour: '2-digit',
      minute: '2-digit',
    })
    if (endDate) {
      const end = endDate.toLocaleTimeString('fr-BE', {
        hour: '2-digit',
        minute: '2-digit',
      })
      return `${start} - ${end}`
    }
    return start
  }

  // Get source link
  const getSourceLink = (sourceType: string | null, sourceId: string | null): string | null => {
    if (!sourceId || !sourceType) return null
    switch (sourceType) {
      case 'formation': return `/formations/${sourceId}`
      case 'stage': return `/stages/${sourceId}`
      case 'animation': return `/animations/${sourceId}`
      default: return null
    }
  }

  return (
    <>
      <PageHeader
        title={`Agenda ${currentYear}`}
        subtitle="Retrouvez toutes nos activités nature, stages et formations."
      />

      <Section className={styles.agendaSection}>
        <Container>
          {/* Filters */}
          <div className={styles.filters}>
            {FILTERS.map((f) => (
              <Link
                key={f.value}
                href={f.value ? `/agenda?type=${f.value}` : '/agenda'}
                className={`${styles.filterBtn} ${filter === f.value ? styles.active : ''}`}
              >
                {f.label}
              </Link>
            ))}
          </div>

          {/* Events List */}
          {events.length > 0 ? (
            <div className={styles.agendaList}>
              {Object.entries(eventsByMonth)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([monthKey, monthEvents]) => {
                  const [year, month] = monthKey.split('-').map(Number)

                  return (
                    <div key={monthKey}>
                      {/* Month Heading */}
                      <div className={styles.monthHeadingWrapper}>
                        <h3 className={styles.monthHeading}>
                          {MONTH_NAMES[month]} {year}
                        </h3>
                      </div>

                      {/* Events for this month */}
                      {monthEvents.map((event) => {
                        const link = getSourceLink(event.sourceType, event.sourceId)
                        const day = event.date.getDate()
                        const monthAbbr = MONTH_ABBR[event.date.getMonth()]

                        return (
                          <article key={event.id} className={styles.agendaItem}>
                            <div className={styles.dateBox}>
                              <span className={styles.day}>{day}</span>
                              <span className={styles.month}>{monthAbbr}</span>
                            </div>

                            <div className={styles.eventInfo}>
                              <h3>{event.titre}</h3>
                              <p>
                                <span className={styles.time}>
                                  {formatTime(event.date, event.dateFin)}
                                </span>
                                {event.lieu && (
                                  <span className={styles.location}>
                                    {event.lieu}
                                  </span>
                                )}
                              </p>
                              {event.tags.length > 0 && (
                                <span className={styles.eventTag}>
                                  {event.tags[0].nom}
                                </span>
                              )}
                            </div>

                            {link ? (
                              <Link href={link} className={styles.btnOutline}>
                                S&apos;inscrire
                              </Link>
                            ) : (
                              <span className={styles.btnOutline}>
                                Détails
                              </span>
                            )}
                          </article>
                        )
                      })}
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Aucun événement prévu prochainement.</p>
              <p>Revenez bientôt pour découvrir nos prochaines activités.</p>
            </div>
          )}

          {/* Pagination placeholder */}
          <div className={styles.pagination}>
            <span className={`${styles.btnOutline} ${styles.disabled}`}>
              &larr; Précédent
            </span>
            <Link href="/agenda" className={styles.btnOutline}>
              Suivant &rarr;
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
