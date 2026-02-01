'use client'

/**
 * FilterBar Component
 * Story 5.5: Create Reusable FilterBar Component
 *
 * Reusable filter component for list pages with URL parameter integration.
 * Supports select dropdowns and chip-based filters.
 */

import { useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import styles from './FilterBar.module.css'

// =========================================
// Type Definitions
// =========================================

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  id: string
  label: string
  type: 'select' | 'chips'
  options: FilterOption[]
  allLabel?: string
}

interface FilterBarProps {
  filters: FilterConfig[]
  className?: string
}

// =========================================
// Main Component
// =========================================

export function FilterBar({ filters, className }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Update URL with new filter value
  const updateFilter = useCallback(
    (filterId: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === '' || value === 'all') {
        params.delete(filterId)
      } else {
        params.set(filterId, value)
      }

      const queryString = params.toString()
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname

      router.push(newUrl, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  // Get current value for a filter from URL
  const getCurrentValue = useCallback(
    (filterId: string): string => {
      return searchParams.get(filterId) || ''
    },
    [searchParams]
  )

  const containerClasses = [styles.filterBar, className || ''].filter(Boolean).join(' ')

  return (
    <div className={containerClasses} role="group" aria-label="Filtres">
      {filters.map((filter) => (
        <div key={filter.id} className={styles.filterGroup}>
          <label className={styles.filterLabel} id={`filter-label-${filter.id}`}>
            {filter.label}
          </label>

          {filter.type === 'select' ? (
            <FilterSelect
              filter={filter}
              value={getCurrentValue(filter.id)}
              onChange={(value) => updateFilter(filter.id, value)}
            />
          ) : (
            <FilterChips
              filter={filter}
              value={getCurrentValue(filter.id)}
              onChange={(value) => updateFilter(filter.id, value)}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// =========================================
// Filter Select Component
// =========================================

interface FilterSelectProps {
  filter: FilterConfig
  value: string
  onChange: (value: string) => void
}

function FilterSelect({ filter, value, onChange }: FilterSelectProps) {
  const allLabel = filter.allLabel || 'Tous'

  return (
    <select
      className={styles.filterSelect}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-labelledby={`filter-label-${filter.id}`}
    >
      <option value="">{allLabel}</option>
      {filter.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

// =========================================
// Filter Chips Component
// =========================================

interface FilterChipsProps {
  filter: FilterConfig
  value: string
  onChange: (value: string) => void
}

function FilterChips({ filter, value, onChange }: FilterChipsProps) {
  const allLabel = filter.allLabel || 'Tous'

  return (
    <div
      className={styles.chipGroup}
      role="radiogroup"
      aria-labelledby={`filter-label-${filter.id}`}
    >
      {/* All option */}
      <button
        type="button"
        className={`${styles.chip} ${value === '' ? styles.chipActive : ''}`}
        onClick={() => onChange('')}
        role="radio"
        aria-checked={value === ''}
      >
        {allLabel}
      </button>

      {/* Filter options */}
      {filter.options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.chip} ${value === option.value ? styles.chipActive : ''}`}
          onClick={() => onChange(option.value)}
          role="radio"
          aria-checked={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
