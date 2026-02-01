import { Section, Container } from '@/components/layout'
import {
  PageHeader,
  ContactInfo,
  ContactForm,
  SupportSection,
} from '@/components/sections'
import styles from './page.module.css'

/**
 * Contact Page - CIE Enghien Public Website
 * Story 4.3: Create Contact Page with Form
 *
 * Implements FR33 (contact form), FR34 (webhook), FR35 (confirmation)
 * ISR with 60s revalidation
 */

// ISR Configuration - Revalidate every 60 seconds
export const revalidate = 60

// SEO Metadata
export const metadata = {
  title: 'Contact - CIE Enghien',
  description:
    "Contactez le CIE d'Enghien pour vos questions sur nos animations, stages et formations. Nous sommes à votre écoute.",
  openGraph: {
    title: 'Contact - CIE Enghien',
    description:
      "Contactez le CIE d'Enghien pour vos questions sur nos animations, stages et formations.",
    type: 'website',
    locale: 'fr_BE',
  },
}

export default function ContactPage() {
  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="Contact"
        subtitle="Restons en contact, nous sommes à votre écoute."
      />

      {/* Main Contact Section */}
      <Section>
        <Container>
          <div className={styles.contactGrid}>
            {/* Contact Info */}
            <ContactInfo />

            {/* Contact Form */}
            <ContactForm />
          </div>
        </Container>
      </Section>

      {/* Support Section */}
      <SupportSection />
    </>
  )
}
