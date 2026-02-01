import Link from 'next/link'
import styles from './Button.module.css'

/**
 * RegistrationLink Component
 * Story 7.3: Add Registration Links to Content
 *
 * Covers:
 * - FR20: Visitor can click registration link to Billetweb
 * - Opens in new tab
 * - Styled as primary button
 * - Accessible with aria-label
 */

/**
 * Validates that a URL is safe to use as an external link
 * Must be HTTPS and from a trusted domain
 */
function isValidExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    // Only allow HTTPS URLs from Billetweb domain
    return parsed.protocol === 'https:' &&
           (parsed.hostname.endsWith('billetweb.fr') ||
            parsed.hostname.endsWith('billetweb.com'))
  } catch {
    return false
  }
}

interface RegistrationLinkProps {
  /** Billetweb registration URL */
  billetwebUrl: string | null | undefined
  /** Whether the activity is full (no more places) */
  isFull?: boolean
  /** Activity title for accessibility */
  activityTitle: string
  /** Activity type for context */
  activityType: 'formation' | 'stage'
  /** Custom label text */
  label?: string
  /** Additional CSS class */
  className?: string
}

export function RegistrationLink({
  billetwebUrl,
  isFull = false,
  activityTitle,
  activityType,
  label,
  className,
}: RegistrationLinkProps) {
  const buttonClasses = [styles.btn, styles.btnPrimary, className || '']
    .filter(Boolean)
    .join(' ')

  // If full, show disabled state with proper accessibility
  if (isFull) {
    return (
      <span
        role="button"
        aria-disabled="true"
        className={`${buttonClasses} ${styles.btnDisabled}`}
        aria-label={`Inscriptions complètes pour ${activityTitle}`}
      >
        Complet
      </span>
    )
  }

  // If has valid Billetweb URL, show registration link
  if (billetwebUrl && isValidExternalUrl(billetwebUrl)) {
    const typeLabel = activityType === 'formation' ? 'la formation' : 'le stage'
    return (
      <a
        href={billetwebUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        aria-label={`S'inscrire à ${typeLabel} ${activityTitle} (ouvre Billetweb dans un nouvel onglet)`}
      >
        {label || "S'inscrire"}
      </a>
    )
  }

  // No URL yet, show contact link
  return (
    <Link
      href="/contact"
      className={buttonClasses}
      aria-label={`Contacter le CIE pour plus d'informations sur ${activityTitle}`}
    >
      {label || 'Nous contacter'}
    </Link>
  )
}
