import { z } from 'zod'

/**
 * Validation schemas for Tag API
 * Story 3.5: Build Category and Tag Management API
 *
 * Covers:
 * - FR8: Agenda tags with color
 * - FR9: Cross-entity tag management
 */

// Hex color validation (optional)
const hexColorRegex = /^#[0-9A-Fa-f]{6}$/

/**
 * Schema for creating a tag
 * Unique constraint: nom
 */
export const tagCreateSchema = z.object({
  nom: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  couleur: z.string()
    .regex(hexColorRegex, 'Couleur doit être au format hex (#RRGGBB)')
    .optional()
})

export type TagCreateInput = z.infer<typeof tagCreateSchema>

/**
 * Schema for updating a tag
 */
export const tagUpdateSchema = z.object({
  nom: z.string().min(2).max(50).optional(),
  couleur: z.string().regex(hexColorRegex, 'Couleur doit être au format hex (#RRGGBB)').optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un champ doit être fourni pour la mise à jour'
})

export type TagUpdateInput = z.infer<typeof tagUpdateSchema>
