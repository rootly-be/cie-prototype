import Link from 'next/link'
import { Section, Container } from '@/components/layout'
import { Button } from '@/components/ui'
import styles from './CallToAction.module.css'

interface CtaButton {
  label: string
  href: string
  variant: 'primary' | 'outline'
}

interface CallToActionProps {
  title: string
  description?: string
  buttons: CtaButton[]
}

/**
 * Call To Action Section - Reusable CTA section
 * Story 4.2: Create About Page (Task 6)
 * Source: cie4/cie.html lines 157-167
 */
export function CallToAction({ title, description, buttons }: CallToActionProps) {
  return (
    <Section bgLight>
      <Container>
        <div className={styles.ctaBox}>
          <h2>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
          <div className={styles.buttonGroup}>
            {buttons.map((btn) => (
              <Link key={btn.href} href={btn.href}>
                <Button variant={btn.variant}>{btn.label}</Button>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
