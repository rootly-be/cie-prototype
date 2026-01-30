import { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Connexion Admin | CIE Enghien',
  description: 'Connexion à l\'espace d\'administration',
}

/**
 * Login Page (Server Component)
 * Story 2.4: Build Admin Login Page
 *
 * AC1: Display login form at /login
 * This is a Server Component that renders the client-side LoginForm.
 * Metadata is optimized for admin access (not public SEO).
 */
export default function LoginPage() {
  return (
    <Container>
      <Section>
        <LoginForm />
      </Section>
    </Container>
  )
}
