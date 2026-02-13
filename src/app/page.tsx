import { Hero, StatsBar } from '@/components/layout'
import { ScrollReveal } from '@/components/ui'
import {
  Presentation,
  AgendaPreview,
  ActivitiesGrid,
  ContactSection,
} from '@/components/sections'

/**
 * Homepage - CIE Enghien Public Website
 * Story 4.1: Create Homepage
 *
 * Implements FR46 (design matches cie4), FR55 (StatsBar)
 * ISR with 60s revalidation (AC5)
 */

// ISR Configuration - Revalidate every 60 seconds
export const revalidate = 60

// SEO Metadata
export const metadata = {
  title: "CIE Enghien - Centre d'Initiation à l'Environnement",
  description:
    "Au cœur du Parc d'Enghien, découvrez, apprenez et émerveillez-vous devant la biodiversité qui nous entoure. Animations scolaires, stages vacances et formations adultes.",
  openGraph: {
    title: "CIE Enghien - Centre d'Initiation à l'Environnement",
    description:
      "Au cœur du Parc d'Enghien, découvrez, apprenez et émerveillez-vous devant la biodiversité qui nous entoure.",
    type: 'website',
    locale: 'fr_BE',
  },
}

// Stats matching cie4/index.html (FR55)
const stats = [
  { value: '+20 ans', label: "d'Expérience" },
  { value: '3000+', label: 'Participants / an' },
  { value: '100%', label: 'Passion Nature' },
]

export default async function HomePage() {
  // TODO: Fetch upcoming events from database for AgendaPreview
  // const events = await getUpcomingEvents(3)

  return (
    <>
      {/* Hero Section - AC2 */}
      <Hero
        variant="full"
        backgroundImage="https://cieenghien.be/wp-content/uploads/2021/06/Image3bb.jpg"
        title="Reconnecter l'humain à la nature"
        subtitle="Au cœur du Parc d'Enghien, découvrez, apprenez et émerveillez-vous devant la biodiversité qui nous entoure."
        ctaButtons={[
          { label: "Voir l'agenda", href: '/agenda', variant: 'primary' },
          { label: 'En savoir plus', href: '#presentation', variant: 'outline' },
        ]}
      />

      {/* StatsBar - AC3 (FR55) */}
      <ScrollReveal>
        <StatsBar stats={stats} />
      </ScrollReveal>

      {/* Presentation Section - AC4 */}
      <Presentation />

      {/* Agenda Preview - AC4 */}
      <AgendaPreview />

      {/* Activities Grid - AC4 */}
      <ActivitiesGrid />

      {/* Contact Section - AC4 */}
      <ContactSection />
    </>
  )
}
