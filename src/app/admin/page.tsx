import { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

export const metadata: Metadata = {
  title: 'Admin Dashboard | CIE Enghien',
  description: 'Espace d\'administration CIE Enghien',
}

/**
 * Admin Dashboard Page (Placeholder)
 * Story 2.4: Placeholder admin page for login redirect
 *
 * This page serves as the landing page after successful authentication.
 * Full admin functionality will be implemented in Epic 3 (Content Management).
 *
 * Protected by middleware (Story 2.3) - requires valid JWT cookie.
 */
export default function AdminPage() {
  return (
    <Container>
      <Section>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
            Bienvenue dans l'espace d'administration CIE Enghien
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            Fonctionnalités d'administration à venir dans Epic 3...
          </p>
        </div>
      </Section>
    </Container>
  )
}
