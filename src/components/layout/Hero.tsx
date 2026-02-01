import Link from 'next/link'
import { Button } from '@/components/ui'
import styles from './Hero.module.css'

interface CtaButton {
  label: string
  href: string
  variant: 'primary' | 'outline'
}

interface HeroProps {
  variant?: 'full' | 'page'
  backgroundImage: string
  title: string
  subtitle?: string
  children?: React.ReactNode
  ctaButtons?: CtaButton[]
}

/**
 * Hero Component - Full-screen or page header hero section
 * Story 1.5: Create Layout Components
 * Updated Story 4.1: Added ctaButtons prop for homepage
 * Source: cie4/style.css:302-329
 */
export function Hero({
  variant = 'full',
  backgroundImage,
  title,
  subtitle,
  children,
  ctaButtons,
}: HeroProps) {
  const heroClasses = [
    styles.hero,
    variant === 'page' ? styles.pageHeader : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={heroClasses} aria-label={title}>
      <div
        className={styles.heroBg}
        style={{ backgroundImage: `url(${backgroundImage})` }}
        role="img"
        aria-hidden="true"
      />
      <div className={styles.heroContent}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {ctaButtons && ctaButtons.length > 0 && (
          <div className={styles.heroActions}>
            {ctaButtons.map((btn) => (
              <Link key={btn.href} href={btn.href}>
                <Button
                  variant={btn.variant}
                  className={btn.variant === 'outline' ? styles.outlineWhite : undefined}
                >
                  {btn.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
        {children && <div className={styles.heroActions}>{children}</div>}
      </div>
    </section>
  )
}
