import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  subtitle?: string
}

/**
 * Page Header Component - Smaller hero for subpages
 * Story 4.2: Create About Page (Task 2)
 * Source: cie4/cie.html lines 42-48
 */
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className={styles.pageHeader}>
      <div className={styles.content}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  )
}
