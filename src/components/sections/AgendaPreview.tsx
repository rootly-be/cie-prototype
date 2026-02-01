import Image from 'next/image'
import Link from 'next/link'
import { Section, Container } from '@/components/layout'
import { ScrollReveal, Button } from '@/components/ui'
import styles from './AgendaPreview.module.css'

// Sample events for initial render (will be replaced with DB data)
const sampleEvents = [
  {
    id: '1',
    titre: 'Balade Ornithologique',
    date: new Date('2026-07-12T09:00:00'),
    dateFin: new Date('2026-07-12T12:00:00'),
    lieu: "Parc d'Enghien",
  },
  {
    id: '2',
    titre: 'Atelier "Zéro Déchet"',
    date: new Date('2026-07-18T14:00:00'),
    dateFin: new Date('2026-07-18T17:00:00'),
    lieu: 'Pavillon CIE',
  },
  {
    id: '3',
    titre: 'Nuit des Chauves-souris',
    date: new Date('2026-08-25T20:00:00'),
    dateFin: new Date('2026-08-25T23:00:00'),
    lieu: "Parc d'Enghien",
  },
]

interface AgendaEvent {
  id: string
  titre: string
  date: Date
  dateFin?: Date | null
  lieu?: string | null
}

interface AgendaPreviewProps {
  events?: AgendaEvent[]
}

/**
 * Agenda Preview Section - Shows next 3 events
 * Story 4.1: Create Homepage (Task 5)
 * Source: cie4/index.html lines 114-167
 */
export function AgendaPreview({ events = sampleEvents }: AgendaPreviewProps) {
  // Format helpers - date parsing done once per event below
  const formatDay = (date: Date) => date.getDate().toString()
  const formatMonth = (date: Date) =>
    date.toLocaleDateString('fr-BE', { month: 'short' })
  const formatTime = (date: Date) =>
    date.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })

  // Pre-process events to avoid repeated Date object creation
  const processedEvents = events.map((event) => {
    const startDate = new Date(event.date)
    const endDate = event.dateFin ? new Date(event.dateFin) : null
    return {
      ...event,
      startDate,
      endDate,
      dayStr: formatDay(startDate),
      monthStr: formatMonth(startDate),
      startTimeStr: formatTime(startDate),
      endTimeStr: endDate ? formatTime(endDate) : null,
    }
  })

  return (
    <Section bgLight>
      <Container>
        <ScrollReveal>
          <div className={styles.sectionHeader}>
            <h2>L&apos;Agenda du CIE</h2>
            <p>Nos prochaines balades, ateliers et événements.</p>
          </div>
        </ScrollReveal>

        <div className={styles.agendaList}>
          {processedEvents.map((event, index) => (
            <article key={event.id} className={styles.agendaItem}>
              <div
                className={styles.dateBox}
                style={index === 2 ? { backgroundColor: 'var(--L-ecorce-dark)' } : undefined}
              >
                <span className={styles.day}>{event.dayStr}</span>
                <span className={styles.month}>{event.monthStr}</span>
              </div>
              <div className={styles.eventInfo}>
                <h3>{event.titre}</h3>
                <p>
                  <span className={styles.eventMeta}>
                    <Image src="/icons/clock.svg" alt="" width={16} height={16} />
                    {event.startTimeStr}
                    {event.endTimeStr && ` - ${event.endTimeStr}`}
                  </span>
                  {event.lieu && (
                    <span className={styles.eventMeta}>
                      <Image src="/icons/map-pin.svg" alt="" width={16} height={16} />
                      {event.lieu}
                    </span>
                  )}
                </p>
              </div>
              <Button variant="outline" className={styles.inscriptionBtn}>
                S&apos;inscrire
              </Button>
            </article>
          ))}
        </div>

        <div className={styles.viewAllLink}>
          <Link href="/agenda">Voir tout l&apos;agenda &rarr;</Link>
        </div>
      </Container>
    </Section>
  )
}
