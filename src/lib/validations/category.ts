import { z } from 'zod'

/**
 * Validation schemas for Category API
 * Story 3.5: Build Category and Tag Management API
 *
 * Covers:
 * - FR5: Animation categories
 * - FR6: Formation categories
 * - FR7: Stage categories
 */

// Category types enum
const CATEGORY_TYPES = ['animation', 'formation', 'stage'] as const

/**
 * Schema for creating a category
 * Unique constraint: nom + type
 */
export const categoryCreateSchema = z.object({
  nom: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  type: z.enum(CATEGORY_TYPES, 'Type invalide (animation, formation, stage)')
})

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>

/**
 * Schema for updating a category
 * Type cannot be changed after creation
 */
export const categoryUpdateSchema = z.object({
  nom: z.string().min(2).max(50).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un champ doit être fourni pour la mise à jour'
})

export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>

/**
 * Schema for querying categories
 * Filter by type optional
 */
export const categoryQuerySchema = z.object({
  type: z.enum(CATEGORY_TYPES).optional()
})

export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>

/**
 * Export category types for reuse
 */
export { CATEGORY_TYPES }
