/**
 * SkipLink Component
 * Story 4.4: Implement Skip-Link and Keyboard Navigation (Task 1)
 *
 * Provides a skip-link for keyboard users to bypass navigation
 * and jump directly to main content (FR42, NFR21)
 */

import styles from './SkipLink.module.css'

export function SkipLink() {
  return (
    <a href="#main-content" className={styles.skipLink}>
      Aller au contenu principal
    </a>
  )
}
