'use client'

import { useState } from 'react'
import styles from './admin-components.module.css'

interface StatusToggleProps {
  id: string
  initialValue: boolean
  onToggle: (id: string, newValue: boolean) => Promise<void>
  disabled?: boolean
}

/**
 * StatusToggle Component
 * Story 3.7: FR12 - Publish/unpublish toggle
 *
 * Allows quick toggle of published status directly from list views.
 * Uses optimistic update with rollback on error.
 */
export function StatusToggle({
  id,
  initialValue,
  onToggle,
  disabled = false,
}: StatusToggleProps) {
  const [isActive, setIsActive] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleToggle = async () => {
    if (disabled || isLoading) return

    const previousValue = isActive
    const newValue = !isActive

    setIsLoading(true)
    setHasError(false)
    // Optimistic update
    setIsActive(newValue)

    try {
      await onToggle(id, newValue)
      // Success - keep new value
    } catch (error) {
      console.error('Toggle failed:', error)
      // Rollback on error
      setIsActive(previousValue)
      setHasError(true)
      // Clear error state after 3 seconds
      setTimeout(() => setHasError(false), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      aria-busy={isLoading}
      aria-label={isActive ? 'Dépublier' : 'Publier'}
      aria-invalid={hasError}
      className={`${styles.toggle} ${isActive ? styles.toggleActive : ''} ${isLoading ? styles.toggleLoading : ''} ${hasError ? styles.toggleError : ''}`}
      onClick={handleToggle}
      disabled={disabled || isLoading}
    >
      <span className={styles.toggleThumb} />
    </button>
  )
}
