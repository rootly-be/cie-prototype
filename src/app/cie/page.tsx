import {
  PageHeader,
  AboutMission,
  TeamSection,
  ParkSection,
  CallToAction,
} from '@/components/sections'

/**
 * About Page (Le CIE) - CIE Enghien Public Website
 * Story 4.2: Create About Page
 *
 * Implements FR46 (design matches cie4/cie.html)
 * ISR with 60s revalidation
 */

// ISR Configuration - Revalidate every 60 seconds
export const revalidate = 60

// SEO Metadata
export const metadata = {
  title: "Le CIE d'Enghien - Centre d'Initiation à l'Environnement",
  description:
    "Découvrez le CIE d'Enghien, son équipe passionnée et le magnifique Parc d'Enghien, classé au Patrimoine Majeur de Wallonie.",
  openGraph: {
    title: "Le CIE d'Enghien - Centre d'Initiation à l'Environnement",
    description:
      "Découvrez le CIE d'Enghien, son équipe passionnée et le magnifique Parc d'Enghien.",
    type: 'website',
    locale: 'fr_BE',
  },
}

export default function AboutPage() {
  return (
    <>
      {/* Page Header - AC2 */}
      <PageHeader
        title="Le CIE d'Enghien"
        subtitle="Centre d'Initiation à l'Environnement"
      />

      {/* Mission Section - AC3 */}
      <AboutMission />

      {/* Team Section - AC4 */}
      <TeamSection />

      {/* Park Section - AC5 */}
      <ParkSection />

      {/* Call To Action - AC6 */}
      <CallToAction
        title="Envie de nous rejoindre ?"
        description="Découvrez nos animations, nos stages et nos formations pour tous les âges."
        buttons={[
          { label: 'Voir les animations', href: '/animations', variant: 'primary' },
          { label: 'Nous contacter', href: '/contact', variant: 'outline' },
        ]}
      />
    </>
  )
}
