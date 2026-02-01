/**
 * School levels (niveaux) constants
 * Shared across admin pages for animations
 * Story 3.7: Build Admin Content Pages
 */

// Simple array for filters
export const NIVEAUX = ['M1', 'M2/M3', 'P1-P2', 'P3-P4', 'P5-P6', 'S1-S3', 'S4-S6'] as const

// Options array for select dropdowns
export const NIVEAUX_OPTIONS = [
  { value: 'M1', label: 'Maternelle 1' },
  { value: 'M2/M3', label: 'Maternelle 2-3' },
  { value: 'P1-P2', label: 'Primaire 1-2' },
  { value: 'P3-P4', label: 'Primaire 3-4' },
  { value: 'P5-P6', label: 'Primaire 5-6' },
  { value: 'S1-S3', label: 'Secondaire 1-3' },
  { value: 'S4-S6', label: 'Secondaire 4-6' },
] as const

export type Niveau = typeof NIVEAUX[number]
